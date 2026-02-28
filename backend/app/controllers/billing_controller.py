from app.config.database import get_db
from app.ws.billing_ws import broadcast
import random
from datetime import datetime
from bson import ObjectId

BILLS_COLLECTION = "bills"
COUNTERS_COLLECTION = "counters"
AUDIT_COLLECTION = "billing_audit"


async def _audit(action: str, bill_id: str = None, user_id: str = "", details: dict = None, ip_address: str = "unknown"):
    """Append-only audit log for billing (no diagnosis, financial only) with IP trace."""
    db = get_db()
    await db[AUDIT_COLLECTION].insert_one({
        "action": action,
        "bill_id": bill_id,
        "user_id": user_id,
        "ip_address": ip_address,
        "timestamp": datetime.utcnow().isoformat(),
        "details": details or {},
    })


async def _next_invoice_number():
    """Generate SWH-YYYYMMDD-XXXX unique per day."""
    db = get_db()
    date_str = datetime.utcnow().strftime("%Y%m%d")
    key = f"invoice_{date_str}"
    doc = await db[COUNTERS_COLLECTION].find_one({"_id": key})
    if not doc:
        await db[COUNTERS_COLLECTION].insert_one({"_id": key, "seq": 1})
        seq = 1
    else:
        seq = doc.get("seq", 0) + 1
        await db[COUNTERS_COLLECTION].update_one({"_id": key}, {"$set": {"seq": seq}})
    return f"SWH-{date_str}-{seq:04d}"


async def get_billing_stats():
    db = get_db()
    
    # In a real scenario, we might query Crater's MySQL directly if they were on the same network
    # But for this integrated demo, we'll derive stats from hospital activity (Registrations/Admissions)
    # to provide a "live" feel that aligns with the rest of the EMR data.
    
    total_patients = await db["patients"].count_documents({})
    total_opd = await db["opd_registrations"].count_documents({})
    total_ipd = await db["ipd_admissions"].count_documents({})
    total_lab = await db["patient_documents"].count_documents({"category": "Psychiatric Lab"})
    
    # Financial Logic:
    # OPD: ₹500/visit
    # IPD: ₹5000/admission (base)
    # Lab: ₹1200/test avg
    
    opd_revenue = total_opd * 500
    ipd_revenue = total_ipd * 5000
    lab_revenue = total_lab * 1200
    
    total_revenue = opd_revenue + ipd_revenue + lab_revenue
    
    # Collections (assuming 92-96% collection rate)
    collection_rate = 94 + (random.random() * 2)
    collected_amount = int(total_revenue * (collection_rate / 100))
    outstanding_payments = total_revenue - collected_amount
    
    # Monthly trends (last 6 months)
    months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]
    revenue_chart = []
    
    # Historical base (approx)
    for i, month in enumerate(months):
        # Gradual growth simulation
        growth_factor = 0.8 + (i * 0.05) 
        monthly_rev = int((total_revenue / 6) * growth_factor) + random.randint(-5000, 5000)
        revenue_chart.append({
            "month": month,
            "revenue": round(monthly_rev / 100000, 1) # In Lakhs
        })

    return {
        "revenue_today": int(total_opd/20 * 500 + total_ipd/30 * 5000) + 12000, # Mock daily flux
        "revenue_mtd": collected_amount,
        "outstanding": outstanding_payments,
        "collection_rate": f"{collection_rate:.1f}%",
        "opd_share": f"{int((opd_revenue / total_revenue * 100)) if total_revenue > 0 else 0}%",
        "revenue_trends": revenue_chart,
        "summary_cards": [
            {"title": "Revenue (MTD)", "value": f"₹{collected_amount/100000:.1f}L", "accent": "1"},
            {"title": "Outstanding", "value": f"₹{outstanding_payments/1000:.0f}K", "accent": "2"},
            {"title": "Collection %", "value": f"{collection_rate:.1f}%", "accent": "3"},
            {"title": "OPD Share", "value": f"{int((opd_revenue/total_revenue*100)) if total_revenue > 0 else 0}%", "accent": "4"}
        ]
    }


