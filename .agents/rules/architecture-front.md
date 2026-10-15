---
trigger: glob
globs: front/src/**/*.js
---

# Architecture Frontend SPA & Pages MVC

- **Organisation des modules** :
  - `front/src/main.js` : Point d'entrée de l'application, enregistrement des layouts (`router.addLayout`) et des routes (`router.addRoute`).
  - `front/src/lib/router.js` : Routeur client. Les liens internes utilisent l'attribut `data-link` avec un chemin absolu relatif à la racine du routeur (ex: `<a href="/panier" data-link>`).
  - `front/src/pages/<nom>/page.js` : Définition des pages de l'application.

- **Structure d'une page dynamique (MVC local)** :
  Chaque fichier `page.js` de page isole ses responsabilités :
  - `let M = { ... }` : État réactif de la page (données reçues de l'API, messages d'information/erreur, données temporaires).
  - `let C = { ... }` : Contrôleur local.
    - Fonctions asynchrones de récupération de données (`C.charger...`).
    - Handlers d'événements (`C.handler_<action>`) qui modifient `M` puis appellent `V.rafraichir()`.
    - `C.init()` initialise la page et retourne le résultat de `V.init()`.
  - `let V = { ... }` : Vue locale.
    - `V.createPageFragment()` convertit le template HTML (`htmlToFragment`), et remplace les `<slot name="...">` par les fragments retournés par les composants UI (`ComposantView.dom(...)`).
    - `V.init()` crée le premier fragment et mémorise `V.racine`.
    - `V.rafraichir()` reconstruit intégralement le fragment depuis `M` et remplace l'ancienne racine (`V.racine.replaceWith(fragment); V.racine = fragment.firstElementChild;`).
  - **Export obligatoire** : `export function <NomPage>() { return C.init(); }`.

- **Accès aux données** :
  - Ne jamais utiliser directement `fetch()` dans une page ou un composant.
  - Toujours créer ou utiliser un module dans `front/src/data/` qui s'appuie sur `getRequest` / `postRequest` de `front/src/lib/api-request.js`.
