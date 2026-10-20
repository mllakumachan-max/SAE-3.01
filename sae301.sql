-- ---------------------------------------------------------------------------
-- SAE 3.01 — Click & collect Action
--
-- Données relevées sur https://www.action.com/fr-fr/.
-- ---------------------------------------------------------------------------

SET NAMES utf8mb4;

DROP TABLE IF EXISTS GALERIE;
DROP TABLE IF EXISTS PRODUIT;
DROP TABLE IF EXISTS CATEGORIE;

-- ---------------------------------------------------------------------------
-- Catégories
-- ---------------------------------------------------------------------------
CREATE TABLE CATEGORIE (
    id          TINYINT UNSIGNED    NOT NULL AUTO_INCREMENT,
    libelle     VARCHAR(100)        NOT NULL,
    slug        VARCHAR(100)        NOT NULL,
    parent_id   TINYINT UNSIGNED    NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_categorie_slug (slug),
    KEY idx_categorie_parent (parent_id),

    CONSTRAINT fk_categorie_parent
        FOREIGN KEY (parent_id) REFERENCES CATEGORIE (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Produits
-- ---------------------------------------------------------------------------
CREATE TABLE PRODUIT (
    id                  SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    reference           VARCHAR(20)       NOT NULL,
    nom                 VARCHAR(160)      NOT NULL,
    marque              VARCHAR(80)       NULL,
    format              VARCHAR(120)      NULL,
    prix                DECIMAL(6,2)      NOT NULL,
    prix_unitaire       DECIMAL(6,2)      NULL,
    unite_prix          VARCHAR(10)       NULL,
    badge               VARCHAR(40)       NULL,
    categorie_id        TINYINT UNSIGNED  NOT NULL,
    sous_categorie_id   TINYINT UNSIGNED  NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_produit_reference (reference),
    KEY idx_produit_nom (nom),
    KEY idx_produit_prix (prix),
    KEY idx_produit_categorie (categorie_id),
    KEY idx_produit_sous_categorie_id (sous_categorie_id),

    CONSTRAINT fk_produit_categorie
        FOREIGN KEY (categorie_id) REFERENCES CATEGORIE (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_produit_sous_categorie_id
        FOREIGN KEY (sous_categorie_id) REFERENCES CATEGORIE (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Galeries
-- ---------------------------------------------------------------------------
CREATE TABLE GALERIE (
    id                  SMALLINT UNSIGNED   NOT NULL AUTO_INCREMENT,
    chemin              VARCHAR(120)        NOT NULL,
    produit_id          SMALLINT UNSIGNED   NOT NULL,
    ordre               TINYINT UNSIGNED    NOT NULL DEFAULT 1,
    texte_alternatif    VARCHAR(160)        NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_galerie_chemin (chemin),
    KEY idx_galerie_produit (produit_id),

    CONSTRAINT fk_galerie_produit
        FOREIGN KEY (produit_id) REFERENCES PRODUIT (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Catégories
-- ---------------------------------------------------------------------------
INSERT INTO CATEGORIE (libelle, slug, parent_id) VALUES
    ('Multimédia',              'multimedia', NULL),
    ('Habitat',                 'habitat', NULL),
    ('Hobby',                   'hobby', NULL),
    ('Bricolage',               'bricolage', NULL),
    ('Plaids et couvertures',   'plaids-et-couvertures', 2),
    ('Décoration',              'decoration', 2),
    ('Salle de bain',           'salle-de-bain', 2),
    ('Oreillers',               'oreillers', 2),
    ('Literie',                 'literie', 2),
    ('Peindre',                 'peindre', 3),
    ('Coloriage et dessin',     'coloriage-et-dessin', 3),
    ('Activités manuelles',     'activites-manuelles', 3),
    ('Outils',                  'outils', 4),
    ('Rangement',               'rangement', 4);

-- ---------------------------------------------------------------------------
-- Produits
-- ---------------------------------------------------------------------------
INSERT INTO PRODUIT
    (reference,
    nom,
    marque,
    format,
    prix,
    prix_unitaire,
    unite_prix,
    badge,
    categorie_id,
    sous_categorie_id)
VALUES
    -- Multimédia
    

    -- Habitat
    ('3224852',
    'Couette sans housse Easy',
    NULL,
    '140 x 200 cm | Diverses couleurs',
    9.95,
    3.55,
    '€/m²',
    "Semaine d'Action",
    2,
    9),
    
    ('3218318',
    'Boule lumineuse',
    NULL,
    'Ø 18 cm | 140 LED',
    3.99,
    3.99,
    '€/pce',
    "Semaine d'Action",
    2,
    6),
    
    ('3221823',
    'Rideau velours',
    NULL,
    '135 x 260 cm | Diverses couleurs',
    2.95,
    1.98,
    '€/m²',
    'Nouveau',
    2,
    6),
    
    ('3216983',
    'Serviette',
    NULL,
    '50 x 100 cm | Diverses couleurs',
    2.49,
    4.98,
    '€/m²',
    "Semaine d'Action",
    2,
    7),
    
    ('3216958',
    "Serviette d'invité",
    NULL,
    '30 x 50 cm | Diverses couleurs',
    1.29,
    8.60,
    '€/m²',
    "Semaine d'Action",
    2,
    7),
    
    ('3206228',
    "Taies d'oreiller Hotel Royal",
    'Hotel Royal',
    '2 pièces | 63 x 63 cm',
    5.49,
    2.75,
    '€/pce',
    NULL,
    2,
    8),
    
    ('3205523',
    'Oreiller double face en mousse à mémoire de forme',
    'Hotel Royal',
    '57 x 38 x 11 cm',
    15.29,
    NULL,
    NULL,
    NULL,
    2,
    8),
    
    -- Hobby
    ('3224274',
    'Crayons aquarelle Van Bleiswijck',
    'Van Bleiswijck',
    '72 pièces',
    7.95,
    0.11,
    '€/pce',
    NULL,
    3,
    11),
    
    ('3223718',
    'Pinceaux Van Bleiswijck',
    'Van Bleiswijck',
    '9 pièces',
    2.99,
    2.99,
    '€/pce',
    NULL,
    3,
    10),
    
    ('3214279',
    'Peinture acrylique Van Bleiswijck',
    'Van Bleiswijck',
    '30 x 12 ml',
    3.79,
    10.53,
    '€/l',
    NULL,
    3,
    10),
    
    ('2545912',
    'Toile à peindre Van Bleiswijck',
    'Van Bleiswijck',
    '29 x 29 cm',
    1.49,
    1.49,
    '€/pce',
    NULL,
    3,
    10),
    
    ('3227238',
    'Paillettes',
    NULL,
    '6 pièces | Diverses couleurs',
    0.55,
    0.55,
    '€/pce',
    'Nouveau',
    3,
    12),
    
    -- Bricolage
    ('3227914',
    'Boîtes à outils Keter',
    'Keter',
    '2 pièces',
    8.99,
    4.50,
    '€/pce',
    'Nouveau',
    4,
    13),
    
    ('3221537',
    'Lampe de travail trépied rechargeable Werckmann',
    'Werckmann',
    '1 000 lumens | 77–121 cm',
    15.95,
    15.95,
    '€/pce',
    'Nouveau',
    4,
    13);

-- ---------------------------------------------------------------------------
-- Galeries
-- ---------------------------------------------------------------------------
INSERT INTO GALERIE
    (chemin, produit_id, ordre, texte_alternatif)
VALUES
    ('habitat/couette-sans-housse-blanche.avif', (SELECT id FROM PRODUIT WHERE reference = '3224852'), 1, 'Couette sans housse Easy blanche'),
    ('habitat/couette-sans-housse-beige.avif', (SELECT id FROM PRODUIT WHERE reference = '3224852'), 2, 'Couette sans housse Easy beige'),
    ('habitat/couette-sans-housse-noire.avif', (SELECT id FROM PRODUIT WHERE reference = '3224852'), 3, 'Couette sans housse Easy noire'),
    ('habitat/couette-sans-housse-blanche-zoom.avif', (SELECT id FROM PRODUIT WHERE reference = '3224852'), 4, 'Détail de la couette blanche'),
    ('habitat/couette-sans-housse-beige-zoom.avif', (SELECT id FROM PRODUIT WHERE reference = '3224852'), 5, 'Détail de la couette beige'),
    ('habitat/couette-sans-housse-noire-zoom.avif', (SELECT id FROM PRODUIT WHERE reference = '3224852'), 6, 'Détail de la couette noire'),
    ('habitat/couette-sans-housse-sac.avif', (SELECT id FROM PRODUIT WHERE reference = '3224852'), 7, 'Couette dans son sac'),
    ('habitat/boule-lumineuse.avif', (SELECT id FROM PRODUIT WHERE reference = '3218318'), 1, 'Boule lumineuse 140 LED'),
    ('habitat/boule-lumineuse-boite.avif', (SELECT id FROM PRODUIT WHERE reference = '3218318'), 2, 'Boîte de la boule lumineuse'),
    ('habitat/boule-lumineuse-cable.png', (SELECT id FROM PRODUIT WHERE reference = '3218318'), 3, 'Câble de la boule lumineuse'),
    ('habitat/rideaux-velours-beige.avif', (SELECT id FROM PRODUIT WHERE reference = '3221823'), 1, 'Rideau velours beige'),
    ('habitat/rideaux-velours-rose.avif', (SELECT id FROM PRODUIT WHERE reference = '3221823'), 2, 'Rideau velours rose'),
    ('habitat/rideaux-velours-beige-zoom.avif', (SELECT id FROM PRODUIT WHERE reference = '3221823'), 3, 'Détail du rideau velours beige'),
    ('habitat/rideaux-velours-rose-zoom.avif', (SELECT id FROM PRODUIT WHERE reference = '3221823'), 4, 'Détail du rideau velours rose'),
    ('habitat/rideaux-velours-beige-boite.avif', (SELECT id FROM PRODUIT WHERE reference = '3221823'), 5, 'Emballage du rideau velours beige'),
    ('habitat/rideaux-velours-rose-boite.avif', (SELECT id FROM PRODUIT WHERE reference = '3221823'), 6, 'Emballage du rideau velours rose'),
    ('habitat/serviette-noire.avif', (SELECT id FROM PRODUIT WHERE reference = '3216983'), 1, 'Serviette noire'),
    ('habitat/serviette-verte.avif', (SELECT id FROM PRODUIT WHERE reference = '3216983'), 2, 'Serviette verte'),
    ('habitat/serviette-cuivre.avif', (SELECT id FROM PRODUIT WHERE reference = '3216983'), 3, 'Serviette cuivre'),
    ('habitat/serviette-noire-longueur.avif', (SELECT id FROM PRODUIT WHERE reference = '3216983'), 4, 'Serviette noire dépliée'),
    ('habitat/serviette-cuivre-zoom.avif', (SELECT id FROM PRODUIT WHERE reference = '3216983'), 5, 'Détail de la serviette cuivre'),
    ('habitat/serviette-invite-noire.avif', (SELECT id FROM PRODUIT WHERE reference = '3216958'), 1, 'Serviette d''invité noire'),
    ('habitat/serviette-invite-orange.avif', (SELECT id FROM PRODUIT WHERE reference = '3216958'), 2, 'Serviette d''invité orange'),
    ('habitat/serviette-invite-verte.avif', (SELECT id FROM PRODUIT WHERE reference = '3216958'), 3, 'Serviette d''invité verte'),
    ('habitat/serviette-invite-noire-zoom.avif', (SELECT id FROM PRODUIT WHERE reference = '3216958'), 4, 'Détail de la serviette d''invité noire'),
    ('habitat/serviette-invite-orange-zoom.avif', (SELECT id FROM PRODUIT WHERE reference = '3216958'), 5, 'Détail de la serviette d''invité orange'),
    ('habitat/serviette-invite-verte-zoom.avif', (SELECT id FROM PRODUIT WHERE reference = '3216958'), 6, 'Détail de la serviette d''invité verte'),
    ('habitat/serviette-invite-verte-longueur.avif', (SELECT id FROM PRODUIT WHERE reference = '3216958'), 7, 'Serviette d''invité verte dépliée'),
    ('habitat/taies-oreiller-hotel-royal-blanc.avif', (SELECT id FROM PRODUIT WHERE reference = '3206228'), 1, 'Taie d''oreiller Hotel Royal blanche'),
    ('habitat/taies-oreiller-hotel-royal-bleu.avif', (SELECT id FROM PRODUIT WHERE reference = '3206228'), 2, 'Taie d''oreiller Hotel Royal bleue'),
    ('habitat/taies-oreiller-hotel-royal-rose.avif', (SELECT id FROM PRODUIT WHERE reference = '3206228'), 3, 'Taie d''oreiller Hotel Royal rose'),
    ('habitat/taies-oreiller-hotel-royal-bleu-seul.avif', (SELECT id FROM PRODUIT WHERE reference = '3206228'), 4, 'Taie Hotel Royal bleue seule'),
    ('habitat/taies-oreiller-hotel-royal-bleu-zoom.avif', (SELECT id FROM PRODUIT WHERE reference = '3206228'), 5, 'Détail de la taie Hotel Royal bleue'),
    ('habitat/taies-oreiller-hotel-royal-rose-boite.avif', (SELECT id FROM PRODUIT WHERE reference = '3206228'), 6, 'Emballage de la taie Hotel Royal rose'),
    ('habitat/oreiller-mousse-memoire-forme.avif', (SELECT id FROM PRODUIT WHERE reference = '3205523'), 1, 'Oreiller en mousse à mémoire de forme'),
    ('habitat/oreiller-mousse-memoire-forme-dessus.avif', (SELECT id FROM PRODUIT WHERE reference = '3205523'), 2, 'Oreiller vu de dessus'),
    ('habitat/oreiller-mousse-memoire-forme-sachet.avif', (SELECT id FROM PRODUIT WHERE reference = '3205523'), 3, 'Oreiller dans son sachet'),
    ('hobby/crayons-aquarelle-van-bleiswijck.avif', (SELECT id FROM PRODUIT WHERE reference = '3224274'), 1, 'Crayons aquarelle Van Bleiswijck'),
    ('hobby/crayons-aquarelle-van-bleiswijck-complet.avif', (SELECT id FROM PRODUIT WHERE reference = '3224274'), 2, 'Set complet de crayons aquarelle'),
    ('hobby/crayons-aquarelle-van-bleiswijck-boite.avif', (SELECT id FROM PRODUIT WHERE reference = '3224274'), 3, 'Boîte de crayons aquarelle'),
    ('hobby/pinceaux-van-bleiswijck-boite.avif', (SELECT id FROM PRODUIT WHERE reference = '3223718'), 1, 'Pinceaux Van Bleiswijck'),
    ('hobby/pinceaux-van-bleiswijck-fins.avif', (SELECT id FROM PRODUIT WHERE reference = '3223718'), 2, 'Pinceaux fins'),
    ('hobby/pinceaux-van-bleiswijck-larges.avif', (SELECT id FROM PRODUIT WHERE reference = '3223718'), 3, 'Pinceaux larges'),
    ('hobby/peinture-acrylique-van-bleiswijck.avif', (SELECT id FROM PRODUIT WHERE reference = '3214279'), 1, 'Peinture acrylique Van Bleiswijck'),
    ('hobby/peinture-acrylique-van-bleiswijck-boite.avif', (SELECT id FROM PRODUIT WHERE reference = '3214279'), 2, 'Boîte de peinture acrylique'),
    ('hobby/toile-peindre-van-bleiswijck.avif', (SELECT id FROM PRODUIT WHERE reference = '2545912'), 1, 'Toile à peindre Van Bleiswijck'),
    ('hobby/paillettes-sac.avif', (SELECT id FROM PRODUIT WHERE reference = '3227238'), 1, 'Paillettes'),
    ('hobby/paillettes-blanc-a-rose.avif', (SELECT id FROM PRODUIT WHERE reference = '3227238'), 2, 'Paillettes du blanc au rose'),
    ('hobby/paillettes-fushia-a-bleu.avif', (SELECT id FROM PRODUIT WHERE reference = '3227238'), 3, 'Paillettes du fuchsia au bleu'),
    ('hobby/paillettes-rose-a-orange.avif', (SELECT id FROM PRODUIT WHERE reference = '3227238'), 4, 'Paillettes du rose à l''orange'),
    ('bricolage/boite-outils-keter.avif', (SELECT id FROM PRODUIT WHERE reference = '3227914'), 1, 'Boîte à outils Keter'),
    ('bricolage/boite-outils-keter-seul.avif', (SELECT id FROM PRODUIT WHERE reference = '3227914'), 2, 'Boîte à outils Keter seule'),
    ('bricolage/boite-outils-keter-ouvert.avif', (SELECT id FROM PRODUIT WHERE reference = '3227914'), 3, 'Boîte à outils Keter ouverte'),
    ('bricolage/boite-outils-keter-fermer.avif', (SELECT id FROM PRODUIT WHERE reference = '3227914'), 4, 'Boîte à outils Keter fermée'),
    ('bricolage/lampe-travail-trepier-werckmann.avif', (SELECT id FROM PRODUIT WHERE reference = '3221537'), 1, 'Lampe de travail Werckmann'),
    ('bricolage/lampe-travail-trepier-werckmann-allumee.avif', (SELECT id FROM PRODUIT WHERE reference = '3221537'), 2, 'Lampe de travail Werckmann allumée'),
    ('bricolage/lampe-travail-trepier-werckmann-boite.avif', (SELECT id FROM PRODUIT WHERE reference = '3221537'), 3, 'Boîte de la lampe Werckmann');