-- ---------------------------------------------------------------------------
-- Migration — 2026-10-21 — GOF-c : description des catégories
--
-- Une catégorie se crée avec un nom et une description. La colonne est
-- facultative : les catégories existantes restent valides, sans description.
-- Aucune donnée n'est modifiée ni supprimée.
-- ---------------------------------------------------------------------------

ALTER TABLE CATEGORIE
    ADD COLUMN description VARCHAR(500) NULL AFTER slug;

-- Contrôle : le nombre de catégories ne doit pas avoir changé.
-- Résultat attendu sur la base de départ : 14.
SELECT COUNT(*) AS categories FROM CATEGORIE;
