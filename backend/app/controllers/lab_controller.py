from app.config.database import get_db
from bson import ObjectId
from datetime import datetime
from app.controllers import admin_controller

async def create_lab_request(uhid: str, patient_name: str, tests: str, source: str = "OPD", priority: str = "Normal"):
    db = get_db()
    order_id = f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    request_doc = {
        "orderId": order_id,
        "uhid": uhid,
        "patientName": patient_name,
        "tests": tests,
        "source": source,
        "priority": priority,
        "status": "ORDERED",
        "created_at": datetime.utcnow(),
        "results": []
    }
    
    result = await db["lab_requests"].insert_one(request_doc)
    request_doc["_id"] = str(result.inserted_id)
    
    # Log activity
    await admin_controller.log_activity("System/Doctor", "Clinical", f"Created lab order {order_id} for {patient_name} ({uhid})")
    
    return request_doc

async def get_lab_requests(status: str = None, skip: int = 0, limit: int = 100):
    db = get_db()
    query = {}
    if status:
        query["status"] = status
        
    cursor = db["lab_requests"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    items = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return items

async def get_lab_request_by_order_id(order_id: str):
    db = get_db()
    doc = await db["lab_requests"].find_one({"orderId": order_id})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

async def update_lab_status(order_id: str, status: str, sample_id: str = None, collection_time: str = None):
    db = get_db()
    update_data = {"status": status, "updated_at": datetime.utcnow()}
    if sample_id:
        update_data["sampleId"] = sample_id
    if collection_time:
        update_data["collectionTime"] = collection_time
        
    result = await db["lab_requests"].update_one(
        {"orderId": order_id},
        {"$set": update_data}
    )
    
    if result.modified_count > 0:
        await admin_controller.log_activity("System/Lab", "Lab", f"Updated lab order {order_id} status to {status}")
        return True
    return False

async def save_lab_results(order_id: str, results: list, status: str = "VERIFIED"):
    db = get_db()
    result = await db["lab_requests"].update_one(
        {"orderId": order_id},
        {"$set": {
            "results": results,
            "status": status,
            "updated_at": datetime.utcnow(),
            "verified_at": datetime.utcnow() if status == "VERIFIED" else None
        }}
    )
    
    if result.modified_count > 0:
        await admin_controller.log_activity("System/Lab", "Lab", f"Saved results for lab order {order_id} - status: {status}")
        return True
    return False

async def get_lab_stats():
    db = get_db()
    pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    cursor = db["lab_requests"].aggregate(pipeline)
    stats = {}
    async for item in cursor:
        stats[item["_id"]] = item["count"]
    return stats
