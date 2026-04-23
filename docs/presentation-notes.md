# Presentation Notes

## Big Data Analytics Course

- PySpark pipeline processes records as RDD (Resilient Distributed Dataset)
- `sc.sparkContext.parallelize(rows)` distributes data across available cores
- `.map(process_row).collect()` applies transformations in parallel
- Scales to cluster deployment with zero code changes
- MongoDB is a NoSQL document store — demonstrates non-relational data handling
- Batch processing: all records in one job run

## Information Security Course

- Pseudo-anonymization: identity fields are masked, never stored in plaintext
- HMAC-SHA256 with server-side secret key — keyed hashing, not plain hash
- Hash chain: each record's integrity is bound to all prior records
- Tamper detection: modifying any stored value breaks the chain from that point
- Chain verification endpoint provides forensic auditability

## Why Both Courses at Once?

Privacy and integrity are inherent requirements of any large-scale analytics system.
The project demonstrates that security is not an add-on but part of the core design.
