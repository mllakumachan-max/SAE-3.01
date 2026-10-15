---
name: verifier-projet
description: Vérifie la cohérence globale du projet SAE301-Starter (chemins BASE/config, architecture MVC locale des pages, contrats des composants UI, standards PHP et détection d'erreurs Tailwind).
---

# Vérifier la cohérence du projet (Architecture & Conventions)

Ce skill exécute un contrôle automatisé du projet pour s'assurer que toutes les conventions sont respectées avant de livrer ou tester.

## Lancer la vérification

Depuis la racine du projet :

```bash
node .agents/skills/verifier-projet/scripts/check-projet.js .
```

## Points contrôlés par le script :

1. **Synchronisation des chemins** :
   - Vérifie que la constante `BASE` dans `front/vite.config.js` et `'chemin'` dans `back/config/config.php` ont la même valeur.
   - Alerte si le placeholder `"votre_login"` est encore présent.

2. **Architecture MVC locale des pages (`front/src/pages/`)** :
   - Vérifie la présence des 3 objets `M`, `C`, `V` dans chaque page dynamique.
   - Vérifie qu'une fonction de page est bien exportée pour le routeur.
   - Détecte d'éventuels appels directs à `fetch()` au lieu d'utiliser `front/src/data/`.

3. **Contrats des composants UI (`front/src/ui/`)** :
   - Vérifie que chaque composant possède son `template.html` et son `index.js`.
   - Vérifie qu'il expose les méthodes standard `dom()` ou `html()`.
   - S'assure qu'aucun composant UI ne fait d'appels réseau directs.

4. **Conventions de style Tailwind v4** :
   - Détecte les concaténations de chaînes (ex: `"bg-" + variable`) qui briseraient la compilation Tailwind.
   - Rappelle l'utilisation des CSS Custom Properties (`style="--var:..."`) pour le style dynamique.

5. **Qualité Backend PHP (`back/src/`)** :
   - Vérifie la présence de `declare(strict_types=1);` dans tous les fichiers PHP.
