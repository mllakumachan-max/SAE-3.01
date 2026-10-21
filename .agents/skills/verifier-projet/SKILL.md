---
name: verifier-projet
description: Vérifie la cohérence du projet SAE 3.01 Click & Collect (chemins, pages MVC, composants UI, Tailwind, PHP strict). À lancer avant de livrer ou de tester.
---

# Vérifier le projet

## Étape 1 : Lancer le script

Depuis la racine du projet :

```bash
node .agents/skills/verifier-projet/scripts/check-projet.js .
```

## Étape 2 : Lire le résultat

Chaque ligne indique un contrôle. Corriger les erreurs dans l'ordre, puis relancer le script.

## Étape 3 : Comprendre les contrôles

| Contrôle | Ce qui est vérifié |
|---|---|
| Chemins | `BASE` dans `front/vite.config.js` et `'chemin'` dans `back/config/config.php` ont la même valeur. Alerte si `"votre_login"` est encore présent. |
| Pages | Chaque page de `front/src/pages/` a `M`, `C`, `V` et une fonction exportée. Pas de `fetch()` direct. |
| Composants | Chaque dossier de `front/src/ui/` a `template.html` et `index.js`, avec `html()` ou `dom()`. Aucun appel réseau. |
| Tailwind | Détecte les concaténations de classes (`"bg-" + couleur`) qui cassent la compilation. |
| PHP | Chaque fichier de `back/src/` contient `declare(strict_types=1);`. |

## Étape 4 : Rappel

Le script détecte les erreurs visibles dans le code, mais il ne remplace pas un test dans le navigateur ni une lecture des conventions.