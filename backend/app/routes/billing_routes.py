from fastapi import APIRouter, HTTPException, Depends, Request
from app.controllers import billing_controller
from app.schemas.billing import CreateBillRequest, AddPaymentRequest
from app.middleware.auth import require_role

router = APIRouter(prefix="/api", tags=["billing"])


@router.get("/stats", dependencies=[Depends(require_role(["billing", "admin"]))])
async def get_billing_stats():
    return await billing_controller.get_billing_stats()


@router.get("/billing/stats", dependencies=[Depends(require_role(["billing", "admin"]))])
async def get_billing_stats_legacy():
    """Legacy path for frontend."""
    return await billing_controller.get_billing_stats()


@router.post("/bills", dependencies=[Depends(require_role(["billing"]))])
async def create_bill(request: Request, data: CreateBillRequest):
    try:
        # Pass request IP for audit log
        payload = data.model_dump()
        payload["ip_address"] = request.client.host if request.client else "unknown"
        return await billing_controller.create_bill(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/bills", dependencies=[Depends(require_role(["billing", "admin"]))])
async def list_bills(skip: int = 0, limit: int = 100):
    return await billing_controller.get_bills(skip=skip, limit=limit)


@router.get("/bills/patient/{patient_id}")
async def get_patient_bills(patient_id: str):
    # This might be needed by reception/doctors, no strict billing restrict here
    return await billing_controller.get_bills_by_patient(patient_id)


@router.get("/bills/{bill_id}")
async def get_bill(bill_id: str):
    bill = await billing_controller.get_bill_by_id(bill_id)
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return bill


@router.post("/bills/{bill_id}/payment", dependencies=[Depends(require_role(["billing"]))])
async def add_bill_payment(request: Request, bill_id: str, data: AddPaymentRequest):
    client_ip = request.client.host if request.client else "unknown"
    if data.method in ["UPI", "Card", "Insurance"] and not data.transaction_reference.strip():
        raise HTTPException(status_code=400, detail="Transaction reference is required for this payment method.")
        
    bill = await billing_controller.add_payment(
        bill_id,
        data.amount,
        data.method,
        data.transaction_reference,
        data.created_by,
        client_ip
    )
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    return bill
