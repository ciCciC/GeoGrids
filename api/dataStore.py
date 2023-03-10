import geopandas as gpd
import pyproj
from shapely import Point
import pandas as pd
import numpy as np

CRS = 4326
HOURS_IN_YEAR = 8760

stations = gpd.read_parquet('data/atom/stations.parquet')
verzorgingsgebied = gpd.read_parquet('data/atom/verzorgingsgebied.parquet')
laagspanningskabels_x_station = gpd.read_parquet('data/atom/laagspanningskabels_x_station.pyarrow')
postcode_segments_x_station = gpd.read_parquet('data/atom/postcode_segments_x_station.pyarrow')
segments_x_mu_usage = pd.read_parquet('data/atom/segments_x_mu_usage.parquet')

stations = stations.to_crs(pyproj.CRS.from_epsg(CRS))
verzorgingsgebied = verzorgingsgebied.to_crs(pyproj.CRS.from_epsg(CRS))


def kwh_to_kw(kwh):
    return kwh / HOURS_IN_YEAR


def kwh_to_mva(kwh):
    kw = kwh_to_kw(kwh)
    return kw / 1000


def get_mu_svj(station):
    grouped = postcode_segments_x_station[postcode_segments_x_station.station == station].groupby('clusterid_zipcodes')
    segment_mu_usage = np.mean([v['mean_svj'].iloc[0] for k, v in grouped if len(v['mean_svj']) > 0])
    return segment_mu_usage


def geo_to_point(lat, lon) -> Point:
    return Point(lat, lon)


def get_segment(lat, lon):
    precision = 8
    address = geo_to_point(lat, lon)

    to_drop = ['peildatum']

    destination_segment_idx = address.intersects(verzorgingsgebied.geometry)
    destination_segments = verzorgingsgebied[destination_segment_idx].copy()

    segment_mu_usage = get_mu_svj(destination_segments['station'].values[0])

    destination_segments['mu_usage_kwh'] = round(segment_mu_usage, precision)
    destination_segments['mu_usage_kw'] = round(kwh_to_kw(segment_mu_usage), precision)
    destination_segments['mu_usage_mva'] = round(kwh_to_mva(segment_mu_usage), precision)

    return destination_segments.drop(to_drop, axis=1)


def load_segment(lat, lon):
    destination_segments = get_segment(lat, lon)
    return destination_segments


def load_station(lat, lon):
    destination_segments = get_segment(lat, lon)

    to_drop = ['peildatum']

    destination_station_idx = destination_segments.iloc[0, :].geometry.intersects(stations.geometry)
    destination_station = stations[destination_station_idx]
    destination_station = destination_station.drop(to_drop, axis=1)

    return destination_station


def load_segments():
    # Revisit calc mu sjv!
    cols = ['station', 'netbeheerder', 'status', 'beschikbareCapaciteitInvoedingHuidigMva',
            'beschikbareCapaciteitAfnameHuidigMva',
            'verwachtJaarVanOverbelastingInvoeding', 'verwachtJaarVanOverbelastingAfname', 'geometry']

    segments = verzorgingsgebied[cols].merge(segments_x_mu_usage, on='station')
    segments = segments.rename(columns={'mu_svj': 'mu_sjv'})
    segments['mu_sjv'] = segments['mu_sjv'].apply(lambda x: round(x, 2))

    return segments


def load_nets(station):
    nets = laagspanningskabels_x_station[laagspanningskabels_x_station.station == station]
    return nets


def load_zipcode_segments(station):
    zipcode_segments = postcode_segments_x_station[postcode_segments_x_station.station == station]
    zipcode_segments = zipcode_segments[['zipcode', 'geometry', 'mean_svj', 'clusterid_zipcodes']]
    return zipcode_segments
