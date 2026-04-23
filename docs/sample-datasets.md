# Sample Datasets

All sample datasets are under `sample-data/`.

## Included Files

- `product_reviews_tr_20000.csv`
  - 20,000 Turkish records
  - Good for batch demo and dashboards
- `product_reviews_en_20000.csv`
  - 20,000 English records
- `product_reviews_mixed_20000.csv`
  - 20,000 mixed Turkish + English

## Columns

Recommended columns:

```text
user_name,email,user_id,comment,product_name,created_at
```

Minimum required:

- at least one identity field (for masking demo), and
- one comment field (`comment`, or a similar text column)

