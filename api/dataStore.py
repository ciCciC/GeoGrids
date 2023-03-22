import geopandas as gpd
import pyproj
from shapely import Point

CRS = 4326
HOURS_IN_YEAR = 8766  # https://nl.wikipedia.org/wiki/Uur#:~:text=Een%20etmaal%20duurt%2024%20uur,jaar%20gemiddeld%20ongeveer%208766%20uur.
precision = 8

stations = gpd.read_parquet('data/atom/stations.parquet').to_crs(pyproj.CRS.from_epsg(CRS))
catchment_area = gpd.read_parquet('data/atom/verzorgingsgebied.parquet').to_crs(pyproj.CRS.from_epsg(CRS))

low_voltage_cables_x_station = gpd.read_parquet('data/atom/laagspanningskabels_x_station.pyarrow')
zipcode_segments_x_station = gpd.read_parquet('data/atom/postcode_segments_x_station.pyarrow')
segments_x_mu_usage = gpd.read_parquet('data/atom/segments_x_mu_usage.parquet')
distribution_boxes = gpd.read_parquet('data/atom/laagspanningsverdeelkasten.pyarrow').to_crs(pyproj.CRS.from_epsg(CRS))
medium_voltage_installations = gpd.read_parquet('data/atom/middenspanningsinstallaties.pyarrow').to_crs(
    pyproj.CRS.from_epsg(CRS))


def kwh_to_kw(kwh):
    return kwh / HOURS_IN_YEAR


def kwh_to_mva(kwh):
    return kwh_to_kw(kwh) / 1000


def get_mu_sjv(station):
    return zipcode_segments_x_station[zipcode_segments_x_station.station == station].mean_svj.sum()


def geo_to_point(lat, lon) -> Point:
    return Point(lat, lon)


def get_segment(lat, lon):
    address = geo_to_point(lat, lon)

    to_drop = ['peildatum']

    destination_segment_idx = address.intersects(catchment_area.geometry)
    destination_segments = catchment_area[destination_segment_idx].copy()

    segment_mu_usage = get_mu_sjv(destination_segments['station'].values[0])

    destination_segments['kwh'] = round(segment_mu_usage, precision)
    destination_segments['kw'] = round(kwh_to_kw(segment_mu_usage), precision)
    destination_segments['mva'] = round(kwh_to_mva(segment_mu_usage), precision)

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
    return segments_x_mu_usage


def load_low_voltage_nets(station):
    return low_voltage_cables_x_station[low_voltage_cables_x_station.station == station]


def load_zipcode_segments(station):
    zipcode_segments = zipcode_segments_x_station[zipcode_segments_x_station.station == station]
    return zipcode_segments[['zipcode', 'geometry', 'mean_svj', 'clusterid_zipcodes']]


def load_distribution_boxes():
    return distribution_boxes


def load_medium_voltage_installations():
    return medium_voltage_installations
