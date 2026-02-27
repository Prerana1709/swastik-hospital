from fastapi import APIRouter, Query
from app.controllers import report_controller
from typing import Optional

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/analytics")
async def get_analytics(
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    doctor_id: Optional[str] = Query(None),
    program_type: Optional[str] = Query(None)
):
    return await report_controller.get_report_analytics(
        from_date=from_date,
        to_date=to_date,
        doctor_id=doctor_id,
        program_type=program_type
    )
