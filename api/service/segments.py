from ..data.dataManager import segments_x_mu_usage, get_segment


def load_segments():
    return segments_x_mu_usage


def load_segment(lat, lon):
    destination_segments = get_segment(lat, lon)
    return destination_segments
