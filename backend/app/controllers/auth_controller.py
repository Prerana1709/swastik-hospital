from fastapi import HTTPException
from app.config.database import get_db
from app.utils.auth import verify_password, create_access_token
from app.utils.auth import get_password_hash
from app.schemas.auth import LoginRequest, UserCreate


async def get_user_by_username(username: str):
    db = get_db()
    user = await db["users"].find_one({"username": username})
    return user


async def login_user(credentials: LoginRequest):
    user = await get_user_by_username(credentials.username)
    if not user or not verify_password(credentials.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token(data={"sub": user["username"], "id": str(user["_id"])})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": user["username"],
            "full_name": user.get("full_name"),
            "role": user.get("role", "user"),
        },
    }


async def create_user(data: UserCreate):
    db = get_db()
    existing = await db["users"].find_one({"username": data.username})
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    from bson import ObjectId
    doc = {
        "username": data.username,
        "hashed_password": get_password_hash(data.password),
        "email": data.email,
        "full_name": data.full_name,
        "role": data.role or "user",
    }
    result = await db["users"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


async def ensure_default_user():
    """Create default admin user if no users exist (for first run)."""
    db = get_db()
    n = await db["users"].count_documents({})
    if n == 0:
        from app.utils.auth import get_password_hash
        await db["users"].insert_one({
            "username": "admin",
            "hashed_password": get_password_hash("admin123"),
            "full_name": "Administrator",
            "role": "admin",
        })
