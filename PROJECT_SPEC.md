# Project Spec: SentimentGuard (MVP)

## Purpose

SentimentGuard is a secure, batch-oriented sentiment analysis platform for processing large volumes of user feedback while preserving privacy and proving result integrity.

The MVP is intentionally designed for academic evaluation and local demo via Docker Compose.

## Non-Functional Goals

- Clear layered architecture (Api / Application / Domain / Infrastructure)
- Maintainable code over "clever" code
- End-to-end runnable locally with one command
- Practical security + integrity techniques suitable for an MVP

## Stack (Required)

- Backend: .NET 8 (ASP.NET Core Web API)
- Worker: Python + PySpark (batch pipeline)
- Frontend: React + Vite + TypeScript
- Database: MongoDB
- Orchestration: Docker Compose

## Core Features

### 1. Upload + Job Tracking

- Upload CSV or JSON to the backend.
- Create a job document in MongoDB (`analysis_jobs`).
- Store file on disk (`/app/uploads` inside containers).
- Trigger the worker to run the analysis.

### 2. Batch Analysis (PySpark)

Worker must:

- read the uploaded file
- parallelize records using PySpark
- for each record:
  - extract the comment text
  - mask identity fields (pseudo-anonymization)
  - classify sentiment (minimum: Positive / Negative / Neutral)
  - assign an MVP category (optional but implemented):
    - Complaint
    - Praise
    - Question
    - Disappointment
    - Other
- persist results to MongoDB (`analysis_results`)

### 3. Privacy via Pseudo-Anonymization

- Deterministic keyed hashing using HMAC-SHA256.
- Identity fields (examples): `user_name`, `email`, `user_id`, `phone`.
- Persist masked values only; do not persist plaintext identity fields.

### 4. Integrity via Hash Chain

- Each result document stores:
  - `prevHash`
  - `currentHash`
- `currentHash = SHA256(canonical_payload + "|" + prevHash)`
- The first record uses `prevHash = "GENESIS"`.

The system must provide a verification function/endpoint that detects tampering.

### 5. Web UI

Web app must provide:

- Upload flow
- Job list + job detail
- Charts/visualization for:
  - sentiment distribution
  - category breakdown
- Hash-chain verification display
- PDF export button

### 6. PDF Export (Backend)

- Generate a readable PDF summarizing a job:
  - job metadata (id, file, times)
  - sentiment distribution
  - category distribution
  - top repeated comments
  - chain verification status and final hash

## Demo User (Simple Multi-User Scoping)

To make demos more realistic without implementing full auth, the MVP uses a lightweight user scoping:

- Backend reads `X-Demo-User` header (or `?user=` query for report links).
- Jobs/results endpoints are filtered to the current user.
- Old jobs without `userId` are treated as belonging to `demo`.

## Deliverables

- Root docs: `README.md`, `PROJECT_SPEC.md`, `CODEBASE_BRIEF.md`
- Docs: `docs/architecture.md`, `docs/demo-script.md`
- Working Docker Compose setup
- Sample datasets under `sample-data/`
- End-to-end workflow works: upload -> analysis -> charts -> verify -> PDF

