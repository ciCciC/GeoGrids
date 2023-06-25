def str_to_floats(latlon: str):
    poi = latlon.strip().split(',')
    return float(poi[0]), float(poi[1])
