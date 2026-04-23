# SentimentGuard — Demo Script (10–15 minutes)

## Before You Start

1. Run `docker-compose up --build` (or start services locally)
2. Open http://localhost:3000 in browser
3. Have `sample-data/product_reviews_small.csv` ready
4. Have `sample-data/manipulated_sample.csv` ready
5. Have MongoDB Compass open (optional, for visual verification)

---

## Part 1 — Introduction (1 minute)

> "SentimentGuard is a platform that solves two real problems at once:
> 1. **Big Data Analytics**: analyzing large volumes of text feedback at scale using Apache Spark
> 2. **Information Security**: protecting identity privacy and proving result integrity"

Show the architecture slide or the `docs/architecture.md` diagram.

---

## Part 2 — Dataset Upload (2 minutes)

1. Open http://localhost:3000
2. Drag and drop `product_reviews_small.csv` onto the upload zone
3. Click "Start Analysis" (or it auto-triggers)

> "The frontend sends the file to our ASP.NET API. The API stores the file and creates an analysis job in MongoDB. It then calls the Python worker to start the pipeline."

4. Watch the job status change from Pending → Running → Completed
5. Navigate to the Job Detail page

---

## Part 3 — Anonymization Proof (2 minutes)

> "Before any analysis, sensitive identity fields are masked using HMAC-SHA256."

1. Open the Job Detail — Results section
2. Show the `maskedUser` column — it's a base64url-encoded hash, not a real name or email
3. Point out: "The original `ahmet@test.com` is now stored as this 43-character string"
4. Explain: "It's deterministic — the same email always maps to the same hash under the same secret key. This allows grouping without exposing identity."

If MongoDB Compass is open, show the `analysis_results` collection directly.

---

## Part 4 — Sentiment Dashboard (3 minutes)

1. Point to the sentiment pie chart: Positive / Negative / Neutral breakdown
2. Point to the category bar chart: Complaint / Question / Praise / Disappointment
3. Scroll to "Top Repeated Comments" section
4. Show the top 3 repeated comments with their sentiment labels

> "PySpark processes all rows as a distributed RDD even in local mode. The pipeline would scale horizontally on a real cluster with zero code changes."

---

## Part 5 — Hash Chain Verification (3 minutes)

1. Click "Verify Chain" button
2. Show the green "Chain is intact" badge

> "Every result record in MongoDB stores two hashes: prev_hash (the previous record's hash) and current_hash = SHA256(canonical_payload + prev_hash). This creates a tamper-evident chain."

3. Show the final hash value at the bottom

**Now demonstrate chain failure:**

4. Open MongoDB Compass → `sentimentguard` → `analysis_results`
5. Find any record — double-click to edit
6. Change the `original_comment` field to any different value
7. Save the record
8. Go back to the UI and click "Verify Chain" again
9. Show the red "Chain broken at record index N" badge

> "The system immediately detected that record #N was modified. In a forensic context, this proves the results were tampered with after analysis."

---

## Part 6 — PDF Report (1 minute)

1. Click "Download PDF" button
2. Open the downloaded PDF

Show:
- Job ID and filename
- Sentiment distribution summary
- Top repeated comments
- Chain integrity status
- Final hash value
- Generated timestamp

> "The report is suitable for audit or academic submission."

---

## Part 7 — Large Dataset (optional, 1 minute)

1. Upload `product_reviews_large.csv` (500 rows)
2. Watch the progress counter
3. Show that PySpark processed 500 records in batch

---

## Part 8 — Academic Defense Points (2 minutes)

### Why Spark?
> "Spark enables distributed batch processing. The same pipeline code would run on a 10-node cluster processing millions of rows. Local mode is used here for the demo."

### Why MongoDB?
> "Flexible document storage fits the variable structure of analysis results. NoSQL gives us fast insertion and schema flexibility for different dataset formats."

### Why hash chain instead of blockchain?
> "We need integrity verification in a centralized system without the complexity of distributed consensus. The hash chain achieves tamper-detection with O(n) verification."

### Why HMAC instead of plain SHA-256?
> "Keyed hashing prevents rainbow table attacks. An adversary without the secret key cannot reproduce or reverse the masked values."

---

## Common Questions

**Q: What if the file has different column names?**
A: The worker looks for `comment`, `text`, or `review` fields. Column mapping can be extended.

**Q: Is the classification perfect?**
A: No. The MVP uses TextBlob polarity + keyword rules. The architecture is designed for model replacement — swap `classify_sentiment()` in `classifier.py` with any ML model.

**Q: How would this scale?**
A: Replace local PySpark with a Spark cluster, add a message queue (Kafka/RabbitMQ) for job dispatch, and use MongoDB replica set for HA.
