from fastapi import APIRouter, HTTPException
from app.controllers import billing_controller
from app.schemas.billing import CreateBillRequest, AddPaymentRequest

router = APIRouter(prefix="/api", tags=["billing"])


@router.get("/stats")
async def get_billing_stats():
    return await billing_controller.get_billing_stats()


@router.get("/billing/stats")
async def get_billing_stats_legacy():
    """Legacy path for frontend."""
    return await billing_controller.get_billing_stats()


@router.post("/bills")
async def create_bill(data: CreateBillRequest):
    try:
        return await billing_controller.create_bill(data.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/bills")
async def list_bills(skip: int = 0, limit: int = 100):
    return await billing_controller.get_bills(skip=skip, limit=limit)


@router.get("/bills/patient/{patient_id}")
async def get_patient_bills(patient_id: str):
    return await billing_controller.get_bills_by_patient(patient_id)


@router.get("/bills/{bill_id}")
async def get_bill(bill_id: str):
    bill = await billing_controller.get_bill_by_id(bill_id)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return bill


@router.post("/bills/{bill_id}/payment")
async def add_bill_payment(bill_id: str, data: AddPaymentRequest):
    bill = await billing_controller.add_payment(
        bill_id,
        data.amount,
        data.method,
        data.transaction_reference,
        data.created_by,
    )
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return bill
