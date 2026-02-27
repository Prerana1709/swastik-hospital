from app.config.database import get_db
from datetime import datetime

async def get_logs():
    db = get_db()
    cursor = db["activity_logs"].find().sort("timestamp", -1).limit(100)
    logs = []
    async for log in cursor:
        log["_id"] = str(log["_id"])
        logs.append(log)
    return logs

async def log_activity(user: str, module: str, action: str):
    db = get_db()
    log_entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "user": user,
        "module": module,
        "action": action
    }
    await db["activity_logs"].insert_one(log_entry)
    return log_entry
