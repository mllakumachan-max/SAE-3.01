-- ---------------------------------------------------------------------------
-- SAE 3.01 — Click & collect Action
--
-- Données relevées sur https://www.action.com/fr-fr/.
-- ---------------------------------------------------------------------------

SET NAMES utf8mb4;

DROP TABLE IF EXISTS UTILISATEUR;
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
    description VARCHAR(500)        NULL,
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
    slug                VARCHAR(160)      NOT NULL,
    nom                 VARCHAR(160)      NOT NULL,
    marque              VARCHAR(80)       NULL,
    format              VARCHAR(120)      NULL,
    description         TEXT              NULL,
    prix                DECIMAL(6,2)      NOT NULL,
    prix_unitaire       DECIMAL(6,2)      NULL,
    unite_prix          VARCHAR(10)       NULL,
    badge               VARCHAR(40)       NULL,
    stock               SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    seuil_alerte        TINYINT UNSIGNED  NOT NULL DEFAULT 5,
    categorie_id        TINYINT UNSIGNED  NOT NULL,
    sous_categorie_id   TINYINT UNSIGNED  NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_produit_reference (reference),
    UNIQUE KEY uq_produit_slug (slug),
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
-- Utilisateurs
--
-- Les comptes qui se connectent au site. Le rôle « admin » donne accès au
-- back-office, le rôle « user » non. Le mot de passe n'est jamais stocké en
-- clair : seule son empreinte (password_hash) est enregistrée.
-- ---------------------------------------------------------------------------
CREATE TABLE UTILISATEUR (
    id            TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    login         VARCHAR(50)      NOT NULL,
    mot_de_passe  VARCHAR(255)     NOT NULL,
    role          VARCHAR(20)      NOT NULL DEFAULT 'user',
    date_creation TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uq_utilisateur_login (login)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Catégories
-- ---------------------------------------------------------------------------
INSERT INTO CATEGORIE (libelle, slug, parent_id) VALUES
    ('Multimédia',              'multimedia',               NULL),
    ('Habitat',                 'habitat',                  NULL),
    ('Hobby',                   'hobby',                    NULL),
    ('Bricolage',               'bricolage',                NULL),
    ('Plaids et couvertures',   'plaids-et-couvertures',    2),
    ('Décoration',              'decoration',               2),
    ('Salle de bain',           'salle-de-bain',            2),
    ('Oreillers',               'oreillers',                2),
    ('Literie',                 'literie',                  2),
    ('Peindre',                 'peindre',                  3),
    ('Coloriage et dessin',     'coloriage-et-dessin',      3),
    ('Activités manuelles',     'activites-manuelles',      3),
    ('Outils',                  'outils',                   4),
    ('Rangement',               'rangement',                4),
    ('Audio et Son',            'audio-et-son',              1),
    ('Câbles et Connectique',   'cables-et-connectique',     1),
    ('Énergie et Chargeurs',    'energie-et-chargeurs',     1),
    ('Accessoires Informatique','accessoires-informatique',  1);

-- ---------------------------------------------------------------------------
-- Produits
-- ---------------------------------------------------------------------------
INSERT INTO PRODUIT
    (reference, slug, nom, marque, format, description, prix, prix_unitaire, unite_prix, badge, categorie_id, sous_categorie_id)
VALUES
    -- -----------------------------------------------------------------------
    -- MULTIMÉDIA - categorie_id : 1
    -- -----------------------------------------------------------------------
    ('3222863', 'kit-nettoyage-ecrans-lab31', 'Kit de nettoyage multimédia', 'Lab31', '3 pièces', 'Spray, microfibre et brosse pour un entretien optimal des téléphones et écrans.', 1.89, 189.00, '€/l', NULL, 1, 18),
    ('3226353', 'enceinte-bluetooth-fresh-n-rebel', 'Enceinte sans fil', 'Fresh ''n Rebel', '30 watts', 'Autonomie de lecture jusqu''à 25 heures. Support Auracast pour couplage multiple.', 19.95, 19.95, '€/pce', 'Nouveau', 1, 15),
    ('2578240', 'support-ordinateur-mdf', 'Support pour ordinateur portable', 'Lab31', '29 x 39 x 5 cm', 'Structure en MDF avec coussin genoux pour un confort de travail accru à domicile.', 5.99, 5.99, '€/pce', NULL, 1, 18),
    ('3224680', 'cable-donnees-silicone-2m', 'Câble de données en silicone', 'Re-load', '2 m', 'Câble souple anti-nœuds, supporte la charge rapide jusqu''à 60 watts.', 4.95, 2.48, '€/m', NULL, 1, 16),
    ('3226469', 'cable-hdmi-4k-sitecom', 'Câble HDMI 4K', 'Sitecom', '2 m', 'Transmission fluide pour flux 4K UHD. Idéal pour consoles de jeux et home cinéma.', 2.99, 1.50, '€/m', NULL, 1, 16),
    ('3225765', 'boitier-synchro-led-tv', 'Boîtier de synchronisation HDMI', 'LSC Smart', 'Ruban LED inclus', 'Synchronisation dynamique des couleurs de la TV avec le ruban LED RGBIC.', 34.95, 34.95, '€/pce', 'Nouveau', 1, 16),
    ('3201718', 'trepied-smartphone-photo', 'Trépied télescopique', 'Lab31', '60 - 170 cm', 'Conception robuste avec niveau à bulle et tête rotative à 360 degrés.', 14.95, 14.95, '€/pce', NULL, 1, 18),
    ('3010167', 'stylet-tactile-actif', 'Stylet universel', 'Lab31', 'Rechargeable', 'Stylet de précision avec 16 heures d''autonomie. Idéal pour les tablettes graphiques.', 9.95, 9.95, '€/pce', NULL, 1, 18),
    ('3222375', 'support-voiture-grille', 'Support de téléphone pour voiture', 'Lab31', 'Pivote à 360°', 'Fixation stable sur grille d''aération. Permet une navigation sécurisée en conduite.', 4.99, 4.99, '€/pce', NULL, 1, 18),
    ('3204292', 'powerbank-5000mah', 'Batterie externe 5000 mAh', 'Re-load', '12 watts', 'Format de poche ultra léger. Indicateur LED et câble USB-C fourni.', 6.27, 6.27, '€/pce', NULL, 1, 17),
    ('3220416', 'chargeur-magsafe-sans-fil', 'Chargeur magnétique sans fil', 'Sitecom', '15 watts', 'Chargeur Qi2 compatible avec la technologie MagSafe pour une fixation optimale.', 8.95, 8.95, '€/pce', NULL, 1, 17),
    ('3209503', 'reveil-chargeur-induction', 'Réveil avec chargeur sans fil', 'Re-load', '15 watts', 'Écran LED dimmable. Socle de charge intégré pour un chevet sans câbles.', 9.99, 9.99, '€/pce', 'Nouveau', 1, 17),
    ('3222943', 'cable-charge-multi-3en1', 'Câble de charge 3-en-1', 'Re-load', '1.5 m', 'Connexions micro-USB, USB-C et Lightning. Gaine tressée en nylon ultra-résistant.', 6.97, 4.65, '€/m', NULL, 1, 16),
    ('3222798', 'batterie-haute-capacite-20000', 'Batterie externe 20000 mAh', 'Sitecom', '30 watts', 'Haute capacité permettant jusqu''à 4 recharges complètes d''un smartphone.', 18.95, 18.95, '€/pce', NULL, 1, 17),
    ('3215660', 'cable-enrouleur-100w', 'Câble de charge rétractable', 'Sologic', '100 watts', 'Système d''enrouleur compact. Charge rapide compatible avec les ordinateurs portables.', 4.99, 4.99, '€/pce', NULL, 1, 16),
    ('3218302', 'station-charge-rgb', 'Station de charge sans fil', 'Battletron', '15 watts', 'Design gaming avec éclairage RVB paramétrable. Base antidérapante.', 5.98, 5.98, '€/pce', NULL, 1, 17),
    ('3223498', 'pack-cables-usb-c', 'Lot de câbles Sologic', 'Sologic', '3 pièces', 'Différentes longueurs pour s''adapter à tous les besoins (bureau, lit, voiture).', 3.99, 3.99, '€/pce', NULL, 1, 16),
    ('3226354', 'enceinte-boombox-xl', 'Enceinte Boombox XL', 'Fresh ''n Rebel', '24 watts', 'Basses profondes et clarté exceptionnelle. Résiste aux éclaboussures.', 19.95, 19.95, '€/pce', NULL, 1, 15),
    ('3226355', 'barre-son-tv-40w', 'Barre de son TV', 'Fresh ''n Rebel', '40 watts', 'Améliorez l''expérience audio de votre téléviseur avec ce système stéréo Bluetooth.', 24.95, 24.95, '€/pce', 'Action', 1, 15),
    ('3226356', 'ecouteurs-anc-tws', 'Écouteurs sans fil ANC', 'Philips', 'Intra-auriculaires', 'Réduction de bruit active. Boîtier compact offrant plusieurs cycles de recharge.', 19.95, 19.95, '€/pce', NULL, 1, 15),
    ('3226358', 'chargeur-allume-cigare-75w', 'Chargeur de voiture 5 ports', 'Re-load', '75 watts', 'Recharge simultanée de multiples appareils pendant les longs trajets en famille.', 9.95, 9.95, '€/pce', NULL, 1, 17),
    ('3226359', 'repeteur-wifi-750', 'Amplificateur Wi-Fi', 'TP-link', '750 Mbit/s', 'Étend la couverture réseau pour éliminer les zones mortes dans la maison.', 19.95, 19.95, '€/pce', NULL, 1, 18),
    ('3226361', 'tracker-bluetooth-cles', 'Balise Smartfinder', 'Fresh ''n Rebel', 'Bluetooth', 'Localisez facilement vos objets perdus via l''application dédiée Apple ou Android.', 6.95, 6.95, '€/pce', NULL, 1, 18),

    ----------------------------------------------------------------------
    -- HABITAT - categorie_id : 2
    -- -----------------------------------------------------------------------
    ('3225113', 'rideau-alexia-velours', 'Rideau Alexia', 'Studio Home', '140 x 260 cm', 'Rideau en velours épais avec 8 œillets métalliques. Tombé élégant.', 9.95, 2.73, '€/m²', NULL, 2, 6),
    ('3217153', 'rideau-occultant-romee-noir', 'Rideau occultant Romee', 'Studio Home', '140 x 260 cm', 'Blocage total de la lumière. Idéal pour les chambres à coucher.', 13.95, 13.95, '€/pce', NULL, 2, 6),
    ('3225086', 'rideau-thermique-julles', 'Rideau occultant Julles', 'Julles', '140 x 260 cm', 'Isolation thermique et phonique. Préserve la chaleur de la pièce en hiver.', 12.95, 12.95, '€/pce', NULL, 2, 6),
    ('3016600', 'plaid-xxl-polaire', 'Plaid XXL', 'Studio Home', '300 x 280 cm', 'Format géant pour canapé d''angle. Matière polaire très douce.', 17.95, 2.14, '€/m²', 'Action', 2, 5),
    ('3223961', 'plaid-voyage-sac', 'Plaid avec sac', 'Studio Home', '150 x 200 cm', 'Livré avec son sac de transport. Parfait pour les pique-niques ou le camping.', 19.95, 6.65, '€/m²', NULL, 2, 5),
    ('3222146', 'parure-lit-satin-coton', 'Parure de lit en satin', 'Hotel Royal', '140 x 220 cm', 'Tissage serré offrant un aspect soyeux. Housse de couette et taie d''oreiller.', 17.95, 5.83, '€/m²', NULL, 2, 9),
    ('2577286', 'drap-housse-extensible', 'Drap-housse en jersey', 'Hotel Royal', '180 x 220 cm', 'Extensibilité maximale pour matelas épais. Élastique périphérique renforcé.', 7.99, 7.99, '€/pce', 'Action', 2, 9),
    ('2568510', 'oreiller-ergonomique-premium', 'Oreiller premium', 'Hotel Royal', '60 x 60 cm', 'Soutien ferme. Remplissage en fibres creuses de polyester recyclé.', 11.95, 33.19, '€/m²', NULL, 2, 8),
    ('3223962', 'plaid-fausse-fourrure', 'Plaid Chenille', 'Studio Home', '140 x 180 cm', 'Double face : aspect chenille texturé et doublure en fausse fourrure.', 12.95, 5.14, '€/m²', NULL, 2, 5),
    ('2563819', 'plaid-ecologique', 'Plaid Studio Home', 'Studio Home', '150 x 200 cm', 'Production écoresponsable 100% recyclée. Grammage épais.', 7.95, 2.65, '€/m²', NULL, 2, 5),
    ('3225087', 'tapis-salon-isla', 'Tapis Isla', 'Studio Home', '115 x 175 cm', 'Poils ras faciles à aspirer. Motifs géométriques contemporains.', 17.95, 17.95, '€/pce', NULL, 2, 6),
    ('3225088', 'panier-rangement-design', 'Panier de rangement en feutre', 'Studio Home', '31 x 23 x 15 cm', 'Corbeille souple et structurée pour le linge ou les magazines.', 3.99, 3.99, '€/pce', NULL, 2, 6),
    ('3225089', 'pouf-coffre-xl', 'Pouf de rangement XL', 'Studio Home', '76 x 37,5 x 36 cm', 'Banc d''appoint capitonné dissimulant un vaste espace de stockage.', 12.95, 12.95, '€/pce', NULL, 2, 6),
    ('3225090', 'bout-de-canape-metal', 'Table d''appoint', 'Studio Home', '48 x 30 x 62 cm', 'Pied en métal noir asymétrique permettant de la glisser sous le canapé.', 7.95, 7.95, '€/pce', 'Action', 2, 6),
    ('3225091', 'miroir-mural-sans-percer', 'Miroir de porte', 'Studio Home', '34 x 94 cm', 'Pattes de fixation pour l''accrocher directement sur le rebord supérieur d''une porte.', 6.95, 6.95, '€/pce', NULL, 2, 6),
    ('3225092', 'etagere-flottante-bois', 'Étagère murale', 'Studio Home', '57 x 16 x 16 cm', 'Design minimaliste avec système de fixation invisible inclus.', 3.98, 3.98, '€/pce', NULL, 2, 6),
    ('3225093', 'set-bougies-artificielles', 'Lot de bougies LED', 'Candra', '9 pièces', 'Revêtement en véritable cire avec flamme LED vacillante. Zéro risque d''incendie.', 7.95, 7.95, '€/pce', 'Action', 2, 6),
    ('3225094', 'tapis-salle-de-bain-absorbant', 'Tapis de bain', 'Studio Home', '50 x 80 cm', 'Microfibres épaisses à séchage rapide. Dessous latex antidérapant.', 6.95, 17.38, '€/m²', 'Action', 2, 7),
    ('3224852', 'couette-sans-housse-easy', 'Couette sans housse Easy', NULL, '140 x 200 cm | Diverses couleurs', 'Couette sans housse au toucher doux, disponible en plusieurs couleurs. Son remplissage léger assure un confort suffisant toute l’année, sans l’encombrement d’une couette doublée. Livrée sans housse, elle se lave facilement en machine.', 9.95, 3.55, '€/m²', 'Semaine d''Action', 2, 9),
    ('3218318', 'boule-lumineuse', 'Boule lumineuse', NULL, 'Ø 18 cm | 140 LED', 'Boule lumineuse de 18 cm de diamètre, équipée de 140 LED. Son variateur de couleurs crée une ambiance aussi bien scandinave que modernes, et sa faible consommation permet de la laisser allumée longtemps. Fonctionne sur piles.', 3.99, 3.99, '€/pce', 'Semaine d''Action', 2, 6),
    ('3221823', 'rideau-velours', 'Rideau velours', NULL, '135 x 260 cm | Diverses couleurs', 'Rideau en velours de 135 x 260 cm, au tombé ample qui masque la lumière et isole du froid. Il est vendu à la pièce, dans plusieurs couleurs. Sa matière épaisse se ride facilement et garde son pli toute la journée.', 2.95, 1.98, '€/m²', 'Nouveau', 2, 6),
    ('3216983', 'serviette', 'Serviette', NULL, '50 x 100 cm | Diverses couleurs', 'Serviette de toilette de 50 x 100 cm, en coton gratté doux et absorbent. Disponible en plusieurs couleurs pour s’accorder à votre salle de bain. Le tissage dense conserve ses couleurs lavage après lavage.', 2.49, 4.98, '€/m²', 'Semaine d''Action', 2, 7),
    ('3216958', 'serviette-d-invite', 'Serviette d''invité', NULL, '30 x 50 cm | Diverses couleurs', 'Petite serviette d’invité de 30 x 50 cm, idéale pour les mains des visiteurs ou pour les barbecues. Sa taille compacte se range facilement dans un placard et se transporte sans encombre.', 1.29, 8.60, '€/m²', 'Semaine d''Action', 2, 7),
    ('3206228', 'taies-d-oreiller-hotel-royal', 'Taies d''oreiller Hotel Royal', 'Hotel Royal', '2 pièces | 63 x 63 cm', 'Lot de 2 taies d’oreiller 63 x 63 cm, en coton à l’esprit hôtelier. Leur crispage soigné tient la forme même après de nombreux lavages. Vendues par paire, à associer à une parure de votre choix.', 5.49, 2.75, '€/pce', NULL, 2, 8),
    ('3205523', 'oreiller-double-face-mousse-a-memoire-de-forme', 'Oreiller double face en mousse à mémoire de forme', 'Hotel Royal', '57 x 38 x 11 cm', 'Oreiller de 57 x 38 x 11 cm, en mousse à mémoire de forme, recto et verso. La mousse épouse la forme de la nuque et de la tête pour un soutien régulier. Sa hauteur de 11 cm convient aussi bien aux dormeurs sur le dos qu’à ceux qui dorment sur le côté.', 15.29, NULL, NULL, NULL, 2, 8),

    -- -----------------------------------------------------------------------
    -- HOBBY - categorie_id : 3
    -- -----------------------------------------------------------------------
    ('3202114', 'set-crochets-ergonomiques', 'Crochets DécoTime', 'DécoTime', '6 pièces', 'Manches antidérapants pour réduire la fatigue lors des longues sessions de crochet.', 1.99, 0.33, '€/pce', NULL, 3, 12),
    ('3202115', 'laine-cardee-tricot', 'Laine cardée', 'Alison & Mae', '200 g', 'Gros fil souple idéal pour la création de plaids ou d''écharpes volumineuses.', 2.98, 0.04, '€/m', NULL, 3, 12),
    ('3202116', 'carnet-aquarelle-grain', 'Bloc d''aquarelle', 'Van Bleiswijck', '25 feuilles', 'Papier grain fin 300g/m² résistant au gondolement.', 1.99, 1.99, '€/pce', NULL, 3, 11),
    ('3007321', 'diorama-maison-bois', 'Maison miniature DIY', 'Crafts & Co', 'Bois FSC', 'Maquette détaillée nécessitant patience et minutie. Illumination par LED.', 9.99, 9.99, '€/pce', NULL, 3, 12),
    ('3007322', 'kit-maquette-boutique', 'Kit créatif magasin', 'DécoTime', 'Carton et Papier', 'Créez un décor vitrine miniature en superposant les découpes de papier.', 3.99, 3.99, '€/pce', NULL, 3, 12),
    ('3007323', 'puzzle-3d-fleurs-bois', 'Puzzle 3D fleurs', 'Crafts & Co', 'Bois', 'Assemblage mécanique par emboîtement sans point de colle.', 1.79, 1.79, '€/pce', NULL, 3, 12),
    ('3224297', 'mallette-artiste-complete', 'Kit de coloriage et croquis', 'Van Bleiswijck', '92 pièces', 'Le coffret ultime pour le dessinateur : crayons, fusains, gommes mie de pain.', 6.95, 6.95, '€/pce', 'Durable', 3, 11),
    ('3224289', 'feutres-alcool-double', 'Marqueurs doubles', 'Van Bleiswijck', '24 pièces', 'Encre à base d''alcool pour des dégradés subtils sans traces de passage.', 4.99, 4.99, '€/pce', NULL, 3, 11),
    ('3224292', 'feutres-aquarellables-pro', 'Marqueurs aquarelle', 'Van Bleiswijck', '60 pièces', 'Pointe pinceau souple et pointe fine rigide. Pigments intenses solubles à l''eau.', 5.95, 5.95, '€/pce', 'Action', 3, 11),
    ('3216447', 'toile-vierge-40x50', 'Toile pour peinture', 'Van Bleiswijck', '40 x 50 cm', 'Clés de tension fournies. Surface prête à l''emploi pour l''huile et l''acrylique.', 2.29, 11.45, '€/m²', NULL, 3, 10),
    ('3216448', 'peinture-acrylique-or', 'Peinture métallisée', 'Van Bleiswijck', '250 ml', 'Pigments iridescents offrant une brillance métallique captivante.', 2.69, 10.76, '€/l', NULL, 3, 10),
    ('3216449', 'chevalet-table-tiroir', 'Chevalet avec rangement', 'Van Bleiswijck', 'Bois de hêtre', 'Station d''artiste portable. Se replie comme une valisette de transport.', 7.95, 7.95, '€/pce', 'Nouveau', 3, 10),
    ('3216450', 'appret-gesso-blanc', 'Sous-couche Gesso', 'Van Bleiswijck', '500 ml', 'Prépare vos supports bruts (carton, bois) en créant une couche d''accroche poreuse.', 3.29, 6.58, '€/l', NULL, 3, 10),
    ('3216451', 'vernis-finition-tableaux', 'Vernis acrylique', 'Van Bleiswijck', '80 ml', 'Finition brillante, protège les œuvres contre le jaunissement et les rayures.', 1.59, 19.88, '€/l', NULL, 3, 10),
    ('3216452', 'mannequin-dessin-articule', 'Mannequin articulé', 'Van Bleiswijck', '30 cm', 'Fixation sur socle métallique. Modèle anatomique simplifié pour les bases du dessin.', 2.99, 2.99, '€/pce', NULL, 3, 11),
    ('3216453', 'fil-macrame-bijoux', 'Cordon à bijoux', 'DécoTime', '100 m', 'Bobine de fil de coton ciré pour la fabrication de macramé et bracelets.', 0.99, 0.01, '€/m', NULL, 3, 12),
    ('3216454', 'sceau-cire-lettres', 'Kit tampons de cire', 'DécoTime', 'Manche en bois', 'Pastilles de cire à fondre à la cuillère. Motif floral classique pour le sceau.', 3.59, 3.59, '€/pce', NULL, 3, 12),
    ('3216455', 'peluche-personnalisable-diy', 'Peluche Airbrush', 'Crafts & Co', 'Lavable', 'Vaporisez les couleurs avec l''aérographe électrique inclus. Recommencez après lavage.', 5.79, 5.79, '€/pce', NULL, 3, 12),
    ('3216456', 'pistolet-colle-chaude', 'Pistolet à colle sans fil', 'Crafts & Co', 'Rechargeable', 'Outil précis pour le scrapbooking, évite l''encombrement du fil électrique.', 7.95, 7.95, '€/pce', NULL, 3, 12),
    ('3216457', 'acrylique-neon-uv', 'Peinture fluorescente', 'Van Bleiswijck', '250 ml', 'Pigments réactifs aux ultraviolets. Aspect mat après séchage.', 1.99, 7.96, '€/l', NULL, 3, 10),
    ('3224274', 'crayons-aquarelle-van-bleiswijck', 'Crayons aquarelle Van Bleiswijck', 'Van Bleiswijck', '72 pièces', 'Coffret de 72 crayons aquarelle Van Bleiswijck, aux couleurs vives et facile à superposer. Ils s’aquarellent à l’eau, se mélangent entre eux et tiennent bien sur le papier. Un coffret complet pour l’école comme pour les loisirs créatifs.', 7.95, 0.11, '€/pce', NULL, 3, 11),
    ('3223718', 'pinceaux-van-bleiswijck', 'Pinceaux Van Bleiswijck', 'Van Bleiswijck', '9 pièces', 'Set de 9 pinceaux Van Bleiswijck de tailles et de formes différentes : pinceaux fins pour les détails, plus larges pour les aplats. Poils souples qui gardent la peinture et la rendent facile à mélanger.', 2.99, 2.99, '€/pce', NULL, 3, 10),
    ('3214279', 'peinture-acrylique-van-bleiswijck', 'Peinture acrylique Van Bleiswijck', 'Van Bleiswijck', '30 x 12 ml', 'Lot de 30 pots de peinture acrylique de 12 ml, aux couleurs opaques qui couvrent en une passe. Sèche rapidement, se mélange facilement et convient aussi bien à la toile qu’au papier, au carton ou au bois.', 3.79, 10.53, '€/l', NULL, 3, 10),
    ('2545912', 'toile-a-peindre-van-bleiswijck', 'Toile à peindre Van Bleiswijck', 'Van Bleiswijck', '29 x 29 cm', 'Toile à peindre de 29 x 29 cm, pré-encrée pour une bonne adhérence de la peinture. Elle s’utilise aussi bien à l’acrylique qu’à l’huile, et se conserve à plat une fois terminée.', 1.49, 1.49, '€/pce', NULL, 3, 10),
    ('3227238', 'paillettes', 'Paillettes', NULL, '6 pièces | Diverses couleurs', 'Six pots de paillettes aux couleurs assorties, pour personnaliser cartes, cadeaux et décorations. Elles s’appliquent à la colle ou au fer, et donnent de l’éclat aux surfaces brillantes.', 0.55, 0.55, '€/pce', 'Nouveau', 3, 12),

    -- -----------------------------------------------------------------------
    -- BRICOLAGE - categorie_id : 4
    -- -----------------------------------------------------------------------
    ('3227914', 'boites-a-outils-keter', 'Boîtes à outils Keter', 'Keter', '2 pièces', 'Lot de 2 boîtes à outils Keter, empilables et munies de poignées. La boîte du dessus se transforme en siège : elle se pose au sol et garde les outils à portée de main pendant un chantier.', 8.99, 4.50, '€/pce', 'Nouveau', 4, 13),
    ('3221537', 'lampe-de-travail-trepied-rechargeable-werckmann', 'Lampe de travail trépied rechargeable Werckmann', 'Werckmann', '1 000 lumens | 77–121 cm', 'Lampe de travail sur trépied, réglable de 77 à 121 cm, délivrant 1 000 lumens. Rechargeable, elle s’utilise loin d’une prise, notamment sur un chantier. Sa tête inclinable dirige le faisceau là où vous en avez besoin.', 15.95, 15.95, '€/pce', 'Nouveau', 4, 13),
    ('3221235', 'lot-charnieres-inox', 'Charnières acier inoxydable', 'Werckmann', '80 x 57 mm', 'Mécanisme fluide. Visserie incluse. Idéal pour la restauration de meubles.', 1.49, 0.75, '€/pce', NULL, 4, 13),
    ('3206937', 'tasseaux-bois-decoratifs', 'Panneaux muraux en bois', 'Werckmann', '60 x 30 cm', 'Revêtement tasseaux sur fond de feutrine noire pour une isolation acoustique.', 14.99, 3.75, '€/pce', 'Durable', 4, 14),
    ('3215200', 'coffret-outillage-complet', 'Boîte à outils 95 pièces', 'Werckmann', 'Plastique renforcé', 'Set d''outils en acier forgé comprenant cliquets, douilles et clés plates.', 39.95, 39.95, '€/pce', NULL, 4, 13),
    ('3005074', 'moches-percage-titane', 'Set de forets', 'Werckmann', '8 pièces', 'Revêtement titane pour une durée de vie prolongée. Forets métaux et bois.', 2.99, 2.99, '€/pce', NULL, 4, 13),
    ('3215273', 'kit-pinces-metre', 'Set outils de bricolage', 'Werckmann', '4 pièces', 'Les basiques indispensables pour démarrer une boîte à outils domestique.', 5.96, 1.49, '€/pce', NULL, 4, 13),
    ('3218577', 'porte-mine-charpentier', 'Crayons de bricolage', 'Werckmann', 'Rechargeable', 'Marqueur de chantier à pointe fine pour tracer dans les trous de perçage profonds.', 2.79, 2.79, '€/pce', NULL, 4, 13),
    ('3015646', 'plateau-roulant-manutention', 'Support roulant', 'Tools', '56 x 29 x 9 cm', 'Planche en bois contreplaqué recouverte de pads abrasifs pour éviter les glissements.', 8.97, 8.97, '€/pce', NULL, 4, 14),
    ('3210379', 'cutter-lames-retractables', 'Couteau de bricolage', 'Werckmann', 'Plioir sécurisé', 'Lame trapézoïdale ultra tranchante. Changement de lame rapide sans outil.', 2.47, 2.47, '€/pce', NULL, 4, 13),
    ('3223744', 'visseuse-sans-fil-20v', 'Perceuse sans fil', 'FERM', '20 volts', 'Couple de serrage 50 Nm réglable. Éclairage LED intégré pour le travail en zone sombre.', 34.95, 34.95, '€/pce', NULL, 4, 13),
    ('3223745', 'set-cles-cliquet-articulees', 'Clés à cliquet', 'FERM', '11 pièces', 'Têtes articulées à 180° pour accéder aux écrous difficiles. Acier chrome-vanadium.', 19.95, 19.95, '€/pce', NULL, 4, 13),
    ('3223746', 'disqueuse-filaire-1300w', 'Meuleuse d''angle', 'Varo', '1 300 W', 'Carter de protection orientable. Bouton de blocage de broche pour changement de disque.', 24.95, 24.95, '€/pce', NULL, 4, 13),
    ('3221138', 'pince-universelle-isolee', 'Pince universelle', 'Werckmann', 'Gainage ergonomique', 'Mâchoires crantées et zone de coupe pour fils rigides. Indispensable au quotidien.', 2.79, 2.79, '€/pce', NULL, 4, 13),
    ('3221139', 'reglet-metallique-60', 'Règle de marquage', 'Werckmann', '60 cm', 'Bords rectifiés permettant son utilisation comme guide de coupe au cutter.', 3.49, 3.49, '€/pce', 'Nouveau', 4, 13),
    ('3221140', 'marteau-menuisier-fibre', 'Marteau multifonctions', 'Werckmann', 'Arrache-clou', 'Tête forgée indémanchable. Manche en fibre de verre réduisant les vibrations.', 4.99, 4.99, '€/pce', NULL, 4, 13),
    ('3221141', 'cle-anglaise-ouverture', 'Clé à molette', 'Werckmann', '14-30 mm', 'Graduation laser sur la mâchoire pour un préréglage rapide avant serrage.', 2.96, 2.96, '€/pce', NULL, 4, 13),
    ('3221142', 'pince-multiprise-cremaillere', 'Pince-étau pompe à eau', 'Werckmann', '245 mm', 'Ajustement rapide par bouton poussoir. Dents asymétriques pour une prise mordante.', 3.57, 3.57, '€/pce', NULL, 4, 13),
    ('3221143', 'lunettes-chantier-polycarbonate', 'Lunettes de protection', 'Werckmann', 'Légères', 'Protection latérale intégrée. Verres clairs résistants aux impacts de particules.', 3.49, 3.49, '€/pce', NULL, 4, 13),
    ('3221144', 'jeu-ciseaux-sculpteur', 'Ciseaux à bois', 'Werckmann', '3 pièces', 'Manche renforcé pouvant être frappé au maillet sans risque de fissure.', 3.96, 1.32, '€/pce', NULL, 4, 13),
    ('3221145', 'cartouche-mastic-salledebain', 'Mastic silicone', 'Pattex', '280 ml', 'Formule fongicide longue durée. Élasticité permanente après séchage complet.', 3.99, 14.25, '€/l', NULL, 4, 13),
    ('3221146', 'tournevis-micro-reparations', 'Tournevis de précision', 'Werckmann', 'Magnétique', 'Idéal pour le démontage de boîtiers électroniques ou le réglage de branches de lunettes.', 1.99, 1.99, '€/pce', NULL, 4, 13),
    ('3221147', 'treteaux-pliables-acier', 'Chevalet de sciage', 'Werckmann', 'Pliable', 'Pieds écartés pour une stabilité optimale lors du tronçonnage de pièces de bois.', 19.99, 19.99, '€/pce', NULL, 4, 13),
    ('3221613', 'boite-de-rangement-werckmann', 'Boîte de rangement Werckmann', 'Werckmann', '28 x 19,5 x 21,5 cm', 'Gardez toutes vos petites pièces bien rangées avec ce kit de rangement pratique avec 4 compartiments à séparateurs amovibles et couvercles transparents. Idéal pour les vis, les chevilles et autres matériaux de bricolage.', 9.99, 9.99, '€/pce', 'Nouveau', 4, 14),
    ('3218562', 'boite-de-forets-et-d-embouts-werckmann', 'Boîte de forets et d''embouts Werckmann', 'Werckmann', '29 pièces', 'Compacte et complète : cliquet, tournevis à double poignée en T, adaptateur, support magnétique, 9 douilles et 25 embouts, en Cr-V. Livrée dans une boîte de rangement pratique.', 5.99, 5.99, '€/pce', NULL, 4, 13);

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

-- ---------------------------------------------------------------------------

-- Utilisateurs
--
-- Les comptes de test. Le rôle « admin » donne accès au back-office, le rôle
-- « user » non. Les empreintes de mot de passe ont été produites par
-- password_hash() : le mot de passe n'apparaît nulle part dans la base.
-- ---------------------------------------------------------------------------
INSERT INTO UTILISATEUR (login, mot_de_passe, role) VALUES
    ('alice', '$2y$10$DWjlcXdX/DXT2Jw5dX73pOnAB56ENsqjernxfhywIO4OzIvO3SW.a', 'user'),
    ('admin', '$2y$10$2EoUHRC0LodtjyGhAVwCMOC2oxkqInQoxrH73a/KvOFrQfg6KDTTu', 'admin');