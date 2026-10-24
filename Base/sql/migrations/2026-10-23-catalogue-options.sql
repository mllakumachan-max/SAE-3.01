-- Migration : catalogue commun d'options (types et valeurs) et choix par produit
-- Sauvegarder la base avant d'exécuter ce fichier (les anciennes tables sont supprimées).

CREATE TABLE TYPE_OPTION (
    id   SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nom  VARCHAR(80)       NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_type_option_nom (nom)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE VALEUR_OPTION (
    id       SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    type_id  SMALLINT UNSIGNED NOT NULL,
    valeur   VARCHAR(80)       NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_valeur_option (type_id, valeur),

    CONSTRAINT fk_valeur_option_type
        FOREIGN KEY (type_id) REFERENCES TYPE_OPTION (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE PRODUIT_VALEUR (
    produit_id      SMALLINT UNSIGNED NOT NULL,
    valeur_id       SMALLINT UNSIGNED NOT NULL,
    prix_supplement DECIMAL(6,2)      NOT NULL DEFAULT 0.00,

    PRIMARY KEY (produit_id, valeur_id),
    KEY idx_produit_valeur_valeur (valeur_id),

    CONSTRAINT fk_produit_valeur_produit
        FOREIGN KEY (produit_id) REFERENCES PRODUIT (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_produit_valeur_valeur
        FOREIGN KEY (valeur_id) REFERENCES VALEUR_OPTION (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- Reprise des données : les doublons de nom sont fusionnés (collation insensible à la casse)
INSERT IGNORE INTO TYPE_OPTION (nom)
SELECT DISTINCT nom FROM OPTION_PRODUIT;

INSERT IGNORE INTO VALEUR_OPTION (type_id, valeur)
SELECT t.id, ov.valeur
  FROM OPTION_VALEUR ov
  JOIN OPTION_PRODUIT op ON op.id = ov.option_id
  JOIN TYPE_OPTION t ON t.nom = op.nom;

INSERT IGNORE INTO PRODUIT_VALEUR (produit_id, valeur_id, prix_supplement)
SELECT op.produit_id, v.id, ov.prix_supplement
  FROM OPTION_VALEUR ov
  JOIN OPTION_PRODUIT op ON op.id = ov.option_id
  JOIN TYPE_OPTION t ON t.nom = op.nom
  JOIN VALEUR_OPTION v ON v.type_id = t.id AND v.valeur = ov.valeur;

DROP TABLE OPTION_VALEUR;
DROP TABLE OPTION_PRODUIT;
