-- ---------------------------------------------------------------------------
-- Migration — 2026-10-21 — DEC-b : produits de test de la catégorie Bricolage
--
-- Objectif : satisfaire la Définition of Done de DEC-b, « base de données
-- initialisée avec les produits de test (au moins 3 catégories de 4
-- produits) ».
--
-- La base contenait deux catégories de quatre produits ou plus (Habitat : 7,
-- Hobby : 5). La catégorie Bricolage n'en comptait que deux : deux produits
-- de test y sont ajoutés, ce qui porte le total à trois catégories de quatre
-- produits au moins.
--
-- Ces deux produits sont des visuels de test : les images sont des
-- illustrations simples, générées pour le projet, et non des photographies.
--
-- Cette migration s'applique à une base déjà peuplée. Pour une installation
-- neuve, importer directement sae301.sql, qui contient déjà ces produits.
-- ---------------------------------------------------------------------------

-- 1. Les produits. La référence '90000xx' signale un produit de test : elle
--    n'appartient pas au catalogue d'Action.
INSERT INTO PRODUIT
    (reference,
    slug,
    nom,
    marque,
    format,
    description,
    prix,
    prix_unitaire,
    unite_prix,
    badge,
    categorie_id,
    sous_categorie_id)
SELECT '9000001',
       'multiprise-pro-max-triple',
       'Multiprise Pro-max Triple',
       NULL,
       'Diverses couleurs',
       'Multiprise à trois branches, en acier chromé, pour serrer les pièces de toutes formes. Ses branches gainées offer une bonne prise en main, et la molette de réglage permet d’adapter l’ouverture à la pièce à maintenir.',
       7.95,
       7.95,
       '€/pce',
       "Semaine d'Action",
       4,
       13
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM PRODUIT WHERE reference = '9000001');

INSERT INTO PRODUIT
    (reference,
    slug,
    nom,
    marque,
    format,
    description,
    prix,
    prix_unitaire,
    unite_prix,
    badge,
    categorie_id,
    sous_categorie_id)
SELECT '9000002',
       'lampe-travail-sans-fil-werckmann',
       'Lampe de travail sans fil Werckmann',
       'Werckmann',
       '2 100 lumens | 15,5 x 10,5 cm',
       'Lampe de travail sans fil délivrant 2 100 lumens, pour éclairer un chantier ou un atelier. Sa batterie rechargeable la rend autonome, et son pied permet de la poser sur une surface ou de la tenir en main. Livrée avec son câble de recharge.',
       9.95,
       9.95,
       '€/pce',
       'Nouveau',
       4,
       13
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM PRODUIT WHERE reference = '9000002');

-- 2. Les images de chaque produit : la galerie a besoin de plusieurs visuels
--    pour que la navigation entre les images soit vérifiable.
INSERT INTO GALERIE (chemin, produit_id, ordre, texte_alternatif)
SELECT 'bricolage/multiprise-pro-max-triple.avif', PRODUIT.id, 1, 'Multiprise Pro-max Triple'
  FROM PRODUIT
 WHERE PRODUIT.reference = '9000001'
   AND NOT EXISTS (
       SELECT 1 FROM GALERIE WHERE GALERIE.chemin = 'bricolage/multiprise-pro-max-triple.avif'
   );

INSERT INTO GALERIE (chemin, produit_id, ordre, texte_alternatif)
SELECT 'bricolage/multiprise-pro-max-triple-boite.avif', PRODUIT.id, 2, 'Multiprise Pro-max Triple, emballage'
  FROM PRODUIT
 WHERE PRODUIT.reference = '9000001'
   AND NOT EXISTS (
       SELECT 1 FROM GALERIE WHERE GALERIE.chemin = 'bricolage/multiprise-pro-max-triple-boite.avif'
   );

INSERT INTO GALERIE (chemin, produit_id, ordre, texte_alternatif)
SELECT 'bricolage/multiprise-pro-max-triple-detail.avif', PRODUIT.id, 3, 'Détail de la multiprise Pro-max Triple'
  FROM PRODUIT
 WHERE PRODUIT.reference = '9000001'
   AND NOT EXISTS (
       SELECT 1 FROM GALERIE WHERE GALERIE.chemin = 'bricolage/multiprise-pro-max-triple-detail.avif'
   );

INSERT INTO GALERIE (chemin, produit_id, ordre, texte_alternatif)
SELECT 'bricolage/lampe-travail-sans-fil-werckmann.avif', PRODUIT.id, 1, 'Lampe de travail sans fil Werckmann'
  FROM PRODUIT
 WHERE PRODUIT.reference = '9000002'
   AND NOT EXISTS (
       SELECT 1 FROM GALERIE WHERE GALERIE.chemin = 'bricolage/lampe-travail-sans-fil-werckmann.avif'
   );

INSERT INTO GALERIE (chemin, produit_id, ordre, texte_alternatif)
SELECT 'bricolage/lampe-travail-sans-fil-werckmann-boite.avif', PRODUIT.id, 2, 'Lampe de travail Werckmann, emballage'
  FROM PRODUIT
 WHERE PRODUIT.reference = '9000002'
   AND NOT EXISTS (
       SELECT 1 FROM GALERIE WHERE GALERIE.chemin = 'bricolage/lampe-travail-sans-fil-werckmann-boite.avif'
   );

INSERT INTO GALERIE (chemin, produit_id, ordre, texte_alternatif)
SELECT 'bricolage/lampe-travail-sans-fil-werckmann-detail.avif', PRODUIT.id, 3, 'Détail de la lampe de travail Werckmann'
  FROM PRODUIT
 WHERE PRODUIT.reference = '9000002'
   AND NOT EXISTS (
       SELECT 1 FROM GALERIE WHERE GALERIE.chemin = 'bricolage/lampe-travail-sans-fil-werckmann-detail.avif'
   );

-- 3. Contrôle : chaque catégorie racine doit compter les produits attendus.
--    Le résultat attendu est Bricolage : 4.
SELECT CATEGORIE.libelle,
       COUNT(PRODUIT.id) AS nb_produits
  FROM CATEGORIE
  LEFT JOIN PRODUIT ON PRODUIT.categorie_id = CATEGORIE.id
 WHERE CATEGORIE.parent_id IS NULL
 GROUP BY CATEGORIE.id, CATEGORIE.libelle
 ORDER BY CATEGORIE.id;
