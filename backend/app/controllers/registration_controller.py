from fastapi import HTTPException
from app.config.database import get_db
from app.controllers import admin_controller
from app.utils.uhid import generate_uhid
from app.schemas.registration import (
    PatientRegistrationCreate,
    OPDRegistrationCreate,
    IPDRegistrationCreate,
    DoctorRegistrationCreate,
    StaffRegistrationCreate,
    AppointmentCreate,
)
from datetime import datetime
from bson import ObjectId


async def create_patient(data: PatientRegistrationCreate):
    db = get_db()
    uhid = await generate_uhid()
    doc = {
        "uhid": uhid,
        "name": data.name,
        "age": data.age,
        "gender": data.gender,
        "phone": data.phone,
        "address": data.address,
        "guardian_name": data.guardian_name,
        "photo_base64": data.photo_base64,
        "created_at": datetime.utcnow(),
    }
    result = await db["patients"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)

    # Log activity
    await admin_controller.log_activity("System/Admin", "Registration", f"Registered new patient: {data.name} ({uhid})")

    return doc


async def get_patient_by_uhid(uhid: str):
    db = get_db()
    patient = await db["patients"].find_one({"uhid": uhid})
    if not patient:
        return None
    patient["_id"] = str(patient["_id"])
    return patient


async def list_patients(skip: int = 0, limit: int = 100):
    db = get_db()
    cursor = db["patients"].find().sort("created_at", -1).skip(skip).limit(limit)
    items = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return items


async def create_opd_registration(data: OPDRegistrationCreate):
    patient = await get_patient_by_uhid(data.uhid)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient UHID not found. Register patient first.")
    db = get_db()
    doc = {
        "uhid": data.uhid,
        "patient_name": data.patient_name or patient.get("name"),
        "department": data.department,
        "doctor_id": data.doctor_id,
        "visit_type": data.visit_type or "OPD",
        "notes": data.notes,
        "created_at": datetime.utcnow(),
    }
    result = await db["opd_registrations"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)

    # Log activity
    await admin_controller.log_activity("System/Admin", "OPD", f"Registered OPD visit for {doc['patient_name']} ({data.uhid})")

    return doc


async def create_ipd_registration(data: IPDRegistrationCreate):
    patient = await get_patient_by_uhid(data.uhid)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient UHID not found. Register patient first.")
    db = get_db()
    doc = {
        "uhid": data.uhid,
        "patient_name": data.patient_name or patient.get("name"),
        "ward": data.ward,
        "bed_number": data.bed_number,
        "admission_reason": data.admission_reason,
        "admitted_by": data.admitted_by,
        "notes": data.notes,
        "created_at": datetime.utcnow(),
        "status": "admitted",
    }
    result = await db["ipd_registrations"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


async def create_doctor(data: DoctorRegistrationCreate):
    db = get_db()
    doc = {
        "name": data.name,
        "specialization": data.specialization,
        "qualification": data.qualification,
        "phone": data.phone,
        "email": data.email,
        "department": data.department,
        "created_at": datetime.utcnow(),
    }
    result = await db["doctors"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


async def create_staff(data: StaffRegistrationCreate):
    db = get_db()
    doc = {
        "name": data.name,
        "role": data.role,
        "department": data.department,
        "phone": data.phone,
        "email": data.email,
        "created_at": datetime.utcnow(),
    }
    result = await db["staff"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


async def create_appointment(data: AppointmentCreate):
    patient = await get_patient_by_uhid(data.uhid)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient UHID not found. Register patient first.")
    db = get_db()
    doc = {
        "uhid": data.uhid,
        "patient_name": data.patient_name or patient.get("name"),
        "doctor_id": data.doctor_id,
        "appointment_date": data.appointment_date,
        "appointment_time": data.appointment_time,
        "type": data.type,
        "notes": data.notes,
        "created_at": datetime.utcnow(),
        "status": "scheduled",
    }
    result = await db["appointments"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


async def list_opd(skip: int = 0, limit: int = 100):
    db = get_db()
    cursor = db["opd_registrations"].find().sort("created_at", -1).skip(skip).limit(limit)
    items = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return items


async def list_ipd(skip: int = 0, limit: int = 100):
    db = get_db()
    cursor = db["ipd_registrations"].find({"status": "admitted"}).sort("created_at", -1).skip(skip).limit(limit)
    items = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return items


async def list_appointments(uhid: str | None = None, skip: int = 0, limit: int = 100):
    db = get_db()
    q = {} if not uhid else {"uhid": uhid}
    cursor = db["appointments"].find(q).sort("appointment_date", -1).skip(skip).limit(limit)
    items = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return items


async def get_dashboard_counts():
    db = get_db()
    patients = await db["patients"].count_documents({})
    opd = await db["opd_registrations"].count_documents({})
    ipd = await db["ipd_registrations"].count_documents({"status": "admitted"})
    appointments = await db["appointments"].count_documents({"status": "scheduled"})
    return {"patients": patients, "opd": opd, "ipd": ipd, "appointments": appointments}
