from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    ListFlowable,
    ListItem,
    PageBreak,
    Preformatted,
)


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "docs" / "notebooklm"


def _try_register_windows_font() -> tuple[str, str]:
    """
    Use a font that supports Turkish characters. Prefer Arial on Windows.
    Falls back to built-in Helvetica if font files are unavailable.
    """
    candidates = [
        ("Arial", r"C:\Windows\Fonts\arial.ttf", r"C:\Windows\Fonts\arialbd.ttf"),
        ("SegoeUI", r"C:\Windows\Fonts\segoeui.ttf", r"C:\Windows\Fonts\segoeuib.ttf"),
        ("Calibri", r"C:\Windows\Fonts\calibri.ttf", r"C:\Windows\Fonts\calibrib.ttf"),
    ]
    for family, regular, bold in candidates:
        if os.path.exists(regular) and os.path.exists(bold):
            pdfmetrics.registerFont(TTFont(f"{family}", regular))
            pdfmetrics.registerFont(TTFont(f"{family}-Bold", bold))
            return f"{family}", f"{family}-Bold"
    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = _try_register_windows_font()


def _styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()

    return {
        "title": ParagraphStyle(
            "sg-title",
            parent=base["Title"],
            fontName=FONT_BOLD,
            fontSize=24,
            leading=28,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=10,
        ),
        "subtitle": ParagraphStyle(
            "sg-subtitle",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#475569"),
            spaceAfter=14,
        ),
        "h1": ParagraphStyle(
            "sg-h1",
            parent=base["Heading1"],
            fontName=FONT_BOLD,
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=10,
            spaceAfter=6,
        ),
        "h2": ParagraphStyle(
            "sg-h2",
            parent=base["Heading2"],
            fontName=FONT_BOLD,
            fontSize=12.5,
            leading=16,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=8,
            spaceAfter=4,
        ),
        "p": ParagraphStyle(
            "sg-p",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=10.5,
            leading=15,
            textColor=colors.HexColor("#111827"),
        ),
        "muted": ParagraphStyle(
            "sg-muted",
            parent=base["Normal"],
            fontName=FONT,
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#64748b"),
        ),
        "code": ParagraphStyle(
            "sg-code",
            parent=base["Code"],
            fontName="Courier",
            fontSize=9.2,
            leading=12,
            textColor=colors.HexColor("#0b1220"),
            backColor=colors.HexColor("#f1f5f9"),
            borderPadding=6,
        ),
    }


def _bullets(items: list[str], style: ParagraphStyle) -> ListFlowable:
    flow_items = []
    for x in items:
        flow_items.append(ListItem(Paragraph(x, style), leftIndent=14, bulletColor=colors.HexColor("#0ea5e9")))
    return ListFlowable(flow_items, bulletType="bullet", leftIndent=10, bulletFontName=FONT, bulletFontSize=8)


def _kv_table(rows: list[tuple[str, str]], styles: dict[str, ParagraphStyle]) -> Table:
    data = [[Paragraph(f"<b>{k}</b>", styles["p"]), Paragraph(v, styles["p"])] for k, v in rows]
    t = Table(data, colWidths=[5.0 * cm, 11.5 * cm])
    t.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LINEBELOW", (0, 0), (-1, -1), 0.25, colors.HexColor("#e2e8f0")),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return t


@dataclass(frozen=True)
class PdfSpec:
    filename: str
    title: str
    subtitle: str
    sections: list[tuple[str, list[object]]]


