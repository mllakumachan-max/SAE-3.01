-- ---------------------------------------------------------------------------
-- Migration — 2026-10-23 — Mise à jour des stocks produits
--
-- Objectif : attribuer à chaque produit un stock déterministe (et donc
-- reproductible) compris entre 0 et 50, au lieu du RAND() utilisé lors de
-- l'import initial. Les seuils d'alerte restent à 5.
--
-- Pour une installation neuve, importer directement sae301.sql, qui contient
-- déjà ces valeurs.
-- ---------------------------------------------------------------------------
UPDATE PRODUIT
SET stock = (id * 7 + 3) % 51,
    seuil_alerte = 5;

-- Contrôle : tous les stocks doivent être compris entre 0 et 50.
SELECT MIN(stock) AS stock_min, MAX(stock) AS stock_max, COUNT(*) AS produits_total
FROM PRODUIT;
