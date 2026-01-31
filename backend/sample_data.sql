-- Sample data for LegumeSec dashboard (portfolio)
-- Run in Supabase SQL Editor: paste this file and click Run.
--
-- Uses high IDs (9001+) so inserts never conflict with existing data (no ON CONFLICT skip).
-- Dashboard APIs filter by CURRENT YEAR; sample uses 2026 — change if your year is different.
-- Backend must use the same Supabase DB (DATABASE_URL in backend .env).
--
-- Order: wilaya -> subdivision -> commune -> espece, agriculteur -> exploitation -> parcelle, objectif

-- 1. Wilayas (2)
INSERT INTO api_wilaya (id, deleted, deleted_by_cascade, nom) VALUES
(9001, NULL, false, 'Alger'),
(9002, NULL, false, 'Oran');

-- 2. Subdivisions (2, linked to wilayas)
INSERT INTO api_subdivision (id, deleted, deleted_by_cascade, nom, wilaya_id) VALUES
(9001, NULL, false, 'Bab Ezzouar', 9001),
(9002, NULL, false, 'Bir El Djir', 9002);

-- 3. Communes (2)
INSERT INTO api_commune (id, deleted, deleted_by_cascade, nom, subdivision_id) VALUES
(9001, NULL, false, 'Bab Ezzouar', 9001),
(9002, NULL, false, 'Bir El Djir', 9002);

-- 4. Especes (3)
INSERT INTO api_espece (id, deleted, deleted_by_cascade, nom) VALUES
(9001, NULL, false, 'Lentilles'),
(9002, NULL, false, 'Haricot'),
(9003, NULL, false, 'Pois chiche');

-- 5. Agriculteurs (3) — e.g. search nom='Benali'
INSERT INTO api_agriculteur (id, deleted, deleted_by_cascade, nom, prenom, "phoneNum", numero_carte_fellah) VALUES
(9001, NULL, false, 'Benali', 'Mohamed', 955510001, 990001),
(9002, NULL, false, 'Khelifi', 'Fatima', 955510002, 990002),
(9003, NULL, false, 'Mansouri', 'Ahmed', 955510003, NULL);

-- 6. Objectifs (3: wilaya x espece x annee, current year)
INSERT INTO api_objectif (id, deleted, deleted_by_cascade, annee, objectif_production, espece_id, wilaya_id) VALUES
(9001, NULL, false, 2026, 1500.00, 9001, 9001),
(9002, NULL, false, 2026, 800.00, 9002, 9001),
(9003, NULL, false, 2026, 1200.00, 9001, 9002);

-- 7. Exploitations (2)
INSERT INTO api_exploitation (id, deleted, deleted_by_cascade, nom, lieu, superficie, situation, longtitude, latitude, agriculteur_id, commune_id) VALUES
(9001, NULL, false, 'Exploitation Nord', 'Zone agricole Bab Ezzouar', 12.50, 'Terrain plat, irrigation', 3.2, 36.75, 9001, 9001),
(9002, NULL, false, 'Domaine Ouest', 'Bir El Djir', 8.00, 'Bord de route', 0.6, 35.72, 9002, 9002);

-- 8. Parcelles (4: annee = current year for Dashboard)
INSERT INTO api_parcelle (id, deleted, deleted_by_cascade, annee, date_creation, superficie, sup_labouree, sup_emblavee, sup_sinsitree, sup_recoltee, sup_deserbee, prev_de_production, production, engrais_de_fond, engrais_de_couverture, espece_id, exploitation_id) VALUES
(9001, NULL, false, 2026, '2026-01-15 10:00:00+00', 3.00, 3.00, 2.80, 2.80, 2.70, 2.70, 450.00, 420.00, 120.00, 80.00, 9001, 9001),
(9002, NULL, false, 2026, '2026-01-15 10:00:00+00', 2.50, 2.50, 2.40, 2.40, 2.30, 2.30, 380.00, 350.00, 90.00, 60.00, 9002, 9001),
(9003, NULL, false, 2026, '2026-02-01 10:00:00+00', 4.00, 4.00, 3.80, 3.80, 3.60, 3.60, 520.00, 480.00, 150.00, 100.00, 9001, 9002),
(9004, NULL, false, 2026, '2026-02-01 10:00:00+00', 2.00, 2.00, 1.90, 1.90, 1.85, 1.85, 280.00, 265.00, 70.00, 45.00, 9003, 9002);

-- Update sequences so next app-created rows get correct IDs
SELECT setval('api_wilaya_id_seq', (SELECT COALESCE(MAX(id), 1) FROM api_wilaya));
SELECT setval('api_subdivision_id_seq', (SELECT COALESCE(MAX(id), 1) FROM api_subdivision));
SELECT setval('api_commune_id_seq', (SELECT COALESCE(MAX(id), 1) FROM api_commune));
SELECT setval('api_espece_id_seq', (SELECT COALESCE(MAX(id), 1) FROM api_espece));
SELECT setval('api_agriculteur_id_seq', (SELECT COALESCE(MAX(id), 1) FROM api_agriculteur));
SELECT setval('api_objectif_id_seq', (SELECT COALESCE(MAX(id), 1) FROM api_objectif));
SELECT setval('api_exploitation_id_seq', (SELECT COALESCE(MAX(id), 1) FROM api_exploitation));
SELECT setval('api_parcelle_id_seq', (SELECT COALESCE(MAX(id), 1) FROM api_parcelle));
