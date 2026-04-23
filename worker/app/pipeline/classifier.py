"""
Rule-based sentiment + category classifier.
Architecture is ready for model replacement — swap classify_sentiment() with any ML pipeline.
"""
from textblob import TextBlob

_COMPLAINT_KEYWORDS = [
    "geç", "kötü", "berbat", "bozuk", "hata", "sorun", "problem", "şikayet",
    "memnun değil", "hayal kırıklığı", "iade", "iade etmek", "çalışmıyor",
    "broken", "damaged", "wrong", "terrible", "awful", "worst", "defective",
    "delayed", "late", "error", "issue", "problem", "complaint", "refund"
]
_PRAISE_KEYWORDS = [
    "harika", "mükemmel", "süper", "memnun", "beğendim", "teşekkür", "güzel",
    "kaliteli", "hızlı", "perfect", "excellent", "amazing", "great", "love",
    "fantastic", "awesome", "wonderful", "satisfied", "happy", "recommend"
]
_QUESTION_KEYWORDS = [
    "nasıl", "neden", "ne zaman", "nerede", "kimdir", "hangi", "?",
    "how", "why", "when", "where", "what", "which", "who", "is there",
    "can i", "should i", "do you", "does it"
]
_DISAPPOINTMENT_KEYWORDS = [
    "hayal kırıklığı", "beklediğim değil", "umduğum gibi değil", "üzüldüm",
    "beklentimi karşılamadı", "disappointed", "expected better", "not as described",
    "not worth", "overhyped", "misleading"
]


def classify_sentiment(text: str) -> tuple[str, float]:
    if not text or not text.strip():
        return "Neutral", 0.0

    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1.0 to 1.0

    if polarity > 0.1:
        return "Positive", round(polarity, 4)
    elif polarity < -0.1:
        return "Negative", round(abs(polarity), 4)
    else:
        return "Neutral", round(abs(polarity), 4)


def classify_category(text: str) -> str:
    lower = text.lower()

    if any(k in lower for k in _QUESTION_KEYWORDS):
        return "Question"
    if any(k in lower for k in _DISAPPOINTMENT_KEYWORDS):
        return "Disappointment"
    if any(k in lower for k in _COMPLAINT_KEYWORDS):
        return "Complaint"
    if any(k in lower for k in _PRAISE_KEYWORDS):
        return "Praise"
    return "Other"
