-- Fix superficie data for Dashboard after sample especes were deleted
-- Run in Supabase SQL Editor. Uses EXISTING especes and exploitations only.
-- Dashboard API filters by: annee = current year, espece.deleted IS NULL.
-- Change 2026 to your current year if needed.

-- Insert parcelles for current year: one row per existing espece, linked to first existing exploitation
INSERT INTO api_parcelle (
  deleted, deleted_by_cascade, annee, date_creation,
  superficie, sup_labouree, sup_emblavee, sup_sinsitree, sup_recoltee, sup_deserbee,
  prev_de_production, production, engrais_de_fond, engrais_de_couverture,
  espece_id, exploitation_id
)
SELECT
  NULL,
  false,
  2026,
  NOW(),
  3.00, 3.00, 2.80, 2.80, 2.70, 2.70,
  450.00, 420.00, 120.00, 80.00,
  e.id,
  (SELECT id FROM api_exploitation WHERE deleted IS NULL ORDER BY id LIMIT 1)
FROM api_espece e
WHERE e.deleted IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM api_parcelle p
    WHERE p.espece_id = e.id AND p.annee = 2026 AND p.deleted IS NULL
  )
LIMIT 10;

-- Update parcelle sequence if you care about IDs
SELECT setval('api_parcelle_id_seq', (SELECT COALESCE(MAX(id), 1) FROM api_parcelle));
