from fastapi import APIRouter
from ..service import stations
from ..utils import responseJson, poiManager

router = APIRouter(tags=["stations"], prefix="/stations")


@router.get("/{latlon}")
async def get_station_by_latlon(latlon: str):
    lat, lon = poiManager.str_to_floats(latlon)
    result = stations.load_station(lat, lon)
    return responseJson.feature_to_json(result)
