import hashlib
import hmac
import base64
from app.config import HMAC_SECRET

_FIELDS_TO_MASK = ["user_name", "email", "user_id", "phone"]


def mask_value(value: str) -> str:
    if not value:
        return ""
    key = HMAC_SECRET.encode("utf-8")
    msg = value.strip().lower().encode("utf-8")
    digest = hmac.new(key, msg, hashlib.sha256).digest()
    return base64.urlsafe_b64encode(digest).decode("utf-8").rstrip("=")


def anonymize_row(row: dict) -> dict:
    result = dict(row)
    for field in _FIELDS_TO_MASK:
        if field in result and result[field]:
            result[field] = mask_value(str(result[field]))
    return result


def get_masked_user(row: dict) -> str:
    for field in ["user_name", "email", "user_id"]:
        if field in row and row[field]:
            return mask_value(str(row[field]))
    return "anonymous"
