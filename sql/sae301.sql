-- ---------------------------------------------------------------------------
-- SAE 3.01 — Click & collect Action
--
-- Données relevées sur https://www.action.com/fr-fr/.
-- ---------------------------------------------------------------------------

SET NAMES utf8mb4;

DROP TABLE IF EXISTS produit;
DROP TABLE IF EXISTS categorie;
DROP TABLE IF EXISTS galerie;

-- ---------------------------------------------------------------------------
-- Catégories
-- ---------------------------------------------------------------------------
CREATE TABLE categorie (
    id          TINYINT UNSIGNED    NOT NULL AUTO_INCREMENT,
    libelle     VARCHAR(100)        NOT NULL,
    slug        VARCHAR(100)        NOT NULL,
    parent_id   TINYINT UNSIGNED    NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_categorie_slug (slug),
    KEY idx_categorie_parent (parent_id),

    CONSTRAINT fk_categorie_parent
        FOREIGN KEY (parent_id) REFERENCES categorie (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Produits
-- ---------------------------------------------------------------------------
CREATE TABLE produit (
    id                  SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    reference           VARCHAR(20)       NOT NULL,
    nom                 VARCHAR(160)      NOT NULL,
    marque              VARCHAR(80)       NULL,
    format              VARCHAR(120)      NULL,
    prix                DECIMAL(6,2)      NOT NULL,
    prix_unitaire       DECIMAL(8,2)      NULL,
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
        FOREIGN KEY (categorie_id) REFERENCES categorie (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_produit_sous_categorie_id
        FOREIGN KEY (sous_categorie_id) REFERENCES categorie (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Galeries
-- ---------------------------------------------------------------------------
CREATE TABLE galerie (
    id                  SMALLINT UNSIGNED   NOT NULL AUTO_INCREMENT,
    chemin              VARCHAR(40)         NOT NULL,
    produit_id          SMALLINT UNSIGNED   NOT NULL,
    ordre               TINYINT UNSIGNED    NOT NULL DEFAULT 1,
    texte_alternatif    VARCHAR(160)        NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_galerie_chemin (chemin),
    KEY idx_galerie_produit (produit_id),

    CONSTRAINT fk_galerie_produit
        FOREIGN KEY (produit_id) REFERENCES produit (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Catégories
-- ---------------------------------------------------------------------------
INSERT INTO categorie (libelle, slug, parent_id) VALUES
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
INSERT INTO produit
    (reference,
    nom,
    marque,
    format,
    prix,
    prix_unitaire,
    unite_prix,
    badge,
    sous_categorie_id,
    categorie_id)
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
-- INSERT INTO galerie
--     (chemin, produit_id, ordre, texte_alternatif)
-- VALUES
    