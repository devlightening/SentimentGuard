FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    default-jdk-headless \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/default-java
ENV PYSPARK_PYTHON=python3

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN python -m textblob.download_corpora 2>/dev/null || python -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger')"

COPY app/ ./app/

EXPOSE 8000
CMD ["python", "-m", "app.main"]

