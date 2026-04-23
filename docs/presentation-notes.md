# Presentation Notes

## BM 436 - Buyuk Veri Analizine Giris

- PySpark batch pipeline: records are processed with Spark transformations in parallel.
- Local mode still demonstrates the distributed programming model.
- Batch processing: a whole dataset is processed as one "analysis job".
- MongoDB is used as a NoSQL document store for job/result persistence.
- The architecture can scale: the same pipeline can run on a real cluster with minimal changes.

## BM 404 - Bilgi Guvenligi

- Privacy: pseudo-anonymization with deterministic keyed hashing (HMAC-SHA256).
- Plaintext identity fields are not persisted; only masked values are stored.
- Integrity: hash chain (`prevHash`, `currentHash`) makes any DB tampering detectable.
- Verification: a backend endpoint recomputes the chain and reports where it breaks.
- Audit: PDF export includes chain status and the final hash.

## Why Combine Both Courses?

In real systems, analytics pipelines must be secure by design:

- privacy is needed when processing user-generated content
- integrity is required when results must be trusted (audit, reporting, academic evaluation)

