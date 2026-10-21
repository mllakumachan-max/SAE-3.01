-- ---------------------------------------------------------------------------
-- Migration — 2026-10-20 — DEC-c : URL propre et description de produit
--
-- Objectif : permettre la page de détail d'un produit (DEC-c).
--   1. PRODUIT.slug        : identifiant lisible dans l'URL (/produit/<slug>)
--   2. PRODUIT.description : description détaillée, affichée sur la fiche produit
--
-- Le nom du produit ne peut pas servir d'URL : il contient des espaces, des
-- accents et des apostrophes, et il n'est pas unique (deux produits peuvent
-- porter le même nom). Le slug est donc stocké, avec une contrainte d'unicité.
--
-- Cette migration s'applique à une base déjà peuplée. Pour une installation
-- neuve, importer directement sae301.sql, qui contient déjà ces colonnes.
-- ---------------------------------------------------------------------------

-- 1. Colonnes ajoutées : facultatives d'abord, pour ne pas casser les lignes
--    existantes pendant que l'on remplit les slugs.
ALTER TABLE PRODUIT
    ADD COLUMN slug        VARCHAR(160) NULL AFTER reference,
    ADD COLUMN description TEXT         NULL AFTER format;

-- 2. Remplissage. Le slug est écrit en dur, à partir de la référence produit :
--    c'est plus sûr qu'une conversion automatique, et cela garantit la même
--    valeur sur toutes les bases.
UPDATE PRODUIT SET slug = 'couette-sans-housse-easy'                          WHERE reference = '3224852';
UPDATE PRODUIT SET slug = 'boule-lumineuse'                                   WHERE reference = '3218318';
UPDATE PRODUIT SET slug = 'rideau-velours'                                    WHERE reference = '3221823';
UPDATE PRODUIT SET slug = 'serviette'                                         WHERE reference = '3216983';
UPDATE PRODUIT SET slug = 'serviette-d-invite'                                WHERE reference = '3216958';
UPDATE PRODUIT SET slug = 'taies-d-oreiller-hotel-royal'                      WHERE reference = '3206228';
UPDATE PRODUIT SET slug = 'oreiller-double-face-mousse-a-memoire-de-forme'     WHERE reference = '3205523';
UPDATE PRODUIT SET slug = 'crayons-aquarelle-van-bleiswijck'                  WHERE reference = '3224274';
UPDATE PRODUIT SET slug = 'pinceaux-van-bleiswijck'                           WHERE reference = '3223718';
UPDATE PRODUIT SET slug = 'peinture-acrylique-van-bleiswijck'                 WHERE reference = '3214279';
UPDATE PRODUIT SET slug = 'toile-a-peindre-van-bleiswijck'                    WHERE reference = '2545912';
UPDATE PRODUIT SET slug = 'paillettes'                                        WHERE reference = '3227238';
UPDATE PRODUIT SET slug = 'boites-a-outils-keter'                             WHERE reference = '3227914';
UPDATE PRODUIT SET slug = 'lampe-de-travail-trepied-rechargeable-werckmann'   WHERE reference = '3221537';

-- 2 bis. Remplissage des descriptions : le texte est repris tel quel de
--        sae301.sql, pour que la migration et le jeu de données de départ
--        décrivent les produits de la même façon.
UPDATE PRODUIT SET description = 'Couette sans housse au toucher doux, disponible en plusieurs couleurs. Son remplissage léger assure un confort suffisant toute l’année, sans l’encombrement d’une couette doublée. Livrée sans housse, elle se lave facilement en machine.'
     WHERE reference = '3224852';
UPDATE PRODUIT SET description = 'Boule lumineuse de 18 cm de diamètre, équipée de 140 LED. Son variateur de couleurs crée une ambiance aussi bien scandinave que modernes, et sa faible consommation permet de la laisser allumée longtemps. Fonctionne sur piles.'
     WHERE reference = '3218318';
