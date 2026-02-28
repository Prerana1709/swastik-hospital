from pydantic import BaseModel, Field
from typing import Optional, List, Any


class BillItemCreate(BaseModel):
    category: str = ""
    item_name: str = ""
    quantity: float = 1
    price: float = 0
    tax: float = 0
    total: float = 0


class CreateBillRequest(BaseModel):
    patient_id: Optional[str] = None
    uhid: Optional[str] = None
    visit_id: Optional[str] = None
    admission_id: Optional[str] = None
    subtotal: float = 0
    tax: float = 0
    discount: float = 0
    total: float = 0
    insurance_covered: float = 0
    patient_payable: float = 0
    due_amount: float = 0
    items: List[Any] = []
    created_by: str = ""


class AddPaymentRequest(BaseModel):
    amount: float = Field(..., ge=0)
    method: str = "Cash"
    transaction_reference: str = ""
    created_by: str = ""
