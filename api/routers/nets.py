from fastapi import APIRouter
from ..service import nets
from ..utils import responseJson

router = APIRouter(tags=["nets"], prefix="/nets")


@router.get("/{station}")
async def get_lvn_by_station(station: str):
    result = nets.load_low_voltage_nets(station)
    return responseJson.features_to_json(result)


@router.get("/zipcode_segments/{station}")
async def get_zipcode_segments_by_station(station: str):
    result = nets.load_zipcode_segments(station)
    return responseJson.features_to_json(result)
