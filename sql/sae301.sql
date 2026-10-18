-- ---------------------------------------------------------------------------
-- SAE 3.01 — Click & collect Action
--
-- Données relevées sur https://www.action.com/fr-fr/.
-- ---------------------------------------------------------------------------

SET NAMES utf8mb4;

DROP TABLE IF EXISTS produit;
DROP TABLE IF EXISTS categorie;

-- ---------------------------------------------------------------------------
-- Catégories
-- ---------------------------------------------------------------------------
CREATE TABLE categorie (
    id      TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    libelle VARCHAR(40)      NOT NULL,
    slug    VARCHAR(40)      NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_categorie_libelle (libelle),
    UNIQUE KEY uq_categorie_slug (slug)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Produits
-- ---------------------------------------------------------------------------
CREATE TABLE produit (
    id                SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    reference_action  VARCHAR(20)       NOT NULL,
    nom               VARCHAR(160)      NOT NULL,
    marque            VARCHAR(80)       NULL,
    format            VARCHAR(120)      NULL,
    prix              DECIMAL(6,2)      NOT NULL,
    prix_unitaire     DECIMAL(8,2)      NULL,
    unite_prix        VARCHAR(10)       NULL,
    badge             VARCHAR(40)       NULL,
    sous_categorie    VARCHAR(80)       NULL,
    image_url         VARCHAR(255)      NULL,
    url_source        VARCHAR(255)      NOT NULL,
    categorie_id      TINYINT UNSIGNED  NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_produit_reference (reference_action),
    KEY idx_produit_nom (nom),
    KEY idx_produit_prix (prix),
    KEY idx_produit_categorie (categorie_id),

    CONSTRAINT fk_produit_categorie
        FOREIGN KEY (categorie_id) REFERENCES categorie (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Catégories
-- ---------------------------------------------------------------------------
INSERT INTO categorie (libelle, slug) VALUES
    ('Multimédia', 'multimedia'),
    ('Habitat',    'habitat'),
    ('Hobby',      'hobby'),
    ('Bricolage',  'bricolage');

-- ---------------------------------------------------------------------------
-- Produits
-- ---------------------------------------------------------------------------
INSERT INTO produit
    (reference_action,
    nom,
    marque,
    format,
    prix,
    prix_unitaire,
    unite_prix,
    badge,
    sous_categorie,
    image_url,
    url_source,
    categorie_id)
VALUES
    -- Habitat
    ('3224852',
    'Couette sans housse Easy',
    NULL,
    '140 x 200 cm | Diverses couleurs',
    9.95,
    3.55,
    '€/m²',
    'Semaine d''Action',
    'Plaids et couvertures',
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/3224852_8718964296057-110_01_tq1nxh.webp',
    'https://www.action.com/fr-fr/p/3224852/couette-sans-housse-easy/',
    2),
    
    ('3218318',
    'Boule lumineuse',
    NULL,
    'Ø 18 cm | 140 LED',
    3.99,
    3.99,
    '€/pce',
    'Semaine d''Action',
    'Décoration saisonnière',
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/3218318_8718964303373-111_01_ycpwfv.webp',
    'https://www.action.com/fr-fr/p/3218318/boule-lumineuse/',
    2),
    
    ('3221823',
    'Rideau velours',
    NULL,
    '135 x 260 cm | Diverses couleurs',
    2.95,
    1.98,
    '€/m²',
    'Nouveau',
    NULL,
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/3221823_8720367973015-111_01_gn2ucm.webp',
    'https://www.action.com/fr-fr/p/3221823/rideau-velours/',
    2),
    
    ('3216983',
    'Serviette',
    NULL,
    '50 x 100 cm | Diverses couleurs',
    2.49,
    4.98,
    '€/m²',
    'Semaine d''Action',
    'Salle de bain',
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/3216983_8718964245147-110_01_dctxch.webp',
    'https://www.action.com/fr-fr/p/3216983/serviette/',
    2),
    
    ('3216958',
    'Serviette d''invité',
    NULL,
    '30 x 50 cm | Diverses couleurs',
    1.29,
    8.60,
    '€/m²',
    'Semaine d''Action',
    'Salle de bain',
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/3216958_8718964245154-110_01_cf9a27.webp',
    'https://www.action.com/fr-fr/p/3216958/serviette-d-invite/',
    2),
    
    ('3206228',
    'Taies d''oreiller Hotel Royal',
    'Hotel Royal',
    '2 pièces | 63 x 63 cm',
    5.49,
    2.75,
    '€/pce',
    NULL,
    'Oreillers',
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/3206228_8717796081213-110_01_t86pmv.webp',
    'https://www.action.com/fr-fr/p/3206228/taies-d-oreiller-hotel-royal/',
    2),
    
    ('3205523',
    'Oreiller double face en mousse à mémoire de forme',
    'Hotel Royal',
    '57 x 38 x 11 cm',
    15.29,
    NULL,
    NULL,
    NULL,
    'Oreillers',
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/35219960.webp',
    'https://www.action.com/fr-fr/p/3205523/oreiller-double-face-en-mousse-a-memoire-de-forme-hotel-royal/',
    2),
    
    -- Hobby
    ('3224274',
    'Crayons aquarelle Van Bleiswijck',
    'Van Bleiswijck',
    '72 pièces',
    7.95,
    0.11,
    '€/pce',
    NULL,
    NULL,
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/3224274_8718964291397-110_02_fvagdl.webp',
    'https://www.action.com/fr-fr/p/3224274/crayons-aquarelle-van-bleiswijck/',
    3),
    
    ('3223718',
    'Pinceaux Van Bleiswijck',
    'Van Bleiswijck',
    '9 pièces',
    2.99,
    2.99,
    '€/pce',
    NULL,
    NULL,
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/3223718_8715427184425-110_01_grrlwh.webp',
    'https://www.action.com/fr-fr/p/3223718/pinceaux-van-bleiswijck/',
    3),
    
    ('3214279',
    'Peinture acrylique Van Bleiswijck',
    'Van Bleiswijck',
    '30 x 12 ml',
    3.79,
    10.53,
    '€/l',
    NULL,
    NULL,
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/3214279_8715427188195-111_01_s3c0xp.webp',
    'https://www.action.com/fr-fr/p/3214279/peinture-acrylique-van-bleiswijck/',
    3),
    
    ('2545912',
    'Toile à peindre Van Bleiswijck',
    'Van Bleiswijck',
    '29 x 29 cm',
    1.49,
    1.49,
    '€/pce',
    NULL,
    NULL,
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/2545912_8715275386903-111_01_p68alh.webp',
    'https://www.action.com/fr-fr/p/2545912/toile-a-peindre-van-bleiswijck/',
    3),
    
    ('3227238',
    'Paillettes',
    NULL,
    '6 pièces | Diverses couleurs',
    0.55,
    0.55,
    '€/pce',
    'Nouveau',
    NULL,
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/3227238_8714333030321-110_01_yf4wdg.webp',
    'https://www.action.com/fr-fr/p/3227238/paillettes/',
    3),
    
    -- Bricolage
    ('3227914',
    'Boîtes à outils Keter',
    'Keter',
    '2 pièces',
    8.99,
    4.50,
    '€/pce',
    'Nouveau',
    NULL,
    'https://asset.action.com/image/upload/t_digital_product_image/w_1920/3227914_3253924887531-110_02_vrteke.webp',
    'https://www.action.com/fr-fr/p/3227914/boites-a-outils-keter/',
    4);