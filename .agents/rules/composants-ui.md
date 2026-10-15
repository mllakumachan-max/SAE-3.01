---
trigger: glob
globs: front/src/ui/**
---

# Conventions des composants d'interface (UI)

- **Structure d'un composant** :
  - Chaque composant se trouve dans son propre sous-dossier `front/src/ui/<nom-composant>/`.
  - Il comprend `template.html` (avec balisage sémantique, Tailwind et slots) et `index.js`.
  - Import du template en texte brut : `import template from "./template.html?raw";`.

- **Contrat de l'objet vue (`<NomComposant>View`)** :
  - `html: function(data) { ... }` :
    - Retourne une chaîne HTML en utilisant `genericRenderer(template, data)`.
    - `genericRenderer` échappe systématiquement les valeurs textuelles pour parer aux failles XSS.
  - `dom: function(data, actions) { ... }` :
    - Convertit le HTML en fragment (`htmlToFragment`).
    - Configure les éléments interactifs (sélections de formulaires, boutons).
    - Remplace les `<slot name="...">` par les sous-composants nécessaires si composition.
    - Attache les écouteurs d'événements (`addEventListener`) et délègue aux fonctions reçues dans l'objet `actions` (ex: `actions.surChangement(valeur)`).
    - Retourne le `DocumentFragment`.

- **Règles d'or** :
  - **Aucune logique métier** : Un composant ne décide de rien, n'appelle pas l'API, ne modifie pas les URL et ne contient pas de données globales.
  - **Composants d'affichage pur** : Pour un composant statique sans interaction, exposer `html(data)` ou `dom(data)` sans paramètre `actions`.
  - **Remplacement de slots** : Pour insérer du HTML dynamique ou un sous-composant, utiliser un `<slot name="...">` dans le template, puis `slot.replaceWith(...)` dans la méthode `dom()`.
