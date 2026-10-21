---
name: creer-page-mvc
description: Crée une page SPA dans front/src/pages/ selon le patron MVC local (M, C, V), puis l'enregistre dans front/src/main.js. À utiliser pour tout nouvel écran complet.
---

# Créer une page (MVC local)

Exemple suivi tout au long : une page `articles`, accessible sur `/articles`, qui affiche une liste et permet de retirer un élément.

## Étape 1 : Créer le dossier

```
front/src/pages/articles/
├── template.html
└── page.js
```

## Étape 2 : Écrire le squelette (`template.html`)

Le template ne contient que la structure et les slots, jamais de données.

```html
<section class="mx-auto max-w-4xl px-4 py-8">
  <h1 class="mb-6 text-24 font-bold text-text-primary">Articles</h1>
  <slot name="liste"></slot>
</section>
```

## Étape 3 : Écrire la page (`page.js`)

Le fichier est découpé en trois objets :

- **M** : les données de la page.
- **C** : charge les données et réagit aux actions.
- **V** : construit le HTML à partir de M.

```javascript
import { htmlToFragment } from "../../lib/utils.js";
import { ArticleData } from "../../data/article.js";
import { ListeArticlesView } from "../../ui/liste-articles/index.js";
import template from "./template.html?raw";

let M = { articles: [] };   // M : état de la page

let C = {};                 // C : chargement et actions
C.chargerDonnees = async function () {
  M.articles = await ArticleData.fetchListe();
};
C.handler_retirer = function (id) {
  M.articles = M.articles.filter((article) => article.id !== id);
  V.rafraichir();
};
C.init = async function () {
  await C.chargerDonnees();
  return V.init();
};

let V = { racine: null };   // V : construction du DOM
V.init = function () {
  let fragment = V.createPageFragment();
  V.racine = fragment.firstElementChild;
  return fragment;
};
V.rafraichir = function () {
  let fragment = V.createPageFragment();
  let nouvelleRacine = fragment.firstElementChild;
  V.racine.replaceWith(fragment);
  V.racine = nouvelleRacine;
};
V.createPageFragment = function () {
  let pageFragment = htmlToFragment(template);
  pageFragment.querySelector('slot[name="liste"]').replaceWith(
    ListeArticlesView.dom(M.articles, { surRetrait: C.handler_retirer })
  );
  return pageFragment;
};

export function ArticlesPage() {   // fonction lue par le routeur
  return C.init();
}
```

Règle : les données viennent de `data/`, jamais d'un `fetch()` dans la page.

## Étape 4 : Enregistrer la route (`front/src/main.js`)

```javascript
import { ArticlesPage } from "./pages/articles/page.js";

router.addRoute("/articles", ArticlesPage);
```

## Étape 5 : Vérifier

- `page.js` contient `M`, `C`, `V` et exporte une fonction de page.
- Aucun `fetch()` dans `page.js`, aucune valeur arbitraire dans le template.
- `node .agents/skills/verifier-projet/scripts/check-projet.js .`