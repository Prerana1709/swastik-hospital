from fastapi import APIRouter
from app.controllers import billing_controller

router = APIRouter(prefix="/api/billing", tags=["billing"])

@router.get("/stats")
async def get_billing_stats():
    return await billing_controller.get_billing_stats()
