# Data Migration Guide: Local PostgreSQL → Supabase

## Method 1: Using Django dumpdata/loaddata (Recommended)

### Step 1: Export from local database
```bash
# Make sure your .env points to LOCAL database
python manage.py dumpdata --natural-foreign --natural-primary -o local_data.json
```

### Step 2: Update .env to point to Supabase
```bash
# Change DB_HOST, DB_PASSWORD, etc. to Supabase values
```

### Step 3: Run migrations on Supabase
```bash
python manage.py migrate
```

### Step 4: Import data to Supabase
```bash
python manage.py loaddata local_data.json
```

## Method 2: Using pg_dump with proper encoding

### Export:
```bash
pg_dump -h localhost -U postgres -d your_local_db \
  --data-only \
  --column-inserts \
  --encoding=UTF8 \
  --no-owner \
  --no-privileges \
  > clean_data.sql
```

### Import:
```bash
psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require" \
  --set ON_ERROR_STOP=on \
  -f clean_data.sql
```

## Method 3: Fix encoding in existing file

If you already have the SQL file, try:
```bash
# On Windows PowerShell
Get-Content local_data.sql -Raw -Encoding UTF8 | Set-Content clean_data.sql -Encoding UTF8

# Then import
psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require" -f clean_data.sql
```


