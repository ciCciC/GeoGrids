from ..data.dataManager import get_segment, stations


def load_station(lat, lon):
    destination_segments = get_segment(lat, lon)

    to_drop = ['peildatum']

    destination_station_idx = destination_segments.iloc[0, :].geometry.intersects(stations.geometry)
    destination_station = stations[destination_station_idx]
    destination_station = destination_station.drop(to_drop, axis=1)

    return destination_station