def _build_pdf(spec: PdfSpec) -> Path:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / spec.filename

    styles = _styles()
    story: list[object] = []
    story.append(Paragraph(spec.title, styles["title"]))
    story.append(Paragraph(spec.subtitle, styles["subtitle"]))

    # Quick metadata table
    story.append(
        _kv_table(
            [
                ("Proje", "SentimentGuard (Secure Big-Data Sentiment Analysis Platform)"),
                ("Stack", "React + Vite + TypeScript; ASP.NET Core 8; Python + PySpark; MongoDB; Docker Compose"),
                ("Odak", "Akademik MVP: Buyuk Veri Analitigi + Bilgi Guvenligi gereksinimleri"),
            ],
            styles,
        )
    )
    story.append(Spacer(1, 12))

    for (heading, blocks) in spec.sections:
        story.append(Paragraph(heading, styles["h1"]))
        for b in blocks:
            story.append(b)
            story.append(Spacer(1, 8))
        story.append(Spacer(1, 4))

    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=A4,
        rightMargin=2.0 * cm,
        leftMargin=2.0 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
        title=spec.title,
        author="SentimentGuard",
    )
    doc.build(story)
    return out_path


def _big_data_spec() -> PdfSpec:
    s = _styles()

    flow = Preformatted(
        """WEB UI (React)
   |
   | 1) CSV/JSON Upload
   v
BACKEND (.NET 8)
 - Dosyayi kaydeder (/uploads)
 - MongoDB'de job kaydi olusturur
 - Worker'i tetikler (job_id + file_path)
   |
   v
WORKER (Python + PySpark)
 - Batch isleme (Spark)
 - Siniflandirma + aggregation
 - MongoDB'ye results yazar
   |
   v
MONGODB
 - analysis_jobs
 - analysis_results
""",
        s["code"],
    )

    sections: list[tuple[str, list[object]]] = [
        (
            "1) Neden Bu Proje? (Buyuk Veri Bakisi)",
            [
                Paragraph(
                    "Gercek hayatta yorumlar/geri bildirimler binlerce satira ulasabilir. "
                    "Amaç: bu veriyi tek seferde (batch) isleyip ozet cikarmak ve raporlamak.",
                    s["p"],
                ),
                _bullets(
                    [
                        "<b>Batch</b> calisma: kullanici dosyayi yukler, tek bir is (job) olusur, tamamlandiginda ozet gorulur.",
                        "<b>Paralel dusunme</b>: her satir (yorum) bagimsiz islenebilir; map-benzeri adimlarla olceklenebilir.",
                        "<b>NoSQL</b> model: analiz sonuclari dokuman bazli saklanir; esnek sema sayesinde hizli iterasyon.",
                    ],
                    s["p"],
                ),
            ],
        ),
        (
            "2) Mimari ve Bilesenler",
            [
                Paragraph("Proje 4 servis ile docker-compose uzerinden calisir:", s["p"]),
                _bullets(
                    [
                        "<b>Web</b>: Upload + Job list + Job detail dashboard (grafikler, top comments, PDF indirme).",
                        "<b>Backend</b>: Upload API, job API, Mongo okumalar, integrity verification endpoint, PDF report endpoint.",
                        "<b>Worker</b>: PySpark batch pipeline (anonymize + classify + write).",
                        "<b>MongoDB</b>: analysis_jobs + analysis_results koleksiyonlari.",
                    ],
                    s["p"],
                ),
                Spacer(1, 4),
                Paragraph("Yuksek seviye veri akisi:", s["h2"]),
                flow,
            ],
        ),
        (
            "3) PySpark Batch Pipeline (Akademik Anlatim)",
            [
                Paragraph(
                    "Worker, dosyayi okur ve her satiri bagimsiz bir is olarak degerlendirir. "
                    "Bu, MapReduce dusuncesini gostermek icin uygundur:",
                    s["p"],
                ),
                _bullets(
                    [
                        "<b>Map</b>: her satir icin maskelenmis kullanici + sentiment (+ kategori) hesaplanir.",
                        "<b>Reduce/Aggregation</b>: sayimlar (positive/negative/neutral ve kategori sayimlari) dashboard ve rapor icin ozetlenir.",
                        "<b>Persist</b>: sonuc dokumanlari MongoDB'ye yazilir.",
                    ],
                    s["p"],
                ),
                Paragraph(
                    "MVP kapsaminda siniflandirma kural tabanli / TextBlob tabanlidir. "
                    "Bu, mimariyi bozmadan ileride daha guclu NLP modellerine gecis icin uygun bir noktadir.",
                    s["muted"],
                ),
            ],
        ),
        (
            "4) MongoDB Modeli (NoSQL Persistence)",
            [
                Paragraph(
                    "MongoDB iki ana koleksiyonla calisir:",
                    s["p"],
                ),
                _bullets(
                    [
                        "<b>analysis_jobs</b>: dosya adi, durum (Pending/Running/Completed/Failed), zaman damgalari, kayit sayilari, hata mesaji.",
                        "<b>analysis_results</b>: jobId, maskedUser, originalComment, sentiment, category, score, prevHash, currentHash, createdAt.",
                    ],
                    s["p"],
                ),
                Paragraph(
                    "Bu model, batch analiz ve raporlama icin pratik ve bakimi kolay bir MVP yapisi sunar.",
                    s["muted"],
                ),
            ],
        ),
        (
            "5) Demo Akisi (Buyuk Veri Dersi Icin)",
            [
                _bullets(
                    [
                        "Web UI'da dataset upload edilir (or: 20.000 satirlik CSV).",
                        "Job detail ekraninda is tamamlaninca sentiment ve kategori dagilimi gorulur.",
                        "Top repeated comments bolumu ile tekrar eden sorunlar tespit edilir.",
                        "PDF rapor indirilir ve ozet sunulur.",
                    ],
                    s["p"],
                ),
                Paragraph(
                    "Not: Ders baglaminda 'buyuk veri' her zaman GB'lar degildir; "
                    "burada asıl hedef batch isleme, paralel dusunme ve NoSQL ile persistence anlatimini gostermektir.",
                    s["muted"],
                ),
            ],
        ),
        (
            "6) Sinirlar ve Gelistirme Alanlari",
            [
                _bullets(
                    [
                        "MVP siniflandirma: Dil karisikligi (TR+EN) dogrulugu dusurebilir; tek dil dataset daha iyi sonuc verir.",
                        "Ileri seviye: Spark DataFrame uzerinden dogrudan dosya okuma, daha buyuk datasetlerde daha verimli olabilir.",
                        "Ileri seviye: Model tabanli duygu analizi (transformer) ile dogruluk artirilabilir.",
                    ],
                    s["p"],
                )
            ],
        ),
    ]

    return PdfSpec(
        filename="SentimentGuard_BuyukVeri_Analitigi_Brief_TR.pdf",
        title="SentimentGuard - Buyuk Veri Analitigi Dersi Brifingi",
        subtitle="NotebookLM icin: Projeyi (Big Data Analytics) bakisiyla anlatan ozet + demo akisi + teknik detaylar.",
        sections=sections,
    )


