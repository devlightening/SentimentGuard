# SentimentGuard

Secure, batch-oriented sentiment analysis MVP that demonstrates:

- Big Data Analytics: PySpark batch processing (local mode, scalable to cluster)
- NoSQL persistence: MongoDB (`analysis_jobs`, `analysis_results`)
- Privacy: deterministic pseudo-anonymization with HMAC-SHA256
- Integrity: tamper-evident hash chain (`prevHash`, `currentHash`)
- Web UI: upload + dashboards + PDF export

This repository is designed to run locally via Docker Compose.

## Quick Start (Docker Compose)

1. Create a local `.env` (optional):

```bash
copy .env.example .env
```

2. Build and start everything:

```bash
docker compose up -d --build
```

3. Open:

- Web: http://localhost:3000
- API (Swagger): http://localhost:5000/swagger
- Mongo UI (mongo-express): http://localhost:8081

## Demo User (Simple Multi-User Scoping)

This MVP supports a lightweight "demo user" concept so job lists/results can represent a single user's tests.

- The web UI sends a header: `X-Demo-User: <id>`
- Allowed characters: `a-z A-Z 0-9 _ -` (max 32 chars)
- If missing or invalid, it falls back to `demo`

Note: The PDF download endpoint also accepts `?user=<id>` because browsers cannot attach custom headers for normal links.

## How The System Works (High Level)

1. User uploads a CSV/JSON file in the web UI.
2. Backend saves the file to `/app/uploads`, creates an `analysis_jobs` record.
3. Backend triggers the Python worker (`POST /analyze`).
4. Worker runs a PySpark pipeline:
   - parses records
   - masks identity fields (HMAC-SHA256)
   - classifies sentiment (Positive/Negative/Neutral)
   - assigns MVP categories (Complaint/Praise/Question/Disappointment/Other)
   - writes results to `analysis_results` with `prevHash/currentHash`
5. Web UI reads job status + summary + charts, and can request:
   - hash-chain verification
   - a PDF report (backend-generated)

## Datasets

See: `sample-data/` and `docs/sample-datasets.md`.

We include 20k-row CSVs to demo batch processing and dashboards:

- `sample-data/product_reviews_tr_20000.csv`
- `sample-data/product_reviews_en_20000.csv`
- `sample-data/product_reviews_mixed_20000.csv`

## Troubleshooting

### "MongoDB over HTTP" on http://localhost:27017

MongoDB port `27017` is a database driver port, not an HTTP dashboard.

Use one of:
- mongo-express: http://localhost:8081
- MongoDB Compass: connect to `mongodb://localhost:27017`

### Web changes not visible

Rebuild/recreate the web container:

```bash
docker compose up -d --build --force-recreate web
```

If you still see old assets, hard refresh the browser (Ctrl+F5).

