from fastapi import APIRouter
from app.controllers import admin_controller
from pydantic import BaseModel

router = APIRouter(prefix="/api/admin", tags=["admin"])

class ActivityLogCreate(BaseModel):
    user: str
    module: str
    action: str

@router.get("/logs")
async def get_logs():
    return await admin_controller.get_logs()

@router.post("/logs")
async def create_log(log: ActivityLogCreate):
    return await admin_controller.log_activity(log.user, log.module, log.action)
