export type Lang = "en" | "tr";

export type TranslationKey =
  | "app.name"
  | "app.tagline"
  | "app.nav_subtitle"
  | "nav.upload"
  | "nav.jobs"
  | "nav.lang"
  | "time.just_now"
  | "time.minutes_ago"
  | "time.hours_ago"
  | "error.api_unreachable"
  | "common.loading"
  | "common.records"
  | "common.no_data"
  | "upload.badge"
  | "upload.title.line1"
  | "upload.title.line2"
  | "upload.subtitle"
  | "upload.feature.bigdata.course"
  | "upload.feature.bigdata.title"
  | "upload.feature.bigdata.desc"
  | "upload.feature.privacy.course"
  | "upload.feature.privacy.title"
  | "upload.feature.privacy.desc"
  | "upload.feature.integrity.course"
  | "upload.feature.integrity.title"
  | "upload.feature.integrity.desc"
  | "upload.drop.loading"
  | "upload.drop.loading_hint"
  | "upload.drop.release"
  | "upload.drop.prompt"
  | "upload.drop.hint"
  | "upload.drop.required"
  | "upload.drop.optional"
  | "upload.how.title"
  | "upload.how.step1.title"
  | "upload.how.step1.desc"
  | "upload.how.step2.title"
  | "upload.how.step2.desc"
  | "upload.how.step3.title"
  | "upload.how.step3.desc"
  | "upload.how.step4.title"
  | "upload.how.step4.desc"
  | "upload.quality.title"
  | "upload.quality.item1"
  | "upload.quality.item2"
  | "upload.quality.item3"
  | "upload.quality.item4"
  | "upload.quality.item5"
  | "upload.privacy.title"
  | "upload.privacy.p1"
  | "upload.privacy.p2"
  | "upload.results.title"
  | "upload.results.item1"
  | "upload.results.item2"
  | "upload.results.item3"
  | "upload.results.item4"
  | "upload.error.default"
  | "upload.cta.view_jobs"
  | "jobs.title"
  | "jobs.subtitle.none"
  | "jobs.subtitle.count"
  | "jobs.cta.new"
  | "jobs.empty.title"
  | "jobs.empty.subtitle"
  | "jobs.empty.link"
  | "status.pending"
  | "status.running"
  | "status.completed"
  | "status.failed"
  | "job_detail.breadcrumb"
  | "job_detail.not_found"
  | "job_detail.pdf"
  | "job_detail.created"
  | "job_detail.completed"
  | "job_detail.duration"
  | "job_detail.inprogress.running.title"
  | "job_detail.inprogress.running.subtitle"
  | "job_detail.inprogress.pending"
  | "job_detail.inprogress.failed"
  | "job_detail.pipeline.title"
  | "job_detail.stats.total"
  | "job_detail.stats.positive"
  | "job_detail.stats.negative"
  | "job_detail.stats.neutral"
  | "job_detail.chart.sentiment"
  | "job_detail.chart.category"
  | "job_detail.top_comments"
  | "security.hmac.title"
  | "security.badge"
  | "security.hmac.desc"
  | "security.hmac.example"
  | "security.hmac.original"
  | "security.hmac.masked"
  | "security.hmac.algorithm"
  | "security.chain.title"
  | "security.chain.desc"
  | "security.chain.final_hash"
  | "security.chain.prev_hash_fallback"
  | "security.chain.verify"
  | "security.chain.verifying"
  | "security.chain.valid"
  | "security.chain.invalid"
  | "sentiment.positive"
  | "sentiment.negative"
  | "sentiment.neutral"
  | "category.complaint"
  | "category.question"
  | "category.praise"
  | "category.disappointment"
  | "category.other";

type Dict = Record<TranslationKey, string>;

