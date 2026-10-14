# SentimentGuard

<p>
  <img alt=".NET 8" src="https://img.shields.io/badge/ASP.NET%20Core-8-512BD4?logo=dotnet&logoColor=white">
  <img alt="PySpark" src="https://img.shields.io/badge/PySpark-3.5-E25A1C?logo=apachespark&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white">
</p>

**Secure batch sentiment analysis for customer reviews.** Upload a CSV of reviews, and SentimentGuard analyzes it with a PySpark pipeline, pseudo-anonymizes the people in it, and stores the results in a **SHA-256 hash chain** so any later tampering can be detected.

## Why it exists

Review datasets contain personal data and are often used as evidence in reports. SentimentGuard shows how to combine three concerns in one small system:

- **Privacy:** user names, e-mails and ids are replaced by an HMAC-SHA256 pseudonym, so the same person always maps to the same token but cannot be read back without the secret.
- **Integrity:** every result row stores a hash of its content plus the previous row's hash. `GET /api/jobs/{id}/verify-chain` recomputes the chain and reports the exact index where it breaks.
- **Throughput:** the analysis step runs on Apache Spark, so large files do not block the API.

## Architecture

```text
React + Vite ──► ASP.NET Core API ──► Python worker (Flask + PySpark)
  (web)            (Clean Architecture)      │  pseudonymize → classify → aggregate
                         │                   ▼
                         └──────────────►  MongoDB   (jobs, results, summaries, hash chain)
```

| Part | Responsibility |
|---|---|
| `backend/` | ASP.NET Core API in four layers (Api, Application, Domain, Infrastructure): uploads, jobs, summaries, chain verification, PDF report |
| `worker/` | Flask service with a PySpark pipeline: HMAC anonymizer, sentiment and category classifier, aggregator, Mongo writer |
| `web/` | React + TypeScript dashboard: upload, job list, job details with sentiment and category charts, TR/EN UI |
| `docker-compose.yml` | MongoDB, Mongo Express, API, worker and web |

### API

| Endpoint | Purpose |
|---|---|
| `POST /api/uploads` | Upload a review file and start a job |
| `GET /api/jobs`, `GET /api/jobs/{id}` | List jobs, job status |
| `GET /api/jobs/{id}/summary` | Sentiment and category totals |
| `GET /api/jobs/{id}/results`, `/top-comments` | Per-row results, most repeated comments (useful for spotting copy-pasted or manipulated reviews) |
| `GET /api/jobs/{id}/verify-chain` | Recompute the hash chain and report tampering |
| `GET /api/jobs/{id}/report` | Download a PDF report |

## Run it

```bash
cp .env.example .env            # then set your own HMAC_SECRET
docker compose up --build
```

- Web UI: http://localhost:3010
- API: http://localhost:5000
- Mongo Express: http://localhost:8081

`sample-data/` contains English, Turkish and mixed review files (small and 20 000-row sets) plus a sample of manipulated (repetitive) reviews. Helper scripts live in `scripts/`.

> Always set your own `HMAC_SECRET`. The compose file has a development fallback so the demo starts, but a real deployment must not use it.

## Known limits

- The classifier is rule- and keyword-based (with TextBlob), chosen to be explainable and easy to replace; it is not a trained model. The code marks `classify_sentiment()` as the swap point.
- Spark runs in `local[*]` mode inside the worker container, not on a cluster.
- The backend test project is still a placeholder.
- The user context is a demo header (`X-Demo-User`) used to separate jobs per user, so there is no real authentication yet.

## Author

**Halil İbrahim Yıldırım** — .NET backend developer · [GitHub](https://github.com/devlightening) · [LinkedIn](https://www.linkedin.com/in/0001myprofile)
