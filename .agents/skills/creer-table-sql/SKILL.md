---
name: creer-table-sql
description: Crée une nouvelle table MySQL dans sql/sae301.sql (InnoDB, utf8mb4, clés primaire/unique/étrangères nommées, ordre de DROP et de CREATE respecté). À utiliser quand on ajoute une table, une colonne liée à une nouvelle entité, une relation entre tables ou un jeu de données de test.
---

# Créer une table SQL

Ce skill décrit comment ajouter une table au schéma du projet Click & Collect.

## 1. Où écrire

Le schéma est dans `sql/sae301.sql`. Ajouter la table à cet endroit, en respectant l'ordre suivant :

1. Ajouter `DROP TABLE IF EXISTS <nom>;` en haut du fichier, **avant** les autres DROP des tables qu'elle référence. Le DROP se fait dans l'ordre inverse des dépendances : une table enfant est supprimée avant son parent.
2. Ajouter le `CREATE TABLE` **après** les tables dont elle dépend (une clé étrangère ne peut pointer que vers une table déjà créée).
3. Ajouter les `INSERT` de données de test à la fin du fichier, après tous les CREATE.

> Note : `AGENTS.md` mentionne `sql/import.sql`. Le fichier réel s'appelle `sql/sae301.sql`. Si le nom change, mettre à jour ce skill et `AGENTS.md`.

## 2. Modèle à suivre

Reprendre exactement la mise en forme des tables existantes (exemple inspiré de `categorie`) :

```sql
-- ---------------------------------------------------------------------------
-- Nom de l'entité (en français, au singulier)
-- ---------------------------------------------------------------------------
CREATE TABLE nom_table (
    id              SMALLINT UNSIGNED   NOT NULL AUTO_INCREMENT,
    libelle         VARCHAR(100)        NOT NULL,
    categorie_id    TINYINT UNSIGNED    NOT NULL,
    description     VARCHAR(255)        NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_nom_table_libelle (libelle),
    KEY idx_nom_table_categorie (categorie_id),

    CONSTRAINT fk_nom_table_categorie
        FOREIGN KEY (categorie_id) REFERENCES categorie (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
```

## 3. Règles de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Table | singulier, minuscules, sans accent | `produit`, `galerie` |
| Clé primaire | `id` | `id` |
| Clé unique | `uq_<table>_<colonne>` | `uq_produit_reference` |
| Index | `idx_<table>_<colonne>` | `idx_produit_prix` |
| Clé étrangère | `fk_<table>_<colonne>` | `fk_produit_categorie` |
| Colonne de liaison | `<table_cible>_id` | `categorie_id` |

## 4. Règles de types

- Identifiants : `SMALLINT UNSIGNED` pour les tables susceptibles de dépasser 255 lignes (ex. `produit`), `TINYINT UNSIGNED` pour les petites tables (ex. `categorie`). Une clé étrangère doit avoir **exactement le même type** que la clé primaire référencée, sinon MySQL refuse la contrainte.
- Prix : `DECIMAL(6,2)`. Ne jamais utiliser `FLOAT` ou `DOUBLE` pour un montant.
- Texte court : `VARCHAR(n)` avec une longueur raisonnable (100 pour un libellé, 160 pour un nom de produit).
- Optionnel : `NULL`. Obligatoire : `NOT NULL`. Valeur par défaut explicite si nécessaire : `DEFAULT 1`.

## 5. Règles d'intégrité

- Toujours `ENGINE = InnoDB` (nécessaire pour les clés étrangères).
- Toujours `DEFAULT CHARSET = utf8mb4` et `COLLATE = utf8mb4_unicode_ci`.
- Clé étrangère : `ON DELETE RESTRICT` et `ON UPDATE CASCADE`, comme dans les tables existantes. Ne pas utiliser `ON DELETE CASCADE` sans demander l'accord, car cela supprime silencieusement des données.
- Une colonne de liaison a toujours sa clé étrangère et son index.

## 6. Données de test

Après le CREATE, ajouter quelques `INSERT` cohérents avec les tables existantes. Insérer les parents avant les enfants.

```sql
INSERT INTO nom_table (libelle, categorie_id) VALUES
    ('Exemple 1', 1),
    ('Exemple 2', 2);
```

## 7. Vérification

Avant de terminer :
- l'ordre des DROP et CREATE respecte les dépendances ;
- chaque clé étrangère pointe vers une table déjà créée, avec un type identique ;
- aucun nom de contrainte n'est en double dans le fichier ;
- le fichier s'exécute de haut en bas sans erreur (`mysql -u <login> -p <base> < sql/sae301.sql`) ;
- lancer ensuite `node .agents/skills/verifier-projet/scripts/check-projet.js .`.

## 8. Ce que ce skill ne fait pas

- Il ne crée pas le modèle PHP correspondant. Utiliser le skill `creer-modele-php` (à créer).
- Il ne modifie pas une table existante sans accord explicite : une modification de schéma sur des données réelles doit être décidée par l'utilisateur.