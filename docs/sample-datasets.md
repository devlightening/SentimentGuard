# Sample Datasets

## product_reviews_small.csv
- 20 rows
- Turkish and English comments
- Use for: quick functional testing

## product_reviews_large.csv
- 500 rows
- Cyclic comment patterns for repeating comment demo
- Use for: batch processing / PySpark demo

## manipulated_sample.csv
- 6 rows
- Row 3 is intentionally wrong (tampered label in comment)
- Use for: demo of hash chain failure detection

## Required Columns
```
user_name, email, user_id, comment, product_name, created_at
```

Minimum required: any one identity field + comment field.
