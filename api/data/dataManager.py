import geopandas as gpd
import pyproj
from shapely import Point
from api.settings import ATOM_DIR

CRS = 4326
HOURS_IN_YEAR = 8766
precision = 8

stations = gpd.read_parquet(f'{ATOM_DIR}/stations.parquet').to_crs(pyproj.CRS.from_epsg(CRS))
catchment_area = gpd.read_parquet(f'{ATOM_DIR}/verzorgingsgebied.parquet').to_crs(pyproj.CRS.from_epsg(CRS))

low_voltage_cables_x_station = gpd.read_parquet(f'{ATOM_DIR}/laagspanningskabels_x_station.pyarrow')
zipcode_segments_x_station = gpd.read_parquet(f'{ATOM_DIR}/postcode_segments_x_station.pyarrow')
segments_x_mu_usage = gpd.read_parquet(f'{ATOM_DIR}/segments_x_mu_usage.parquet')


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
