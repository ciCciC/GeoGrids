from fastapi import APIRouter
from ..service import segments
from ..utils import responseJson, poiManager

router = APIRouter(tags=["segments"], prefix="/segments")


@router.get("/")
async def get_segments():
    result = segments.load_segments()
    return responseJson.features_to_json(result)


@router.get("/{latlon}")
async def get_segment_by_latlon(latlon: str):
    lat, lon = poiManager.str_to_floats(latlon)
    result = segments.load_segment(lat, lon)
    return responseJson.feature_to_json(result)
