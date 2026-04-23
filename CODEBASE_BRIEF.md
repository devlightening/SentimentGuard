# CODEBASE_BRIEF - SentimentGuard

This file is a concise guide to understand the project quickly: what it does, why it exists, and how the code is organized.

## What Problem Does It Solve?

Organizations receive lots of free-text feedback (product reviews, support tickets, surveys). We want to:

1. Analyze sentiment and intent in batch (big-data mindset).
2. Protect user identity (privacy).
3. Prove that stored analysis results were not modified later (integrity).

SentimentGuard demonstrates all three in a single MVP.

## Scenario (Explaining It To A Lecturer)

"A company collects 20,000 customer comments about delivery, packaging, and product quality. They want to understand customer sentiment and common issues quickly, but they cannot store personal data in plaintext and they need to prove the analysis results were not changed later."

Flow:

1. Analyst uploads a CSV file containing comments (and some identity fields).
2. System creates an analysis job in MongoDB.
3. Worker runs a PySpark batch pipeline:
   - masks identity fields using HMAC-SHA256 (deterministic pseudo-anonymization)
   - classifies sentiment (Positive/Negative/Neutral)
   - assigns a simple MVP category (Complaint/Praise/Question/Disappointment/Other)
   - writes results to MongoDB with a hash chain (tamper evidence)
4. Analyst opens the dashboard:
   - sees sentiment and category charts
   - checks top repeated comments (recurring issues)
   - verifies hash chain integrity
   - exports a PDF report for submission/audit

## What The Web App Shows

- Upload: what to upload, quality tips, privacy/integrity explanation.
- Analysis Jobs: list of previous jobs for the current "demo user".
- Job Detail: charts, top repeated comments, integrity verification, and PDF export.

## "Is This Only One User?"

By default, the system operates in a single-user demo mode (`demo`). To make test results more realistic, we added lightweight user scoping:

- Web UI selects a demo user (example: `demo`, `ali`, `ayse`)
- Backend filters job list/results to that user
- No real authentication: it is an MVP-friendly mechanism to show "one user's tests"

## MongoDB Collections (What Is Stored?)

Database: `sentimentguard`

1. `analysis_jobs`
   - one document per upload/job
   - includes file name, status, counters, and `userId`

2. `analysis_results`
   - one document per analyzed record (row)
   - includes:
     - `maskedUser` (HMAC output)
     - `originalComment`
     - `sentiment`, `category`, `score`
     - `prevHash`, `currentHash`

## Privacy (Information Security Course Mapping)

- Deterministic keyed hashing: HMAC-SHA256
- Prevents storing personal information in plaintext
- Still allows grouping/aggregation (same user -> same masked value)

## Integrity (Information Security Course Mapping)

- Hash chain links every result row to the previous row
- If any row is edited in the database, verification fails from that point
- The UI and PDF report show whether the chain is valid

## Big Data Analytics (Course Mapping)

- Worker uses PySpark batch processing:
  - parallelizes the dataset
  - applies transformations
  - writes results to NoSQL storage (MongoDB)
- Even in local mode, it demonstrates the distributed programming model and batch design.

## Code Layout

```
backend/  (.NET 8)
  SentimentGuard.Api/
  SentimentGuard.Application/
  SentimentGuard.Domain/
  SentimentGuard.Infrastructure/

worker/   (Python + PySpark + Flask)
web/      (React + Vite + TypeScript)
docs/     (architecture + demo script + notes)
sample-data/
scripts/
```

## Key Endpoints

- API:
  - `POST /api/uploads` upload a dataset
  - `GET /api/jobs` list jobs (scoped by demo user)
  - `GET /api/jobs/{id}` job details
  - `GET /api/jobs/{id}/summary` aggregated counts + hash info
  - `GET /api/jobs/{id}/verify-chain` detect tampering
  - `GET /api/jobs/{id}/report` PDF report
- Worker:
  - `POST /analyze` run pipeline for `{job_id, file_path}`
  - `GET /health` health check

