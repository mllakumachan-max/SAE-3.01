---
name: modifier-table-sql
description: Modifie une table déjà existante et potentiellement remplie (ajout ou changement de colonne, clé étrangère, index) sans perdre de données. À utiliser quand une story demande un changement de schéma sur une base en service.
---

# Modifier une table existante

Exemple suivi tout au long : ajouter une colonne `stock` à la table `ARTICLE` (fictive, définie dans `creer-table-sql`).

## Règle de base

`sae301.sql` supprime et recrée toutes les tables. Modifier seulement son `CREATE TABLE` ne change donc **pas** une base qui contient déjà des données. Il faut deux éléments :

1. **La définition de référence** : le `CREATE TABLE` de `sae301.sql`, à jour (pour une installation neuve).
2. **Une migration** : un fichier `migrations/AAAA-MM-JJ-description.sql` avec les `ALTER TABLE` à appliquer sur la base existante.

## Étape 1 : Qualifier le changement

| Changement | Risque | Action |
|---|---|---|
| Ajouter une colonne facultative (`NULL`) | Faible | Migration directe |
| Ajouter une colonne `NOT NULL` avec `DEFAULT` | Faible | Migration directe |
| Ajouter une colonne `NOT NULL` sans `DEFAULT` | Élevé | Vérifier les données d'abord (étape 3) |
| Changer un type de colonne | Élevé | Vérifier la compatibilité des valeurs |
| Ajouter une clé étrangère | Élevé | Vérifier que toutes les valeurs existent dans la table parente |
| Supprimer une colonne ou une table | Critique | **Demander confirmation** à l'utilisateur |

## Étape 2 : Sauvegarder

Avant toute migration, sauvegarder la base :

```bash
mysqldump -u <login> -p <base> > sauvegarde-AAAA-MM-JJ.sql
```

## Étape 3 : Contrôler les données existantes

Exemple : avant de rendre `stock` obligatoire, vérifier qu'aucune ligne n'a de valeur vide.

```sql
SELECT COUNT(*) AS lignes_sans_stock FROM ARTICLE WHERE stock IS NULL;
```

Si le résultat est supérieur à 0, décider avec l'utilisateur d'une valeur de remplacement avant de continuer.

## Étape 4 : Écrire la migration

Créer `migrations/2026-10-20-ajout-stock-article.sql` :

```sql
ALTER TABLE ARTICLE
    ADD COLUMN stock SMALLINT UNSIGNED NOT NULL DEFAULT 0
    AFTER prix;
```

Règles :

- Une migration par changement, nommée avec la date et l'objet modifié.
- Pas de `DROP TABLE` ni de `DROP COLUMN` sans confirmation explicite.
- Les clés étrangères et index suivent les conventions de `creer-table-sql` (`fk_`, `idx_`, `ON DELETE RESTRICT`).

## Étape 5 : Mettre à jour la définition de référence

Reporter exactement le même changement dans le `CREATE TABLE` de `sae301.sql`. Les deux doivent rester identiques : une installation neuve et une base migrée doivent aboutir au même schéma.

## Étape 6 : Mettre à jour le code qui utilise la table

- Modèle : ajouter la colonne aux requêtes `SELECT` concernées.
- Contrôleur : valider la nouvelle donnée si elle vient de l'utilisateur.
- Front : mettre à jour les composants qui affichent ou saisissent la valeur.

## Étape 7 : Tester sur une copie

1. Restaurer la sauvegarde dans une base de test.
2. Appliquer la migration : `mysql -u <login> -p <base_test> < migrations/<fichier>.sql`
3. Vérifier que les données existantes sont intactes (comparer les comptages avant et après).
4. Tester les routes qui lisent la table.
5. Lancer `node .agents/skills/verifier-projet/scripts/check-projet.js .`

Ne jamais exécuter une migration directement sur la base de production sans avoir réussi l'étape 7.

## Limites

- Ce skill ne supprime jamais de colonne ni de table sans confirmation explicite.
- Ce skill ne modifie pas les données sans les avoir décrites à l'utilisateur.
