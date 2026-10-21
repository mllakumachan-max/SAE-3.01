---
trigger: glob
globs: front/**/*.{html,js,css}
---

# Style, Tailwind CSS v4 et Utilisation Dynamique

- **Configuration & Importation** :
  - Tailwind v4 est configuré avec `@tailwindcss/vite` et importé par `@import "tailwindcss";` dans `front/src/global.css`.
  - Pas de configuration `tailwind.config.js` classique : les personnalisations, variantes et utilitaires se déclarent directement dans `global.css`.

- **Règle fondamentale du compilateur Tailwind** :
  - Tailwind analyse statiquement le code à la recherche de noms complets de classes.
  - **Interdit** : 
    - Concaténer des noms de classes (ex: `"text-" + couleur`, `"bg-" + statut + "-500"`). Ces classes ne sont pas détectées et n'existeront pas dans le CSS compilé.
    - Utiliser `absolute`

- **Utilisation Dynamique de Tailwind** :
  Pour injecter des couleurs, tailles, thèmes ou données calculées dynamiquement sans casser Tailwind :

  1. **Variables CSS injectées via l'attribut `style` (méthode privilégiée)** :
     - Injecter des Custom Properties CSS dans le template ou fragment :
       ```html
       <div style="--accent: {{couleur}}; --hauteur: {{progression}}%;"
            class="bg-[var(--accent)] text-white h-[var(--hauteur)] transition-all">
       </div>
       ```
     - Cette méthode permet d'ajouter librement n'importe quelle variable future sans restriction de palette Tailwind.

  2. **Utilitaires personnalisés dans `front/src/global.css`** :
     - Déclarer des utilitaires avec la directive `@utility`, en prévoyant des valeurs de secours (fallbacks) :
       ```css
       @utility carte-dynamique {
         background-color: var(--carte-bg, var(--color-white));
         color: var(--carte-text, var(--color-zinc-900));
         border-color: var(--carte-border, var(--color-zinc-200));
       }
       ```
     - Exemple existant dans le projet : `@utility bandeau-clair` et `@utility bandeau-sombre` qui exploitent la variable `--teinte` calculée en JS.

  3. **Dictionnaires de correspondance JavaScript (Lookup Maps)** :
     - Pour un ensemble prédéfini d'états, types ou catégories, associer chaque clé à des classes Tailwind complètes écrites en dur :
       ```javascript
       const VARIANTES_STATUT = {
         disponible: "bg-emerald-500 text-white",
         rupture: "bg-rose-500 text-white",
         bientot: "bg-amber-400 text-zinc-950",
       };

       // Utilisation :
       const classeAppliquee = VARIANTES_STATUT[produit.statut] ?? "bg-zinc-300 text-zinc-700";
       ```

- **Thème sombre** :
  - Le thème sombre s'active par la classe `.theme-dark` posée sur `<html>` (`@custom-variant dark` dans `global.css`).
  - Utiliser le préfixe `dark:` (ex: `bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100`).

- **Accessibilité & Focus** :
  - Laisser la gestion globale de l'anneau de focus (`:focus-visible`) configurée dans `global.css`.
