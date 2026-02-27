from app.config.database import get_db
import random
from datetime import datetime

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
