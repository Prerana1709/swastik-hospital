from fastapi import APIRouter, HTTPException, Query
from app.controllers import lab_controller
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class LabRequestCreate(BaseModel):
    uhid: str
    patientName: str
    tests: str
    source: Optional[str] = "OPD"
    priority: Optional[str] = "Normal"

class LabStatusUpdate(BaseModel):
    status: str
    sampleId: Optional[str] = None
    collectionTime: Optional[str] = None

class LabResult(BaseModel):
    id: int
    name: str
    unit: str
    normalRange: str
    value: str
    remarks: Optional[str] = ""
    flag: str

class LabResultsUpdate(BaseModel):
    results: List[LabResult]
    status: str # VERIFIED or REPORTED

@router.post("/requests")
async def create_request(data: LabRequestCreate):
    return await lab_controller.create_lab_request(
        data.uhid, data.patientName, data.tests, data.source, data.priority
    )

@router.get("/requests")
async def get_requests(status: Optional[str] = None, skip: int = 0, limit: int = 100):
    return await lab_controller.get_lab_requests(status, skip, limit)

@router.get("/requests/{order_id}")
async def get_request(order_id: str):
    res = await lab_controller.get_lab_request_by_order_id(order_id)
    if not res:
        raise HTTPException(status_code=404, detail="Order not found")
    return res

@router.patch("/requests/{order_id}/status")
async def update_status(order_id: str, data: LabStatusUpdate):
    success = await lab_controller.update_lab_status(
        order_id, data.status, data.sampleId, data.collectionTime
    )
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Status updated"}

@router.post("/requests/{order_id}/results")
async def save_results(order_id: str, data: LabResultsUpdate):
    # Convert Pydantic models to dicts
    results_list = [res.dict() for res in data.results]
    success = await lab_controller.save_lab_results(order_id, results_list, data.status)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Results saved"}

@router.get("/stats")
async def get_stats():
    return await lab_controller.get_lab_stats()
