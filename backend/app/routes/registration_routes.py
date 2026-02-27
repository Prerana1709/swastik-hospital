from fastapi import APIRouter, Query
from app.schemas.registration import (
    PatientRegistrationCreate,
    OPDRegistrationCreate,
    IPDRegistrationCreate,
    DoctorRegistrationCreate,
    StaffRegistrationCreate,
    AppointmentCreate,
)
from app.controllers import registration_controller

router = APIRouter(prefix="/api", tags=["registration"])


@router.post("/patients")
async def register_patient(data: PatientRegistrationCreate):
    return await registration_controller.create_patient(data)


@router.get("/patients")
async def list_patients(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500)):
    return await registration_controller.list_patients(skip=skip, limit=limit)


@router.get("/patients/{uhid}")
async def get_patient(uhid: str):
    patient = await registration_controller.get_patient_by_uhid(uhid)
    if not patient:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.post("/opd")
async def register_opd(data: OPDRegistrationCreate):
    return await registration_controller.create_opd_registration(data)


@router.get("/opd")
async def list_opd(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500)):
    return await registration_controller.list_opd(skip=skip, limit=limit)


@router.post("/ipd")
async def register_ipd(data: IPDRegistrationCreate):
    return await registration_controller.create_ipd_registration(data)


@router.get("/ipd")
async def list_ipd(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500)):
    return await registration_controller.list_ipd(skip=skip, limit=limit)


@router.post("/doctors")
async def register_doctor(data: DoctorRegistrationCreate):
    return await registration_controller.create_doctor(data)


@router.get("/doctors")
async def list_doctors():
    from app.config.database import get_db
    db = get_db()
    cursor = db["doctors"].find()
    items = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return items


@router.post("/staff")
async def register_staff(data: StaffRegistrationCreate):
    return await registration_controller.create_staff(data)


@router.post("/appointments")
async def create_appointment(data: AppointmentCreate):
    return await registration_controller.create_appointment(data)


@router.get("/appointments")
async def list_appointments(
    uhid: str | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    return await registration_controller.list_appointments(uhid=uhid, skip=skip, limit=limit)


@router.get("/dashboard/counts")
async def dashboard_counts():
    return await registration_controller.get_dashboard_counts()
