import csv
import random
from datetime import datetime, timedelta
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "sample-data"


TR_NAMES = [
    "Ahmet", "Ayse", "Mehmet", "Elif", "Can", "Zeynep", "Mert", "Ece", "Hakan", "Selin",
    "Burak", "Sena", "Omer", "Ceren", "Emre", "Derya", "Furkan", "Melis", "Deniz", "Yusuf",
]

EN_NAMES = [
    "Alex", "Jamie", "Taylor", "Jordan", "Casey", "Morgan", "Avery", "Riley", "Cameron", "Quinn",
    "Logan", "Parker", "Reese", "Rowan", "Drew", "Harper", "Emerson", "Finley", "Blake", "Hayden",
]

PRODUCTS = [
    "Telefon", "Laptop", "Kulaklik", "Klavye", "Mouse", "KahveMakinesi", "Kamera", "Monitor", "Tablet", "Router",
    "Phone", "Laptop", "Headphones", "Keyboard", "Mouse", "CoffeeMachine", "Camera", "Monitor", "Tablet", "Router",
]

TR_COMMENTS = [
    "Urun kalitesi harika, cok memnun kaldim.",
    "Kargo cok gec geldi, bu konuda iyilestirme lazim.",
    "Iade sureci nasil isliyor?",
    "Fiyat performans acisindan basarili.",
    "Bekledigim kalite bu degildi, hayal kirikligi yasadim.",
    "Paketleme cok iyiydi, tesekkurler.",
    "Urun bozuk geldi, degisim istiyorum.",
    "Musteri hizmetleri cok hizli donus yapti.",
    "Kurulum zor oldu, daha iyi bir kilavuz lazim.",
    "Cok guzel, tavsiye ederim.",
    "Neden bu kadar gec teslim edildi?",
    "Eksik parca cikti, yardimci olur musunuz?",
    "Sorun yasamadim, her sey yolunda.",
    "Ses kalitesi super.",
    "Batarya suresi zayif, daha uzun olmasini beklerdim.",
]

EN_COMMENTS = [
    "Great quality, I'm very happy with it.",
    "Shipping was delayed and the box arrived damaged.",
    "How does the return process work?",
    "Good value for the price.",
    "Not as described. I'm disappointed.",
    "Packaging was excellent, thank you.",
    "It arrived defective. I need a replacement.",
    "Customer support responded quickly.",
    "Setup was confusing, a clearer guide would help.",
    "Works as expected. I recommend it.",
    "Why did it take so long to deliver?",
    "A part was missing. Can you help?",
    "No issues so far.",
    "Sound quality is amazing.",
    "Battery life is weak; I expected more.",
]


def _rand_phone(rng: random.Random) -> str:
    # Turkish-like number style without real PII relevance
    return f"+90 5{rng.randint(0,9)}{rng.randint(0,9)} {rng.randint(100,999)} {rng.randint(10,99)} {rng.randint(10,99)}"


def _email_for(name: str, idx: int, domain: str) -> str:
    local = f"{name.lower()}.{idx:05d}"
    return f"{local}@{domain}"


def write_dataset(path: Path, n: int, mode: str, seed: int) -> None:
    rng = random.Random(seed)

    start_date = datetime(2024, 1, 1)
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["user_name", "email", "user_id", "comment", "product_name", "created_at", "phone"])

        for i in range(1, n + 1):
            if mode == "tr":
                name = rng.choice(TR_NAMES)
                comment = rng.choice(TR_COMMENTS)
                domain = "example.com"
                product = rng.choice([p for p in PRODUCTS if p[0].isupper() and p.isascii() is False] + ["Telefon", "Laptop"])
            elif mode == "en":
                name = rng.choice(EN_NAMES)
                comment = rng.choice(EN_COMMENTS)
                domain = "example.org"
                product = rng.choice([p for p in PRODUCTS if p.isascii()] + ["Phone", "Laptop"])
            elif mode == "mixed":
                if rng.random() < 0.5:
                    name = rng.choice(TR_NAMES)
                    comment = rng.choice(TR_COMMENTS)
                    domain = "example.com"
                    product = rng.choice(["Telefon", "Laptop", "Kulaklik", "Monitor"])
                else:
                    name = rng.choice(EN_NAMES)
                    comment = rng.choice(EN_COMMENTS)
                    domain = "example.org"
                    product = rng.choice(["Phone", "Laptop", "Headphones", "Monitor"])
            else:
                raise ValueError(f"Unknown mode: {mode}")

            created_at = (start_date + timedelta(days=rng.randint(0, 365))).strftime("%Y-%m-%d")
            user_id = f"U{i:05d}"
            email = _email_for(name, i, domain)
            phone = _rand_phone(rng)
            w.writerow([name, email, user_id, comment, product, created_at, phone])


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    specs = [
        ("product_reviews_tr_20000.csv", 20000, "tr", 1337),
        ("product_reviews_en_20000.csv", 20000, "en", 4242),
        ("product_reviews_mixed_20000.csv", 20000, "mixed", 9001),
    ]

    for fname, n, mode, seed in specs:
        path = OUT_DIR / fname
        write_dataset(path, n=n, mode=mode, seed=seed)
        print(f"Wrote {n} rows -> {path}")


if __name__ == "__main__":
    main()

