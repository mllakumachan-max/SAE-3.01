-- Migration : ajout des options de personnalisation de produit (US OPT-c)
--
-- Tables :
--   OPTION         : une option de personnalisation rattachée à un produit
--   OPTION_VALEUR  : une valeur possible d'une option, avec supplément de prix

CREATE TABLE OPTION_PRODUIT (
    id          SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    produit_id  SMALLINT UNSIGNED NOT NULL,
    nom         VARCHAR(80)       NOT NULL,
    ordre       TINYINT UNSIGNED  NOT NULL DEFAULT 1,

    PRIMARY KEY (id),
    KEY idx_option_produit (produit_id),

    CONSTRAINT fk_option_produit
        FOREIGN KEY (produit_id) REFERENCES PRODUIT (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE OPTION_VALEUR (
    id              SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    option_id       SMALLINT UNSIGNED NOT NULL,
    valeur          VARCHAR(80)       NOT NULL,
    prix_supplement DECIMAL(6,2)      NOT NULL DEFAULT 0.00,
    ordre           TINYINT UNSIGNED  NOT NULL DEFAULT 1,

    PRIMARY KEY (id),
    KEY idx_option_valeur_option (option_id),

    CONSTRAINT fk_option_valeur_option
        FOREIGN KEY (option_id) REFERENCES OPTION_PRODUIT (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
