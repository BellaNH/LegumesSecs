-- Delete all data added by seed_top_wilaya_data.sql
-- Run in Supabase SQL Editor. Order: parcelles → exploitations → communes → subdivisions → wilayas → agriculteurs

-- 1. Parcelles (linked to exploitations 9101, 9102, 9103)
DELETE FROM api_parcelle WHERE exploitation_id IN (9101, 9102, 9103);

-- 2. Exploitations
DELETE FROM api_exploitation WHERE id IN (9101, 9102, 9103);

-- 3. Communes
DELETE FROM api_commune WHERE id IN (9101, 9102, 9103);

-- 4. Subdivisions
DELETE FROM api_subdivision WHERE id IN (9101, 9102, 9103);

-- 5. Wilayas
DELETE FROM api_wilaya WHERE id IN (9101, 9102, 9103);

-- 6. Agriculteurs
DELETE FROM api_agriculteur WHERE id IN (9101, 9102, 9103);
