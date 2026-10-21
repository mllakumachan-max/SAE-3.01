---
name: creer-table-sql
description: Ajoute une table MySQL/MariaDB à sae301.sql (InnoDB, utf8mb4, clés nommées, ordre DROP/CREATE respecté). À utiliser pour une nouvelle entité, une relation entre tables ou des données de test.
---

# Créer une table SQL

Exemple suivi tout au long : une table `ARTICLE` (fictive) rattachée à une `CATEGORIE` existante.

## Étape 1 : Repérer le fichier

Le schéma est dans `sae301.sql`, à la racine du projet. Ne pas créer un second fichier de schéma.

## Étape 2 : Respecter l'ordre du fichier

1. **DROP** en haut, dans l'ordre inverse des dépendances : la table enfant avant son parent.
   ```sql
   DROP TABLE IF EXISTS ARTICLE;
   ```
2. **CREATE** après les tables dont elle dépend. Une clé étrangère ne peut pointer que vers une table déjà créée.
3. **INSERT** de test à la fin, les parents avant les enfants.

## Étape 3 : Écrire la table

Reprendre le modèle des tables existantes :

```sql
-- ---------------------------------------------------------------------------
-- ARTICLE : un article rattaché à une catégorie
-- ---------------------------------------------------------------------------
CREATE TABLE ARTICLE (
    id              SMALLINT UNSIGNED   NOT NULL AUTO_INCREMENT,
    titre           VARCHAR(160)        NOT NULL,
    prix            DECIMAL(6,2)        NOT NULL,
    categorie_id    TINYINT UNSIGNED    NOT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_article_titre (titre),
    KEY idx_article_categorie (categorie_id),

    CONSTRAINT fk_article_categorie
        FOREIGN KEY (categorie_id) REFERENCES CATEGORIE (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
```

## Étape 4 : Appliquer les règles

| Sujet | Règle |
|---|---|
| Nommage | Table au singulier en majuscules. Clé unique `uq_`, index `idx_`, clé étrangère `fk_`. |
| Identifiant | `SMALLINT UNSIGNED` (plus de 255 lignes possibles) ou `TINYINT UNSIGNED` (petite table). |
| Clé étrangère | Même type exact que la clé référencée, sinon MySQL refuse. |
| Prix | `DECIMAL(6,2)`, jamais `FLOAT` ni `DOUBLE`. |
| Texte | `VARCHAR(n)` avec une longueur raisonnable. |
| Vide | `NULL` si la donnée est facultative, `NOT NULL` sinon. |
| Suppression | `ON DELETE RESTRICT`. Ne jamais utiliser `CASCADE` sans accord : il efface des données sans prévenir. |

## Étape 5 : Ajouter des données de test

```sql
INSERT INTO ARTICLE (titre, prix, categorie_id) VALUES
    ('Article exemple 1', 9.90, 1),
    ('Article exemple 2', 14.50, 2);
```

## Étape 6 : Vérifier

- L'ordre DROP / CREATE / INSERT respecte les dépendances.
- Chaque nom de contrainte est unique dans le fichier.
- Le fichier s'exécute sans erreur : `mysql -u <login> -p <base> < sae301.sql`
- `node .agents/skills/verifier-projet/scripts/check-projet.js .`

## Limite

Ce skill ne modifie jamais une table existante qui contient des données. Toute modification de ce type doit être validée par l'utilisateur.