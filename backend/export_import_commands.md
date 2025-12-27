# Export/Import Commands

## Export from Local Database

```bash
pg_dump -h localhost -U postgres -d your_local_db_name \
  --data-only \
  --column-inserts \
  --encoding=UTF8 \
  --no-owner \
  --no-privileges \
  -f backup.sql
```

## Import to Supabase

```bash
psql "postgresql://postgres:[YOUR_PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require" \
  --set ON_ERROR_STOP=on \
  -f backup.sql
```

## One-liner (if you have both connections configured)

```bash
pg_dump -h localhost -U postgres -d local_db --data-only --column-inserts --encoding=UTF8 --no-owner --no-privileges | psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
```











