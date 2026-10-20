---
name: creer-composant-ui
description: Crée un composant réutilisable dans front/src/ui/ (template.html et index.js avec html() et dom()). À utiliser pour un élément présent sur plusieurs pages, comme une carte, un badge ou un bouton.
---

# Créer un composant UI

Exemple suivi tout au long : un composant `badge`, qui affiche un texte coloré selon une variante (`succes` ou `alerte`).

## Étape 1 : Créer le dossier

```
front/src/ui/badge/
├── template.html
└── index.js
```

## Étape 2 : Écrire le template (`template.html`)

- Balisage sémantique, classes Tailwind sémantiques, classes BEM.
- `{{texte}}` pour une valeur simple (elle est échappée automatiquement).
- `<slot name="...">` pour un élément enfant fourni par la page.

```html
<span class="c-badge inline-flex items-center gap-1 rounded-md px-2 py-1 text-12 font-medium {{classes}}">
  {{texte}}
  <slot name="icone"></slot>
</span>
```

Le `{{classes}}` ne contient jamais une classe construite : il reçoit une valeur du dictionnaire de l'étape 3.

## Étape 3 : Écrire le script (`index.js`)

```javascript
import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

// Variantes : classes complètes, jamais construites
const VARIANTES = {
  succes: "bg-status-success-background text-status-success-text",
  alerte: "bg-status-warning-background text-status-warning-text",
};

let BadgeView = {};

/** data : { texte, variante } */
BadgeView.html = function (data) {
  return genericRenderer(template, {
    texte: data.texte,
    classes: VARIANTES[data.variante] ?? VARIANTES.succes,
  });
};

/** actions (optionnel) : { surClic } */
BadgeView.dom = function (data, actions = {}) {
  let fragment = htmlToFragment(BadgeView.html(data));

  if (actions.surClic) {
    fragment.firstElementChild.addEventListener("click", () => actions.surClic());
  }

  return fragment;
};

export { BadgeView };
```

Règle : le composant ne prend aucune décision métier et n'appelle jamais l'API. Il signale un clic, la page décide quoi faire.

## Étape 4 : Utiliser le composant dans une page

Dans `page.js`, remplacer le slot par le composant :

```javascript
import { BadgeView } from "../../ui/badge/index.js";

let slot = pageFragment.querySelector('slot[name="badge"]');
if (slot) {
  slot.replaceWith(BadgeView.dom({ texte: "Nouveau", variante: "succes" }));
}
```

## Étape 5 : Vérifier

- Le dossier contient exactement `template.html` et `index.js`.
- `html()` et `dom()` sont exposés.
- Aucun `fetch()` dans le composant.
- `node .agents/skills/verifier-projet/scripts/check-projet.js .`