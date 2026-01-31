# Import backup into Supabase

---

## Safest: Full overwrite (drop everything, then load backup)

Use this when you want Supabase to match `backup.sql` exactly (all tables and data).

**1. In Supabase Dashboard → SQL Editor**, run this once. It drops the whole `public` schema (all tables, data, sequences) so the backup can run without "already exists" errors:

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

**2. From your machine** (terminal, in the `backend` folder), run the full backup with **psql**:

```bash
psql "postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres" -f backup.sql
```

- Get the URI from **Supabase → Project Settings → Database** (Connection string, URI).
- Replace `YOUR_PASSWORD` with your database password and `YOUR_PROJECT_REF` with your project ref.

After this, your Supabase database will have the same tables and data as `backup.sql`. Any previous data in `public` is gone.

---

## Alternative: Import only wilaya / subdivision / commune (tables already exist)

Your backup has `CREATE TABLE` but Supabase already has those tables. Use **data only** and load in the right order.

---

## Option 1: psql – run full backup (errors on CREATE are OK)

1. **In Supabase Dashboard → SQL Editor**, run this once (empties the 3 tables so COPY can load):

```sql
TRUNCATE api_commune, api_subdivision, api_wilaya RESTART IDENTITY CASCADE;
```

2. **From your machine** (in a terminal, from the `backend` folder), run the full backup with psql (PostgreSQL will error on “relation already exists” but continue; the `COPY` blocks will then load the data):

```bash
psql "postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres" -v ON_ERROR_STOP=0 -f backup.sql
```

- Replace `YOUR_PASSWORD` and `YOUR_PROJECT_REF` with your Supabase database password and project ref (from **Project Settings → Database**).
- `-v ON_ERROR_STOP=0` makes psql continue after “already exists” errors so the `COPY` commands run.

**Warning:** This also runs `COPY` for other tables (agriculteur, customuser, etc.). If those tables already have rows, you may get duplicate-key errors. If you only need wilaya/subdivision/commune, use Option 2.

---

## Option 2: Load only wilaya, subdivision, commune (recommended)

1. **In Supabase SQL Editor**, run:

```sql
TRUNCATE api_commune, api_subdivision, api_wilaya RESTART IDENTITY CASCADE;
```

2. Create a **data-only** SQL file that contains **only** the three `COPY` blocks (no `CREATE TABLE`):
   - From `backup.sql`, copy the blocks that start with `COPY public.api_wilaya ...` up to `\.`, then `COPY public.api_subdivision ...` up to `\.`, then `COPY public.api_commune ...` up to `\.` (in that order: wilaya → subdivision → commune).

3. Run that file with **psql** (COPY is not supported in the Supabase SQL Editor):

```bash
psql "YOUR_SUPABASE_URI" -f data_only_wilaya_subdiv_commune.sql
```

If you want, I can generate `data_only_wilaya_subdiv_commune.sql` from your `backup.sql` (it will be a large file with only those three COPY sections).
