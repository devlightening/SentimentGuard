import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "sentimentguard")
HMAC_SECRET = os.getenv("HMAC_SECRET", "sentimentguard-secret-key")
WORKER_PORT = int(os.getenv("WORKER_PORT", "8000"))
GENESIS_HASH = "GENESIS"
