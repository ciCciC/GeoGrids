import geopandas as gpd
import pyproj
from shapely import Point

CRS = 4326

stations = gpd.read_parquet('data/atom/stations.parquet')
verzorgingsgebied = gpd.read_parquet('data/atom/verzorgingsgebied.parquet')
laagspanningskabels_x_station = gpd.read_parquet('data/atom/laagspanningskabels_x_station.pyarrow')

stations = stations.to_crs(pyproj.CRS.from_epsg(CRS))
verzorgingsgebied = verzorgingsgebied.to_crs(pyproj.CRS.from_epsg(CRS))


def geo_to_point(lat, lon) -> Point:
    return Point(lat, lon)


def get_segment(lat, lon):
    address = geo_to_point(lat, lon)

    to_drop = ['peildatum']

    destination_segment_idx = address.intersects(verzorgingsgebied.geometry)
    destination_segments = verzorgingsgebied[destination_segment_idx]

    return destination_segments.drop(to_drop, axis=1)


def load_segment(lat, lon):
    destination_segments = get_segment(lat, lon)
    return destination_segments


def load_station(lat, lon):
    destination_segments = get_segment(lat, lon)

    to_drop = ['peildatum']

    destination_station_idx = destination_segments.iloc[0, :].geometry.intersects(stations.geometry)
    destination_station = stations[destination_station_idx]

    return destination_station.drop(to_drop, axis=1)


def load_segments():
    cols = ['station', 'netbeheerder', 'status', 'beschikbareCapaciteitInvoedingHuidigMva',
            'beschikbareCapaciteitAfnameHuidigMva',
            'verwachtJaarVanOverbelastingInvoeding', 'verwachtJaarVanOverbelastingAfname', 'geometry']

    return verzorgingsgebied[cols]


def load_nets(station):
    nets = laagspanningskabels_x_station[laagspanningskabels_x_station.station == station]
    print(len(nets))
    return nets
