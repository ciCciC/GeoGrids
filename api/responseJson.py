from fastapi.responses import JSONResponse
import json


def to_json(obj):
    return json.loads(obj.to_json())


def feature_to_json(segment) -> JSONResponse:
    segment = to_json(segment)['features'][0]

    response = {
        "type": "Feature",
        "properties": segment['properties'] if 'properties' in segment else {},
        "geometry": {
            "type": segment['geometry']['type'],
            "coordinates": segment['geometry']['coordinates']
        }
    }

    return JSONResponse(response)


def features_to_json(segments) -> JSONResponse:
    segments = to_json(segments)['features']
    response = {
        "type": "FeatureCollection",
        "features": segments
    }

    return JSONResponse(response)
