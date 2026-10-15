---
name: creer-composant-ui
description: Crée un composant d'interface réutilisable dans front/src/ui/ selon les conventions du projet (template.html et index.js avec support Tailwind dynamique).
---

# Créer un composant d'interface (UI)

Ce skill guide la création d'un nouveau composant dans le dossier `front/src/ui/<nom-composant>/`.

## 1. Création des fichiers du composant

Pour un composant nommé par exemple `badge-produit` :

### Fichier `front/src/ui/badge-produit/template.html`
- Utiliser du HTML sémantique avec des classes Tailwind v4.
- Utiliser des variables simples `{{nom}}` pour le texte échappé.
- Pour des variables de style dynamiques, injecter des CSS Custom Properties dans `style="..."` et les cibler avec Tailwind :
- Utiliser `<slot name="...">` pour les emplacements d'éléments enfants ou d'autres composants.

```html
<div style="--badge-couleur: {{couleur}};" 
     class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[var(--badge-couleur)] text-white">
  <span class="truncate">{{texte}}</span>
  <slot name="icone"></slot>
</div>
```

### Fichier `front/src/ui/badge-produit/index.js`

```javascript
import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Composant BadgeProduit.
 *
 * data : { texte, couleur }
 * actions (optionnel) : { surClic }
 */
let BadgeProduitView = {
  /**
   * Retourne le HTML sous forme de chaîne de caractères.
   * @param {{texte: string, couleur: string}} data
   * @returns {string}
   */
  html: function (data) {
    return genericRenderer(template, {
      texte: data.texte,
      couleur: data.couleur ?? "#3b82f6",
    });
  },

  /**
   * Retourne le composant sous forme de DocumentFragment prêt à être inséré.
   * @param {{texte: string, couleur: string}} data
   * @param {{surClic?: () => void}} [actions]
   * @returns {DocumentFragment}
   */
  dom: function (data, actions = {}) {
    let fragment = htmlToFragment(BadgeProduitView.html(data));

    if (actions.surClic) {
      let element = fragment.firstElementChild;
      element.classList.add("cursor-pointer");
      element.addEventListener("click", () => actions.surClic());
    }

    return fragment;
  },
};

export { BadgeProduitView };
```

## 2. Utilisation du composant dans une page ou un composant parent

Dans la vue de la page (`front/src/pages/.../page.js`) :
```javascript
import { BadgeProduitView } from "../../ui/badge-produit/index.js";

// Dans createPageFragment :
let slotBadge = pageFragment.querySelector('slot[name="badge"]');
if (slotBadge) {
  slotBadge.replaceWith(
    BadgeProduitView.dom(
      { texte: "En promotion", couleur: "#10b981" },
      { surClic: () => C.handler_clicBadge() }
    )
  );
}
```
