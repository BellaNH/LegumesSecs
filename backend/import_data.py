"""
Script to import data from local PostgreSQL to Supabase
Run: python import_data.py
"""
import os
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

load_dotenv()

# Local database connection
local_conn = psycopg2.connect(
    host=os.getenv('LOCAL_DB_HOST', 'localhost'),
    port=os.getenv('LOCAL_DB_PORT', '5432'),
    database=os.getenv('LOCAL_DB_NAME', 'your_local_db'),
    user=os.getenv('LOCAL_DB_USER', 'postgres'),
    password=os.getenv('LOCAL_DB_PASSWORD', '')
)

# Supabase connection
supabase_conn = psycopg2.connect(
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT', '5432'),
    database=os.getenv('DB_NAME', 'postgres'),
    user=os.getenv('DB_USER', 'postgres'),
    password=os.getenv('DB_PASSWORD'),
    sslmode='require'
)

local_cur = local_conn.cursor()
supabase_cur = supabase_conn.cursor()

# List of tables to copy (in order to respect foreign keys)
tables = [
    'api_espece',
    'api_wilaya',
    'api_subdivision',
    'api_commune',
    'api_role',
    'api_customuser',
    'api_permissions',
    'api_userwilaya',
    'api_usersubdivision',
    'api_agriculteur',
    'api_exploitation',
    'api_parcelle',
    'api_objectif',
]

print("Starting data migration...")

for table in tables:
    try:
        # Get data from local
        local_cur.execute(f"SELECT * FROM {table}")
        columns = [desc[0] for desc in local_cur.description]
        rows = local_cur.fetchall()
        
        if not rows:
            print(f"  {table}: No data to copy")
            continue
        
        # Clear existing data (optional - comment out if you want to keep existing)
        supabase_cur.execute(f"TRUNCATE TABLE {table} CASCADE")
        
        # Insert data
        if rows:
            # Build INSERT statement
            cols_str = ', '.join(columns)
            placeholders = ', '.join(['%s'] * len(columns))
            insert_query = f"INSERT INTO {table} ({cols_str}) VALUES ({placeholders})"
            
            execute_values(supabase_cur, insert_query, rows)
            print(f"  {table}: Copied {len(rows)} rows")
        
    except Exception as e:
        print(f"  {table}: Error - {str(e)}")
        continue

supabase_conn.commit()
print("\nMigration completed!")

local_cur.close()
supabase_cur.close()
local_conn.close()
supabase_conn.close()