export const translations: Record<Lang, Dict> = {
  en: {
    "app.name": "SentimentGuard",
    "app.tagline": "Big Data Analytics x Information Security - Academic MVP",
    "app.nav_subtitle": "Privacy-first sentiment analytics",
    "nav.upload": "Upload",
    "nav.jobs": "Analysis Jobs",
    "nav.lang": "Language",

    "time.just_now": "just now",
    "time.minutes_ago": "{n}m ago",
    "time.hours_ago": "{n}h ago",

    "error.api_unreachable": "Could not connect to the API. Is the backend running?",

    "common.loading": "Loading...",
    "common.records": "records",
    "common.no_data": "No data.",

    "upload.badge": "Big Data Analytics x Information Security",
    "upload.title.line1": "Understand Customer Feedback",
    "upload.title.line2": "Without Exposing Identities",
    "upload.subtitle":
      "Upload a CSV/JSON of customer comments. We process it in batch with PySpark, store results in MongoDB, and provide integrity checks and a clean report for sharing.",

    "upload.feature.bigdata.course": "Big Data Analytics",
    "upload.feature.bigdata.title": "Apache PySpark",
    "upload.feature.bigdata.desc":
      "Batch processing with PySpark so you can analyze hundreds or thousands of comments in one run.",

    "upload.feature.privacy.course": "Information Security",
    "upload.feature.privacy.title": "HMAC-SHA256 Masking",
    "upload.feature.privacy.desc":
      "Identity fields are masked with deterministic keyed hashing, so results remain linkable without revealing raw PII.",

    "upload.feature.integrity.course": "Information Security",
    "upload.feature.integrity.title": "Hash-Chain Integrity",
    "upload.feature.integrity.desc":
      "A SHA-256 hash chain makes database tampering detectable. You can verify integrity anytime.",

    "upload.drop.loading": "Uploading and starting the analysis...",
    "upload.drop.loading_hint": "You can keep this tab open. We'll update the job page automatically.",
    "upload.drop.release": "Drop the file to start",
    "upload.drop.prompt": "Drag and drop your dataset here",
    "upload.drop.hint": "or click to choose a file (.csv, .json).",
    "upload.drop.required": "Required: user_name, email, comment",
    "upload.drop.optional": "Optional: product_name, created_at, phone",

    "upload.how.title": "How It Works",
    "upload.how.step1.title": "Upload dataset",
    "upload.how.step1.desc": "Drag-and-drop a CSV or JSON with one comment per row.",
    "upload.how.step2.title": "Privacy masking",
    "upload.how.step2.desc": "Identity fields are deterministically masked before results are stored (privacy by design).",
    "upload.how.step3.title": "Batch sentiment analysis",
    "upload.how.step3.desc": "PySpark processes the file in batch and classifies each comment as Positive / Negative / Neutral.",
    "upload.how.step4.title": "Integrity proof + reporting",
    "upload.how.step4.desc": "Each record is linked with a SHA-256 hash chain. You can verify integrity and export a PDF report.",

    "upload.quality.title": "Data Quality Tips (For More Reliable Results)",
    "upload.quality.item1": "Prefer a single language per dataset (all TR or all EN). Mixed language can reduce accuracy in MVP classifiers.",
    "upload.quality.item2": "Keep each row as one user comment. Avoid multiline comments or embedded JSON inside a CSV cell.",
    "upload.quality.item3": "Make sure the comment column is meaningful (not empty, not just emojis).",
    "upload.quality.item4": "Remove duplicates if you want unique insights. Keep duplicates if you want “top repeated comments” to reflect repetition.",
    "upload.quality.item5": "If your file uses Turkish characters, save CSV as UTF-8 to avoid broken text.",

    "upload.privacy.title": "What Gets Stored (And What Does Not)",
    "upload.privacy.p1": "We store masked identities and analysis results. Raw identity values are not written to MongoDB.",
    "upload.privacy.p2": "A hash chain is stored with each record to detect any later tampering in the database.",

    "upload.results.title": "What You’ll See After Processing",
    "upload.results.item1": "Job status (Pending / Running / Completed / Failed) and record counts",
    "upload.results.item2": "Sentiment distribution charts (Positive / Negative / Neutral)",
    "upload.results.item3": "Top repeated comments list (helpful for recurring issues)",
    "upload.results.item4": "Integrity verification result + downloadable PDF report",
    "upload.error.default": "Upload failed. Is the API running?",
    "upload.cta.view_jobs": "View previous analyses",

    "jobs.title": "Analysis Jobs",
    "jobs.subtitle.none": "No jobs yet",
    "jobs.subtitle.count": "{n} job{plural} in database",
    "jobs.cta.new": "New Analysis",
    "jobs.empty.title": "No analyses yet",
    "jobs.empty.subtitle": "to get started",
    "jobs.empty.link": "Upload a dataset",

    "status.pending": "Pending",
    "status.running": "Running",
    "status.completed": "Completed",
    "status.failed": "Failed",

    "job_detail.breadcrumb": "Analysis Jobs",
    "job_detail.not_found": "Job not found.",
    "job_detail.pdf": "PDF Report",
    "job_detail.created": "Created",
    "job_detail.completed": "Completed",
    "job_detail.duration": "Duration",
    "job_detail.inprogress.running.title": "Spark job in progress...",
    "job_detail.inprogress.running.subtitle": "Page auto-refreshes every 3 seconds",
    "job_detail.inprogress.pending": "Waiting for the worker to pick up this job...",
    "job_detail.inprogress.failed": "Job failed. See error above.",

    "job_detail.pipeline.title": "Processing Pipeline",
    "job_detail.stats.total": "Total Records",
    "job_detail.stats.positive": "Positive",
    "job_detail.stats.negative": "Negative",
    "job_detail.stats.neutral": "Neutral",
    "job_detail.chart.sentiment": "Sentiment Distribution",
    "job_detail.chart.category": "Category Breakdown",
    "job_detail.top_comments": "Top Repeated Comments",

    "security.badge": "Information Security",
    "security.hmac.title": "HMAC-SHA256 Pseudo-Anonymization",
    "security.hmac.desc":
      "PII fields (email, user_name, phone) are replaced with deterministic keyed hashes using HMAC-SHA256(secret, value) before MongoDB storage. Original data never persists.",
    "security.hmac.example": "Live example - record #{id}",
    "security.hmac.original": "Original PII (never stored)",
    "security.hmac.masked": "After HMAC-SHA256",
    "security.hmac.algorithm":
      "Algorithm: HMAC-SHA256(key, value.lower()) -> Base64URL -> deterministic & one-way",

    "security.chain.title": "Hash-Chain Integrity",
    "security.chain.desc":
      "Each result is linked to the previous via currentHash = SHA-256(prevHash + recordData). Tampering any record breaks the chain at that index.",
    "security.chain.final_hash": "Final hash:",
    "security.chain.prev_hash_fallback": "0000...0000 (genesis block)",
    "security.chain.verify": "Verify Integrity",
    "security.chain.verifying": "Verifying...",
    "security.chain.valid": "VALID - No tampering detected",
    "security.chain.invalid": "INVALID - {message}",

    "sentiment.positive": "Positive",
    "sentiment.negative": "Negative",
    "sentiment.neutral": "Neutral",

    "category.complaint": "Complaint",
    "category.question": "Question",
    "category.praise": "Praise",
    "category.disappointment": "Disappointment",
    "category.other": "Other",
  },
  tr: {
    "app.name": "SentimentGuard",
    "app.tagline": "Büyük Veri Analitiği x Bilgi Güvenliği - Akademik MVP",
    "app.nav_subtitle": "Gizlilik odaklı duygu analitiği",
    "nav.upload": "Yükle",
    "nav.jobs": "Analiz İşleri",
    "nav.lang": "Dil",

    "time.just_now": "az önce",
    "time.minutes_ago": "{n} dk önce",
    "time.hours_ago": "{n} saat önce",

    "error.api_unreachable": "API'ye bağlanılamadı. Backend çalışıyor mu?",

    "common.loading": "Yükleniyor...",
    "common.records": "kayıt",
    "common.no_data": "Veri yok.",

    "upload.badge": "Büyük Veri Analitiği x Bilgi Güvenliği",
    "upload.title.line1": "Müşteri Geri Bildirimini Anla",
    "upload.title.line2": "Kimliği Açığa Çıkarmadan",
    "upload.subtitle":
      "Müşteri yorumlarını içeren CSV/JSON dosyanı yükle. PySpark ile batch analiz yapar, sonuçları MongoDB’ye kaydeder, bütünlük doğrulaması ve paylaşılabilir bir rapor sunar.",

    "upload.feature.bigdata.course": "Büyük Veri Analitiği",
    "upload.feature.bigdata.title": "Apache PySpark",
    "upload.feature.bigdata.desc":
      "PySpark ile batch işleme: yüzlerce, binlerce yorumu tek çalıştırmada analiz edebilirsin.",

    "upload.feature.privacy.course": "Bilgi Güvenliği",
    "upload.feature.privacy.title": "HMAC-SHA256 Maskeleme",
    "upload.feature.privacy.desc":
      "Kimlik alanları deterministik anahtarlı hash ile maskelenir. Ham PII açığa çıkmadan ilişkilendirme yapılabilir.",

    "upload.feature.integrity.course": "Bilgi Güvenliği",
    "upload.feature.integrity.title": "Hash-Zinciri Bütünlüğü",
    "upload.feature.integrity.desc":
      "SHA-256 hash zinciri, veritabanında sonradan oynama olursa tespit etmeyi sağlar.",

    "upload.drop.loading": "Yükleniyor ve analiz başlatılıyor...",
    "upload.drop.loading_hint": "Bu sekmeyi açık tutabilirsin. İş sayfası otomatik güncellenir.",
    "upload.drop.release": "Başlatmak için bırak",
    "upload.drop.prompt": "Veri setini buraya sürükleyip bırak",
    "upload.drop.hint": "veya tıklayıp dosya seç (.csv, .json).",
    "upload.drop.required": "Gerekli: user_name, email, comment",
    "upload.drop.optional": "Opsiyonel: product_name, created_at, phone",

    "upload.how.title": "Nasıl Çalışır?",
    "upload.how.step1.title": "Veri setini yükle",
    "upload.how.step1.desc": "CSV veya JSON dosyanı sürükleyip bırak. Her satır bir yorum olmalı.",
    "upload.how.step2.title": "Gizlilik maskelemesi",
    "upload.how.step2.desc": "Kimlik alanları sonuçlar kaydedilmeden önce HMAC-SHA256 ile deterministik olarak maskelenir.",
    "upload.how.step3.title": "Batch duygu analizi",
    "upload.how.step3.desc": "PySpark dosyayı batch işler ve her yorumu Pozitif / Negatif / Nötr olarak sınıflandırır.",
    "upload.how.step4.title": "Bütünlük kanıtı + rapor",
    "upload.how.step4.desc": "Her kayıt SHA-256 hash zinciri ile bağlanır. Bütünlüğü doğrulayabilir ve PDF rapor alabilirsin.",

    "upload.quality.title": "Veri Kalitesi İpuçları (Daha Sağlıklı Sonuçlar İçin)",
    "upload.quality.item1": "Mümkünse tek dil kullan (tamamı TR veya tamamı EN). Karışık dil, MVP sınıflandırıcısında doğruluğu düşürür.",
    "upload.quality.item2": "Her satır tek bir kullanıcı yorumu olsun. Çok satırlı yorumlar veya CSV hücresine gömülü JSON kaçın.",
    "upload.quality.item3": "Yorum sütunu anlamlı olsun (boş olmasın, sadece emoji olmasın).",
    "upload.quality.item4": "Tekil içgörü için tekrarları temizle. “En çok tekrarlanan yorumlar”ı görmek için tekrarları bırak.",
    "upload.quality.item5": "Türkçe karakterler için CSV dosyanı UTF-8 olarak kaydet (bozuk metin oluşmasın).",

    "upload.privacy.title": "Neler Kaydedilir? (Neler Kaydedilmez?)",
    "upload.privacy.p1": "Sistemde maskelenmiş kimlik ve analiz sonuçları saklanır. Ham kimlik değerleri MongoDB’ye yazılmaz.",
    "upload.privacy.p2": "Veritabanında sonradan oynama olup olmadığını yakalamak için her kayıtta hash zinciri tutulur.",

    "upload.results.title": "İşlem Sonunda Neler Göreceksin?",
    "upload.results.item1": "İş durumu (Beklemede / Çalışıyor / Tamamlandı / Başarısız) ve kayıt sayıları",
    "upload.results.item2": "Duygu dağılımı grafikleri (Pozitif / Negatif / Nötr)",
    "upload.results.item3": "En çok tekrarlanan yorumlar (tekrarlayan sorunları yakalamak için)",
    "upload.results.item4": "Bütünlük doğrulama sonucu + indirilebilir PDF rapor",
    "upload.error.default": "Yükleme başarısız. API çalışıyor mu?",
    "upload.cta.view_jobs": "Önceki analizleri gör",

    "jobs.title": "Analiz İşleri",
    "jobs.subtitle.none": "Henüz iş yok",
    "jobs.subtitle.count": "Veritabanında {n} iş var",
    "jobs.cta.new": "Yeni Analiz",
    "jobs.empty.title": "Henüz analiz yok",
    "jobs.empty.subtitle": "başlamak için",
    "jobs.empty.link": "Veri seti yükleyin",

    "status.pending": "Beklemede",
    "status.running": "Çalışıyor",
    "status.completed": "Tamamlandı",
    "status.failed": "Başarısız",

    "job_detail.breadcrumb": "Analiz İşleri",
    "job_detail.not_found": "İş bulunamadı.",
    "job_detail.pdf": "PDF Raporu",
    "job_detail.created": "Oluşturuldu",
    "job_detail.completed": "Tamamlandı",
    "job_detail.duration": "Süre",
    "job_detail.inprogress.running.title": "Spark işi sürüyor...",
    "job_detail.inprogress.running.subtitle": "Sayfa her 3 saniyede bir yenilenir",
    "job_detail.inprogress.pending": "Worker bu işi almaya hazırlanıyor...",
    "job_detail.inprogress.failed": "İş başarısız. Yukarıdaki hatayı inceleyin.",

    "job_detail.pipeline.title": "İşleme Hattı",
    "job_detail.stats.total": "Toplam Kayıt",
    "job_detail.stats.positive": "Pozitif",
    "job_detail.stats.negative": "Negatif",
    "job_detail.stats.neutral": "Nötr",
    "job_detail.chart.sentiment": "Duygu Dağılımı",
    "job_detail.chart.category": "Kategori Dağılımı",
    "job_detail.top_comments": "En Çok Tekrarlanan Yorumlar",

    "security.badge": "Bilgi Güvenliği",
    "security.hmac.title": "HMAC-SHA256 Sözde-Anonimleştirme",
    "security.hmac.desc":
      "PII alanları (email, user_name, phone) MongoDB'ye yazılmadan önce HMAC-SHA256(secret, value) ile deterministik anahtarlı hash'lere dönüştürülür. Orijinal veri kalıcı olmaz.",
    "security.hmac.example": "Canlı örnek - kayıt #{id}",
    "security.hmac.original": "Orijinal PII (saklanmaz)",
    "security.hmac.masked": "HMAC-SHA256 sonrası",
    "security.hmac.algorithm":
      "Algoritma: HMAC-SHA256(key, value.lower()) -> Base64URL -> deterministik ve tek yönlü",

    "security.chain.title": "Hash-Zinciri Bütünlüğü",
    "security.chain.desc":
      "Her sonuç bir önceki kayda currentHash = SHA-256(prevHash + recordData) ile bağlanır. Herhangi bir kaydı değiştirmek zinciri o index'te kırar.",
    "security.chain.final_hash": "Son hash:",
    "security.chain.prev_hash_fallback": "0000...0000 (genesis blok)",
    "security.chain.verify": "Bütünlüğü Doğrula",
    "security.chain.verifying": "Doğrulanıyor...",
    "security.chain.valid": "GEÇERLİ - Değişiklik tespit edilmedi",
    "security.chain.invalid": "GEÇERSİZ - {message}",

    "sentiment.positive": "Pozitif",
    "sentiment.negative": "Negatif",
    "sentiment.neutral": "Nötr",

    "category.complaint": "Şikayet",
    "category.question": "Soru",
    "category.praise": "Övgü",
    "category.disappointment": "Hayal Kırıklığı",
    "category.other": "Diğer",
  },
} as const;
