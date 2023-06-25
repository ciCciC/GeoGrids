from ..data.dataManager import low_voltage_cables_x_station, zipcode_segments_x_station


def load_low_voltage_nets(station):
    return low_voltage_cables_x_station[low_voltage_cables_x_station.station == station]


def load_zipcode_segments(station):
    zipcode_segments = zipcode_segments_x_station[zipcode_segments_x_station.station == station]
    return zipcode_segments[['zipcode', 'geometry', 'mean_svj', 'clusterid_zipcodes']]
