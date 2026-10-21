-- ---------------------------------------------------------------------------
-- Migration — 2026-10-21 — GOF-b : table des comptes utilisateurs
--
-- Objectif : satisfaire la Définition de Done de GOF-b, « compte administrateur
-- de test en base de données ».
--
-- Les comptes étaient écrits en dur dans le contrôleur d'authentification
-- (AuthController). Ils sont maintenant rangés dans la base, comme les
-- produits et les catégories : la Définition de Done le demande, et l'API
-- n'a plus de secret écrit dans son code.
--
-- Le mot de passe n'est pas stocké en clair : seule son empreinte
-- (password_hash) est enregistrée, et la comparaison se fait par
-- password_verify.
--
-- Cette migration s'applique à une base déjà peuplée. Pour une installation
-- neuve, importer directement sae301.sql, qui contient déjà cette table.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS UTILISATEUR (
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

-- Les comptes de test. Le rôle « admin » donne accès au back-office ;
-- le rôle « user » n'y donne pas accès.
--
--   admin / motdepasse  ->  role 'admin'
--   alice / azerty      ->  role 'user'
--
-- Les empreintes ci-dessous ont été produites par password_hash() : le mot
-- de passe n'apparaît nulle part dans la base.
INSERT INTO UTILISATEUR (login, mot_de_passe, role)
SELECT 'alice', '$2y$10$DWjlcXdX/DXT2Jw5dX73pOnAB56ENsqjernxfhywIO4OzIvO3SW.a', 'user'
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM UTILISATEUR WHERE login = 'alice');

INSERT INTO UTILISATEUR (login, mot_de_passe, role)
SELECT 'admin', '$2y$10$2EoUHRC0LodtjyGhAVwCMOC2oxkqInQoxrH73a/KvOFrQfg6KDTTu', 'admin'
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM UTILISATEUR WHERE login = 'admin');

-- Contrôle : les deux comptes de test doivent être là, avec le bon rôle.
SELECT login, role FROM UTILISATEUR ORDER BY id;
