"""MongoDB connection using Motor (async driver)."""
import os
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "swastik_hospital")

client: Optional[AsyncIOMotorClient] = None
database = None


async def connect_to_mongo():
    """Connect to MongoDB on startup."""
    global client, database
    client = AsyncIOMotorClient(MONGO_URI)
    database = client[DB_NAME]


async def close_mongo():
    """Close MongoDB connection on shutdown."""
    global client
    if client:
        client.close()
