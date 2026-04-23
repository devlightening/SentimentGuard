# SentimentGuard — Architecture

## High-Level Overview

```
┌────────────────────────────────────────────────────────┐
│                     React Frontend                      │
│  Upload Page | Job List | Job Detail | Charts | PDF     │
└──────────────────────┬─────────────────────────────────┘
                       │ HTTP (REST)
┌──────────────────────▼─────────────────────────────────┐
│               ASP.NET Core Web API (.NET 8)             │
│  Controllers → Application Services → Infrastructure   │
│  Layers: Api | Application | Domain | Infrastructure   │
└────────┬───────────────────────────────┬───────────────┘
         │ MongoDB.Driver                │ HTTP POST /analyze
         ▼                               ▼
┌─────────────────┐            ┌─────────────────────────┐
│    MongoDB 7    │            │   Python Worker (Flask) │
│  analysis_jobs  │◄───────────│   PySpark Pipeline      │
│  analysis_results│           │   Anonymizer            │
│  report_exports │            │   Classifier            │
└─────────────────┘            │   Hash Chain Writer     │
                               └─────────────────────────┘
```

## Backend Layer Responsibilities

### SentimentGuard.Domain
- Entities: `AnalysisJob`, `AnalysisResult`, `AnalysisSummary`
- Enums: `JobStatus`, `SentimentLabel`, `CategoryLabel`
- Interfaces: `IAnalysisJobRepository`, `IAnalysisResultRepository`, `IHashChainService`, `IReportService`, `IWorkerTrigger`

### SentimentGuard.Application
- Service interfaces: `IUploadService`, `IJobService`
- Implementations: `UploadService`, `JobService`
- DTOs: `JobDto`, `ResultDto`, `SummaryDto`, `ChainVerificationDto`

### SentimentGuard.Infrastructure
- MongoDB repositories: `AnalysisJobRepository`, `AnalysisResultRepository`
- Services: `HashChainService`, `PdfReportService`, `WorkerTrigger`
- Mongo config: `MongoDbContext`, `MongoSettings`

### SentimentGuard.Api
- Controllers: `UploadsController`, `JobsController`
- DI wiring in `Program.cs`
- Swagger enabled

## Worker Pipeline

```
1. Receive POST /analyze {job_id, file_path}
2. Read file (CSV or JSON)
3. Parallelize rows with PySpark RDD
4. For each row:
   a. Extract comment field
   b. Mask identity fields with HMAC-SHA256
   c. Classify sentiment (TextBlob polarity)
   d. Classify category (rule-based keywords)
5. Collect results
6. Write to MongoDB with hash chain
7. Update job status
```

## Hash Chain Design

```
record[0]: current_hash = SHA256(canonical_0 + "|" + "GENESIS")
record[1]: current_hash = SHA256(canonical_1 + "|" + record[0].current_hash)
record[n]: current_hash = SHA256(canonical_n + "|" + record[n-1].current_hash)
```

Canonical format:
```
jobId={id}|maskedUser={u}|comment={c}|sentiment={s}|category={cat}|score={x.xxxx}
```

Verification recomputes the entire chain and compares stored hashes.
Any modification to any field of any record breaks the chain from that point.

## Security Design

### Pseudo-Anonymization
- Fields masked: `user_name`, `email`, `user_id`, `phone`
- Algorithm: HMAC-SHA256 with configurable secret key
- Output: base64url-encoded digest (deterministic for same input+secret)
- The original values are NOT stored; only the masked versions

### Why HMAC over plain hash?
- Keyed — attacker cannot reverse without the secret
- Deterministic — same input + same key = same masked output (allows grouping)
- Academically defensible as pseudo-anonymization

## Data Flow

```
User uploads file
  → API saves to /app/uploads/{uuid}.csv
  → Job created in MongoDB with status=Pending
  → Worker triggered via HTTP POST
  → Worker reads file
  → PySpark processes each row
  → Results written to MongoDB with hash chain
  → Job status updated to Completed
  → Frontend polls and renders results
```
