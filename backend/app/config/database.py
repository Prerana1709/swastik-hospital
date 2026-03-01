"""MongoDB connection using Motor (async)."""
import os
import certifi
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure

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
    # Use certifi CA bundle to avoid SSL handshake errors with MongoDB Atlas (common on Windows)
    client = AsyncIOMotorClient(MONGO_URI, tlsCAFile=certifi.where(), tlsAllowInvalidCertificates=True)
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
