"""
Rule-based sentiment + category classifier.
Architecture is ready for model replacement - swap classify_sentiment() with any ML pipeline.
"""

from __future__ import annotations

from textblob import TextBlob

# MVP keyword lists: short, explainable, and easy to tune for an academic demo.
# Turkish keywords intentionally include native characters to match real input text.

_COMPLAINT_KEYWORDS = [
    "geç",
    "kötü",
    "berbat",
    "bozuk",
    "hata",
    "sorun",
    "problem",
    "şikayet",
    "memnun değil",
    "iade",
    "çalışmıyor",
    "kırık",
    "hasarlı",
    "eksik",
    "gecikti",
    "gecikme",
    "iptal",
    "broken",
    "damaged",
    "wrong",
    "terrible",
    "awful",
    "worst",
    "defective",
    "delayed",
    "late",
    "error",
    "complaint",
    "refund",
    "return",
]

_PRAISE_KEYWORDS = [
    "harika",
    "mükemmel",
    "süper",
    "memnun",
    "beğendim",
    "teşekkür",
    "güzel",
    "kaliteli",
    "hızlı",
    "perfect",
    "excellent",
    "amazing",
    "great",
    "love",
    "fantastic",
    "awesome",
    "wonderful",
    "satisfied",
    "happy",
    "recommend",
]

_QUESTION_KEYWORDS = [
    "nasıl",
    "neden",
    "ne zaman",
    "nerede",
    "kim",
    "hangi",
    "?",
    "how",
    "why",
    "when",
    "where",
    "what",
    "which",
    "who",
    "is there",
    "can i",
    "should i",
    "do you",
    "does it",
]

_DISAPPOINTMENT_KEYWORDS = [
    "hayal kırıklığı",
    "beklediğim değil",
    "umduğum gibi değil",
    "üzüldüm",
    "beklentimi karşılamadı",
    "disappointed",
    "expected better",
    "not as described",
    "not worth",
    "overhyped",
    "misleading",
]


def classify_sentiment(text: str) -> tuple[str, float]:
    """
    Sentiment label from TextBlob polarity.
    - polarity in [-1.0, 1.0]
    - label thresholds (MVP): > 0.10 => Positive, < -0.10 => Negative, otherwise Neutral
    Returns: (label, score) where score is |polarity| rounded to 4 decimals (0..1)
    """
    if not text or not text.strip():
        return "Neutral", 0.0

    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1.0 to 1.0

    if polarity > 0.1:
        return "Positive", round(polarity, 4)
    if polarity < -0.1:
        return "Negative", round(abs(polarity), 4)
    return "Neutral", round(abs(polarity), 4)


def classify_category(text: str) -> str:
    """
    Explainable category labels (MVP).
    Note: this is not a trained model; it is keyword-based for demo/academic clarity.
    """
    lower = (text or "").lower()

    # Negation handling to avoid obvious false positives from generic complaint terms.
    if "no issues" in lower or "no issue" in lower or "no problems" in lower or "no problem" in lower:
        return "Praise"
    if "sorun yok" in lower or "problem yok" in lower:
        return "Praise"

    if any(k in lower for k in _QUESTION_KEYWORDS):
        return "Question"
    if any(k in lower for k in _DISAPPOINTMENT_KEYWORDS):
        return "Disappointment"
    if any(k in lower for k in _COMPLAINT_KEYWORDS):
        return "Complaint"
    if any(k in lower for k in _PRAISE_KEYWORDS):
        return "Praise"
    return "Other"

