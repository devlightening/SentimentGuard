"""
SentimentGuard Analysis Worker
Exposes /analyze endpoint; processes uploaded files with PySpark + classification pipeline.
"""
import logging
import os
import sys

from flask import Flask, jsonify, request
from pyspark.sql import SparkSession
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType, FloatType, StructType, StructField

from app.config import WORKER_PORT
from app.pipeline.anonymizer import get_masked_user
from app.pipeline.classifier import classify_sentiment, classify_category
from app.pipeline.mongo_writer import write_results, update_job_status
from app.utils.file_reader import read_file

logging.basicConfig(level=logging.INFO, stream=sys.stdout,
                    format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

app = Flask(__name__)

spark: SparkSession | None = None


def get_spark() -> SparkSession:
    global spark
    if spark is None:
        spark = (SparkSession.builder
                 .appName("SentimentGuard")
                 .master("local[*]")
                 .config("spark.driver.memory", "1g")
                 .config("spark.sql.shuffle.partitions", "4")
                 .getOrCreate())
        spark.sparkContext.setLogLevel("WARN")
    return spark


def _run_pipeline(job_id: str, file_path: str):
    log.info(f"Pipeline start: job={job_id} file={file_path}")
    update_job_status(job_id, "Running")

    try:
        raw_rows = read_file(file_path)
        if not raw_rows:
            raise ValueError("File is empty or has no valid rows.")

        sc = get_spark()

        # Build PySpark RDD pipeline
        rdd = sc.sparkContext.parallelize(raw_rows)

        def process_row(row: dict) -> dict:
            comment = str(row.get("comment") or row.get("text") or row.get("review") or "").strip()
            masked_user = get_masked_user(row)
            sentiment, score = classify_sentiment(comment)
            category = classify_category(comment)
            return {
                "masked_user": masked_user,
                "original_comment": comment,
                "sentiment": sentiment,
                "category": category,
                "score": score,
            }

        processed = rdd.map(process_row).collect()
        total = len(processed)

        final_hash = write_results(job_id, processed)
        update_job_status(job_id, "Completed", total=total, processed=total)
        log.info(f"Pipeline done: job={job_id} records={total} final_hash={final_hash[:16]}...")

    except Exception as exc:
        log.error(f"Pipeline error: job={job_id} error={exc}", exc_info=True)
        update_job_status(job_id, "Failed", error=str(exc))
        raise


@app.route("/analyze", methods=["POST"])
def analyze():
    body = request.get_json(force=True, silent=True) or {}
    job_id = body.get("job_id")
    file_path = body.get("file_path")

    if not job_id or not file_path:
        return jsonify({"error": "job_id and file_path are required"}), 400

    if not os.path.exists(file_path):
        return jsonify({"error": f"File not found: {file_path}"}), 404

    try:
        _run_pipeline(job_id, file_path)
        return jsonify({"status": "completed", "job_id": job_id}), 200
    except Exception as exc:
        return jsonify({"status": "failed", "job_id": job_id, "error": str(exc)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=WORKER_PORT, debug=False)
