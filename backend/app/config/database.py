"""MongoDB connection using Motor (async)."""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://swastikAdmin:Admin%40123@swastikdata.nmey2l2.mongodb.net/?retryWrites=true&w=majority&appName=Swastikdata",
)
DB_NAME = os.getenv("DB_NAME", "swastik_hospital")

client = None
db = None


async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    try:
        await client.admin.command("ping")
    except ConnectionFailure as e:
        raise RuntimeError(f"MongoDB connection failed: {e}") from e


def get_db():
    if db is None:
        raise RuntimeError("Database not connected. Call connect_to_mongo() on startup.")
    return db


async def close_mongo():
    global client
    if client:
        client.close()
