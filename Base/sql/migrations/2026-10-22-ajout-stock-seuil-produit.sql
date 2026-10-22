-- ---------------------------------------------------------------------------
-- Migration — 2026-10-22 — GOF-a : stock et seuil d'alerte par produit
--
-- Objectif : permettre à l'administrateur de fixer le stock d'un produit et
-- le seuil à partir duquel il passe « Bientôt épuisé » (fiche GOF-a).
--
--   stock         : quantité disponible. Par défaut 0 : les produits existants
--                   apparaîtront « Épuisé » jusqu'à ce que l'administrateur
--                   saisisse leur stock réel.
--   seuil_alerte  : au-dessous de cette quantité, l'état passe à « Bientôt épuisé ».
--                   Par défaut 5, valeur déjà utilisée par le front.
--
-- Pour une installation neuve, importer directement sae301.sql, qui contient
-- déjà ces colonnes.
-- ---------------------------------------------------------------------------

ALTER TABLE PRODUIT
    ADD COLUMN stock        SMALLINT UNSIGNED NOT NULL DEFAULT 0 AFTER badge,
    ADD COLUMN seuil_alerte TINYINT UNSIGNED  NOT NULL DEFAULT 5 AFTER stock;

-- Contrôle : le nombre de produits ne doit pas avoir changé.
SELECT COUNT(*) AS produits_total FROM PRODUIT;