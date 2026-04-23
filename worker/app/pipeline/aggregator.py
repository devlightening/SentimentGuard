from collections import Counter


def compute_top_comments(rows: list[dict], limit: int = 10) -> list[dict]:
    counter = Counter(r["original_comment"].strip().lower() for r in rows if r.get("original_comment"))
    top = counter.most_common(limit)
    return [{"comment": c, "count": n} for c, n in top]


def compute_distribution(rows: list[dict]) -> dict:
    sentiments = Counter(r["sentiment"] for r in rows)
    categories = Counter(r.get("category", "Other") for r in rows)
    return {
        "total": len(rows),
        "sentiment": dict(sentiments),
        "category": dict(categories),
    }
