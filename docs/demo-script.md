# SentimentGuard - Demo Script (10-15 minutes)

## Setup (Before You Start)

1. Run:

```bash
docker compose up -d --build
```

2. Open:

- Web: http://localhost:3000
- API Swagger: http://localhost:5000/swagger
- Mongo UI (optional): http://localhost:8081

3. Prepare a dataset from `sample-data/`:

- `product_reviews_tr_20000.csv` (20,000 rows)
- `product_reviews_en_20000.csv` (20,000 rows)
- `product_reviews_mixed_20000.csv` (20,000 rows)

## Part 1 - What It Is (1 minute)

Explain:

- Big Data Analytics: PySpark batch processing
- Information Security: pseudo-anonymization + hash-chain integrity

## Part 2 - Upload And Job Creation (2 minutes)

1. Open the web UI.
2. Upload one of the CSV files.
3. Show that a new "analysis job" appears with status changes (Pending -> Running -> Completed).

Explain:

- The backend stores the upload and creates `analysis_jobs` in MongoDB.
- The backend triggers the worker to run the batch pipeline.

## Part 3 - Privacy (2 minutes)

Open the job results and show:

- `maskedUser` values are deterministic HMAC outputs.
- No plaintext identity values are stored.

Explain:

- HMAC-SHA256 is a keyed hash, which is safer than plain SHA-256 for pseudo-anonymization.
- Deterministic mapping allows grouping without exposing identity.

## Part 4 - Dashboard (3 minutes)

Show:

- sentiment distribution chart (Positive/Negative/Neutral)
- category breakdown chart (Complaint/Praise/Question/Disappointment/Other)
- top repeated comments section

Explain:

- This is a batch-style analytics workflow: a whole dataset is processed as one job.
- Even in local mode, PySpark demonstrates the distributed programming model.

## Part 5 - Integrity (Hash Chain) (3 minutes)

1. Click "Verify Chain" in the UI.
2. Show the "valid" result and the final hash.

Explain:

- each record stores `prevHash` and `currentHash`
- `currentHash` depends on the previous record, so any tampering is detectable

Optional tamper demo:

1. Open mongo-express (or MongoDB Compass).
2. Edit a single field (example: `originalComment`) in `analysis_results`.
3. Run verification again and show that it reports the broken index.

## Part 6 - PDF Export (1 minute)

1. Click "Download PDF".
2. Open the PDF and show:
   - job metadata
   - sentiment and category distributions
   - top repeated comments
   - chain verification status and final hash

## Common Questions (Fast Answers)

- "Is the NLP perfect?"
  - No. MVP uses polarity + keyword rules. Architecture allows swapping in a better model.

- "Is this real big data?"
  - Academic scope: the goal is to demonstrate batch processing and the big-data programming model.
    20,000 rows is sufficient for a clean demo on a laptop.