def _info_sec_spec() -> PdfSpec:
    s = _styles()

    sections: list[tuple[str, list[object]]] = [
        (
            "1) Problem Tanimi (Bilgi Guvenligi Bakisi)",
            [
                Paragraph(
                    "Yorum/veri setlerinde kimlik bilgileri (email, ad, telefon, user_id) bulunabilir. "
                    "Analiz yaparken bu alanlari aciga cikarmadan calismak gerekir.",
                    s["p"],
                ),
                _bullets(
                    [
                        "<b>Gizlilik</b>: Kimlik alanlarini maskelerken ayni kisiyi tekrar tekrar baglayabilmek (deterministik) gerekir.",
                        "<b>Butunluk</b>: Sonuclarin MongoDB'de sonradan degistirilmedigini gostermek gerekir.",
                        "<b>Akademik MVP</b>: Agir kimlik yonetimi (auth, RBAC) yerine odak HMAC + hash chain uzerindedir.",
                    ],
                    s["p"],
                ),
            ],
        ),
        (
            "2) Pseudo-Anonymization (Deterministik Anahtarlı Hash)",
            [
                Paragraph(
                    "SentimentGuard, kimlik alanlarini <b>HMAC-SHA256</b> ile deterministik olarak maskeler. "
                    "Bu sayede ayni input her zaman ayni masked output'u uretir, fakat secret anahtar olmadan geri donus zor / pratikte imkansizdir.",
                    s["p"],
                ),
                Preformatted(
                    """mask = Base64Url( HMAC_SHA256(secret, value.lower().strip()) )

Ornek:
email: user@example.com
maskedUser: X6b... (deterministik, tek yonlu)""",
                    s["code"],
                ),
                Paragraph(
                    "Neden duz SHA-256 degil? Duz hash, rainbow table / brute-force ile daha kolay hedeflenir. "
                    "HMAC, secret olmadan saldirgani engeller.",
                    s["muted"],
                ),
            ],
        ),
        (
            "3) Hash Chain Ile Butunluk Kaniti",
            [
                Paragraph(
                    "Her analiz sonucu kaydina iki alan yazilir: <b>prevHash</b> ve <b>currentHash</b>. "
                    "currentHash, onceki kaydin hash'i ve kaydin kanonik icerigi ile hesaplanir.",
                    s["p"],
                ),
                Preformatted(
                    """GENESIS_HASH = "GENESIS"
canonical = "jobId=...|maskedUser=...|comment=...|sentiment=...|category=...|score=..."
currentHash = SHA256( canonical + "|" + prevHash )

Bir kayit degisirse (comment/sentiment/score) o kayittan itibaren zincir kirilir.""",
                    s["code"],
                ),
                _bullets(
                    [
                        "Backend'te `GET /api/jobs/{id}/verify-chain` endpoint'i zinciri bastan hesaplar.",
                        "Ilk uyumsuz kayitta `brokenAtIndex` doner ve tampering kaniti olur.",
                    ],
                    s["p"],
                ),
            ],
        ),
        (
            "4) Tehdit Modeli ve Varsayimlar",
            [
                _bullets(
                    [
                        "<b>Tehdit</b>: MongoDB'deki bir kaydin elle degistirilmesi (sonuclarla oynama).",
                        "<b>Koruma</b>: Hash chain bunu tespit eder, ama blockchain/consensus degildir (merkezi mimari).",
                        "<b>Gizli anahtar</b>: HMAC secret `.env` ile gelir; uretimde secret manager kullanilmalidir.",
                    ],
                    s["p"],
                ),
            ],
        ),
        (
            "5) Demo Akisi (Bilgi Guvenligi Dersi Icin)",
            [
                _bullets(
                    [
                        "Dataset yukle ve analiz tamamlaninca job detail ekranina git.",
                        "Verify Integrity butonuna bas: 'VALID' sonucunu goster.",
                        "MongoDB'de bir `analysis_results` dokumaninda `originalComment` ya da `sentiment` alanini degistir (tampering).",
                        "Tekrar Verify Integrity calistir: 'BROKEN' / 'INVALID' sonucunu goster.",
                        "PDF raporda Security & Integrity notlarini goster (masking + hash chain).",
                    ],
                    s["p"],
                ),
            ],
        ),
        (
            "6) Hocanin Bekleyebilecegi Soru-Cevap Hazirligi",
            [
                _bullets(
                    [
                        "<b>S:</b> Neden HMAC? <b>C:</b> Secret olmadan brute-force zor; deterministik oldugu icin gruplama/analiz bozulmaz.",
                        "<b>S:</b> Hash chain neyi kanitlar? <b>C:</b> DB'de tek bir kayit degisse bile zincir kirilir ve tespit edilir.",
                        "<b>S:</b> Blockchain mi? <b>C:</b> Hayir, merkezi mimaride tampering detection icin hafif bir butunluk mekanizmasi.",
                    ],
                    s["p"],
                ),
            ],
        ),
    ]

    return PdfSpec(
        filename="SentimentGuard_BilgiGuvenligi_Brief_TR.pdf",
        title="SentimentGuard - Bilgi Guvenligi Dersi Brifingi",
        subtitle="NotebookLM icin: Projeyi (Information Security) bakisiyla anlatan ozet + algoritmalar + tampering demo akisi.",
        sections=sections,
    )


def main() -> None:
    pdfs = [
        _build_pdf(_big_data_spec()),
        _build_pdf(_info_sec_spec()),
    ]

    for p in pdfs:
        print(str(p))


if __name__ == "__main__":
    main()

