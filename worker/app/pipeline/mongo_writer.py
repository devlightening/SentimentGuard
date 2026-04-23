import hashlib
import uuid
from datetime import datetime, timezone
from pymongo import MongoClient
from app.config import MONGO_URI, MONGO_DB, GENESIS_HASH


def _get_db():
    client = MongoClient(MONGO_URI)
    return client[MONGO_DB]


def _build_canonical(job_id: str, masked_user: str, comment: str,
                      sentiment: str, category: str, score: float) -> str:
    return (f"jobId={job_id}|maskedUser={masked_user}|comment={comment}"
            f"|sentiment={sentiment}|category={category}|score={score:.4f}")


def _sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def write_results(job_id: str, rows: list[dict]) -> str:
    db = _get_db()
    prev_hash = GENESIS_HASH

    docs = []
    for row in rows:
        masked_user = row.get("masked_user", "anonymous")
        comment = row.get("original_comment", "")
        sentiment = row.get("sentiment", "Neutral")
        category = row.get("category", "Other")
        score = float(row.get("score", 0.0))

        canonical = _build_canonical(job_id, masked_user, comment, sentiment, category, score)
        current_hash = _sha256(canonical + "|" + prev_hash)

        doc = {
            "_id": str(uuid.uuid4()),
            "jobId": job_id,
            "maskedUser": masked_user,
            "originalComment": comment,
            "sentiment": sentiment,
            "category": category,
            "score": score,
            "prevHash": prev_hash,
            "currentHash": current_hash,
            "createdAt": datetime.now(timezone.utc),
        }
        docs.append(doc)
        prev_hash = current_hash

    if docs:
        db["analysis_results"].insert_many(docs)

    return prev_hash


def update_job_status(job_id: str, status: str, total: int = 0,
                      processed: int = 0, error: str | None = None):
    db = _get_db()
    fields: dict = {"status": status}
    if status == "Running":
        fields["startedAt"] = datetime.now(timezone.utc)
    if status in ("Completed", "Failed"):
        fields["completedAt"] = datetime.now(timezone.utc)
    if total:
        fields["totalRecords"] = total
    if processed:
        fields["processedRecords"] = processed
    if error:
        fields["errorMessage"] = error

    db["analysis_jobs"].update_one({"_id": job_id}, {"$set": fields})
