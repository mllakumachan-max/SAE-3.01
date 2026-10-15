---
name: creer-page-mvc
description: Crée une nouvelle page dans front/src/pages/ respectant le patron MVC local (M, C, V) et guide son enregistrement dans front/src/main.js.
---

# Créer une page SPA (MVC local)

Ce skill guide la création d'une page complète dans l'application front-end.

## 1. Création des fichiers de la page

Pour une page par exemple nommée `panier` dans `front/src/pages/panier/` :

### Fichier `front/src/pages/panier/template.html`
```html
<section class="max-w-4xl mx-auto px-4 py-8">
  <header class="mb-6">
    <h1 class="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Mon Panier</h1>
  </header>

  <slot name="message"></slot>
  <slot name="contenu-panier"></slot>
  <slot name="recapitulatif"></slot>
</section>
```

### Fichier `front/src/pages/panier/page.js`
```javascript
import { htmlToFragment } from "../../lib/utils.js";
import { MessageView } from "../../ui/message/index.js";
import template from "./template.html?raw";

/**
 * Modèle local de la page.
 * Contient tout l'état de la page.
 */
let M = {
  articles: [],
  message: null,
};

/**
 * Contrôleur local.
 * Gère le chargement, les actions utilisateur et déclenche les rafraîchissements.
 */
let C = {};

C.chargerDonnees = async function () {
  try {
    // Appel éventuel à une méthode de data/
    M.message = null;
  } catch (erreur) {
    M.message = { type: "erreur", texte: erreur.message };
  }
};

C.handler_supprimerArticle = function (id) {
  M.articles = M.articles.filter((a) => a.id !== id);
  V.rafraichir();
};

C.init = async function () {
  await C.chargerDonnees();
  return V.init();
};

/**
 * Vue locale.
 * Reconstruit la page à partir du modèle M.
 */
let V = {};

V.racine = null;

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

  // Remplacement du message
  pageFragment.querySelector('slot[name="message"]').replaceWith(
    MessageView.dom(M.message)
  );

  // Remplacement des autres slots avec des composants UI...

  return pageFragment;
};

/**
 * Fonction exportée pour le routeur.
 */
export function PanierPage() {
  return C.init();
}
```

## 2. Enregistrement de la route dans `front/src/main.js`

Importer la page et ajouter la route avec le routeur de l'application :

```javascript
import { PanierPage } from "./pages/panier/page.js";

// Dans la section des routes :
router.addRoute("/panier", PanierPage);
```

Si la page prend un paramètre dynamique dans l'URL (ex: `/produit/:id`) :
```javascript
router.addRoute("/produit/:id", ProduitPage);
```
Dans `ProduitPage`, le paramètre est accessible via l'argument `params` :
```javascript
export function ProduitPage(params) {
  return C.init(params.id);
}
```
