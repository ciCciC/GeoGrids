from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import responseJson
from .dataStore import load_segment, load_station, load_segments, load_nets

app = FastAPI(title='Geo2People')

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root(lat: float, lon: float):
    result = load_segment(lat, lon)
    return responseJson.feature_to_json(result)


@app.get("/station")
async def root(lat: float, lon: float):
    result = load_station(lat, lon)
    return responseJson.feature_to_json(result)


@app.get("/segments")
async def root():
    result = load_segments()
    return responseJson.features_to_json(result)


@app.get("/nets/low")
async def root(station: str):
    result = load_nets(station)
    return responseJson.features_to_json(result)
