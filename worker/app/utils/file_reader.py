import csv
import json
import io


def read_file(file_path: str) -> list[dict]:
    if file_path.endswith(".csv"):
        return _read_csv(file_path)
    elif file_path.endswith(".json"):
        return _read_json(file_path)
    raise ValueError(f"Unsupported file type: {file_path}")


def _read_csv(path: str) -> list[dict]:
    with open(path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return [dict(row) for row in reader]


def _read_json(path: str) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        return data
    if isinstance(data, dict) and "data" in data:
        return data["data"]
    raise ValueError("JSON must be an array or {data: [...]}")