async def create_bill(data: dict):
    """Create bill. Audit: no diagnosis, financial only."""
    db = get_db()
    invoice_number = await _next_invoice_number()
    client_ip = data.get("ip_address", "unknown")
    doc = {
        "invoice_number": invoice_number,
        "patient_id": data.get("patient_id"),
        "uhid": data.get("uhid"),
        "visit_id": data.get("visit_id"),
        "admission_id": data.get("admission_id"),
        "subtotal": float(data.get("subtotal", 0)),
        "tax": float(data.get("tax", 0)),
        "discount": float(data.get("discount", 0)),
        "insurance_covered": float(data.get("insurance_covered", 0)),
        "patient_payable": float(data.get("patient_payable", 0)),
        "due_amount": float(data.get("due_amount", 0)),
        "total": float(data.get("total", 0)),
        "status": "Pending",
        "items": data.get("items", []),
        "payments": [],
        "created_at": datetime.utcnow().isoformat(),
        "created_by": data.get("created_by", ""),
    }
    result = await db[BILLS_COLLECTION].insert_one(doc)
    doc["id"] = str(result.inserted_id)
    await _audit("bill_created", bill_id=doc["id"], user_id=doc.get("created_by", ""), details={"invoice_number": doc["invoice_number"]}, ip_address=client_ip)
    await broadcast("bill_created", {"bill_id": doc["id"], "invoice_number": doc["invoice_number"]})
    return doc


async def get_bills(skip: int = 0, limit: int = 100):
    db = get_db()
    cursor = db[BILLS_COLLECTION].find().sort("created_at", -1).skip(skip).limit(limit)
    bills = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        bills.append(doc)
    return bills


async def get_bill_by_id(bill_id: str):
    db = get_db()
    doc = await db[BILLS_COLLECTION].find_one({"_id": ObjectId(bill_id)})
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    return doc


async def add_payment(bill_id: str, amount: float, method: str, transaction_reference: str = "", user_id: str = "", ip_address: str = "unknown"):
    """Add payment. Audit: log user, IP, and time."""
    db = get_db()
    payment = {
        "amount": float(amount),
        "method": method,
        "transaction_reference": transaction_reference,
        "payment_date": datetime.utcnow().isoformat(),
        "created_by": user_id,
        "ip_address": ip_address,
    }
    bill = await db[BILLS_COLLECTION].find_one({"_id": ObjectId(bill_id)})
    if not bill:
        return None
    total_paid = sum(p.get("amount", 0) for p in bill.get("payments", [])) + float(amount)
    new_payments = bill.get("payments", []) + [payment]
    
    # Calculate Due
    insurance_covered = float(bill.get("insurance_covered", 0))
    grand_total = float(bill.get("total", 0))
    patient_payable = grand_total - insurance_covered
    
    status = "Paid" if total_paid >= patient_payable else "Partial"
    due_amount = max(0, patient_payable - total_paid)
    
    await db[BILLS_COLLECTION].update_one(
        {"_id": ObjectId(bill_id)},
        {"$set": {"payments": new_payments, "status": status, "due_amount": due_amount}}
    )
    await _audit("payment_entry", bill_id=bill_id, user_id=user_id, details={"amount": amount, "method": method, "status": status, "transaction_ref": transaction_reference}, ip_address=ip_address)
    
    updated = await get_bill_by_id(bill_id)
    await broadcast("payment_updated", {"bill_id": bill_id, "status": status, "due_amount": due_amount})
    return updated


async def get_bills_by_patient(patient_id: str):
    db = get_db()
    cursor = db[BILLS_COLLECTION].find({"$or": [{"patient_id": patient_id}, {"uhid": patient_id}]}).sort("created_at", -1)
    bills = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        bills.append(doc)
    return bills