UPDATE PRODUIT SET description = 'Rideau en velours de 135 x 260 cm, au tombé ample qui masque la lumière et isole du froid. Il est vendu à la pièce, dans plusieurs couleurs. Sa matière épaisse se ride facilement et garde son pli toute la journée.'
     WHERE reference = '3221823';
UPDATE PRODUIT SET description = 'Serviette de toilette de 50 x 100 cm, en coton gratté doux et absorbent. Disponible en plusieurs couleurs pour s’accorder à votre salle de bain. Le tissage dense conserve ses couleurs lavage après lavage.'
     WHERE reference = '3216983';
UPDATE PRODUIT SET description = 'Petite serviette d’invité de 30 x 50 cm, idéale pour les mains des visiteurs ou pour les barbecues. Sa taille compacte se range facilement dans un placard et se transporte sans encombre.'
     WHERE reference = '3216958';
UPDATE PRODUIT SET description = 'Lot de 2 taies d’oreiller 63 x 63 cm, en coton à l’esprit hôtelier. Leur crispage soigné tient la forme même après de nombreux lavages. Vendues par paire, à associer à une parure de votre choix.'
     WHERE reference = '3206228';
UPDATE PRODUIT SET description = 'Oreiller de 57 x 38 x 11 cm, en mousse à mémoire de forme, recto et verso. La mousse épouse la forme de la nuque et de la tête pour un soutien régulier. Sa hauteur de 11 cm convient aussi bien aux dormeurs sur le dos qu’à ceux qui dorment sur le côté.'
     WHERE reference = '3205523';
UPDATE PRODUIT SET description = 'Coffret de 72 crayons aquarelle Van Bleiswijck, aux couleurs vives et facile à superposer. Ils s’aquarellent à l’eau, se mélangent entre eux et tiennent bien sur le papier. Un coffret complet pour l’école comme pour les loisirs créatifs.'
     WHERE reference = '3224274';
UPDATE PRODUIT SET description = 'Set de 9 pinceaux Van Bleiswijck de tailles et de formes différentes : pinceaux fins pour les détails, plus larges pour les aplats. Poils souples qui gardent la peinture et la rendent facile à mélanger.'
     WHERE reference = '3223718';
UPDATE PRODUIT SET description = 'Lot de 30 pots de peinture acrylique de 12 ml, aux couleurs opaques qui couvrent en une passe. Sèche rapidement, se mélange facilement et convient aussi bien à la toile qu’au papier, au carton ou au bois.'
     WHERE reference = '3214279';
UPDATE PRODUIT SET description = 'Toile à peindre de 29 x 29 cm, pré-encrée pour une bonne adhérence de la peinture. Elle s’utilise aussi bien à l’acrylique qu’à l’huile, et se conserve à plat une fois terminée.'
     WHERE reference = '2545912';
UPDATE PRODUIT SET description = 'Six pots de paillettes aux couleurs assorties, pour personnaliser cartes, cadeaux et décorations. Elles s’appliquent à la colle ou au fer, et donnent de l’éclat aux surfaces brillantes.'
     WHERE reference = '3227238';
UPDATE PRODUIT SET description = 'Lot de 2 boîtes à outils Keter, empilables et munies de poignées. La boîte du dessus se transforme en siège : elle se pose au sol et garde les outils à portée de main pendant un chantier.'
     WHERE reference = '3227914';
UPDATE PRODUIT SET description = 'Lampe de travail sur trépied, réglable de 77 à 121 cm, délivrant 1 000 lumens. Rechargeable, elle s’utilise loin d’une prise, notamment sur un chantier. Sa tête inclinable dirige le faisceau là où vous en avez besoin.'
     WHERE reference = '3221537';

-- 3. Contrôle : aucun produit ne doit rester sans slug avant de le rendre
--    obligatoire. Le résultat attendu est 0.
SELECT COUNT(*) AS produits_sans_slug FROM PRODUIT WHERE slug IS NULL;

-- 4. Le slug devient obligatoire et unique.
ALTER TABLE PRODUIT
    MODIFY COLUMN slug VARCHAR(160) NOT NULL,
    ADD UNIQUE KEY uq_produit_slug (slug);
