---
name: conventions-css-tailwind
description: Applique les conventions CSS et Tailwind v4 du projet. À utiliser pour tout template HTML.
---

# Conventions CSS et Tailwind v4

Ce skill s'applique à `front/src/ui/`, `front/src/pages/` et `front/src/layouts/`.

## Étape 1 : Choisir la bonne unité

| Élément | Unité | Exemples |
|---|---|---|
| Taille de texte | `em` (tokens du thème) | `text-16`, `text-20` |
| Espacements (padding, margin, gap) | `rem` | `p-4`, `mt-6`, `gap-2` |
| Bordures, anneaux de focus, ombres | `px` | `border`, `border-2`, `outline-2`, `shadow-lg` |

Interdit : espacement en `px` ou `em`.

## Étape 2 : Utiliser des classes autorisées

- Autorisé : les utilitaires définis dans `@theme` ou `@theme inline` de `global.css`, et les classes standard d'espacement.
- Interdit : les valeurs arbitraires (`w-[320px]`, `text-[0.875rem]`).
- Interdit : les couleurs de palette directes (`text-amber-500`, `bg-blue-600`).

## Étape 3 : Préférer les couleurs sémantiques

Un rôle sémantique décrit l'usage, pas la couleur. Utiliser le rôle en premier.

| Usage | Exemple de classe |
|---|---|
| Texte principal | `text-text-primary` |
| Texte secondaire | `text-text-secondary` |
| Surface de carte | `bg-surface-default` |
| Bouton principal | `bg-action-primary-background` |
| Message d'erreur | `text-status-error-text` |

Si aucun rôle ne convient, utiliser un token de palette déclaré, par exemple `text-palette-neutral-700`.

## Étape 4 : Mettre en page avec Flexbox et Grid

- Interdit : `absolute` et `fixed` pour placer un élément ordinaire.
- Pour superposer un badge sur une image, utiliser une grille : les deux éléments partagent `col-start-1 row-start-1`.

```html
<div class="grid">
  <img class="col-start-1 row-start-1 h-48 w-full object-cover" src="{{src}}" alt="{{alt}}">
  <span class="col-start-1 row-start-1 m-2 justify-self-start rounded-md bg-surface-default p-2 text-12">
    {{badge}}
  </span>
</div>
```

## Étape 5 : Nommer avec BEM

Le bloc et ses éléments donnent la structure. Les classes Tailwind donnent le style.

- Bloc : `c-article`
- Élément : `c-article__titre`, `c-article__image`
- Modificateur : `c-article--brouillon`

## Étape 6 : Gérer le thème sombre

- Le thème est piloté par la classe `.theme-dark` sur `<html>`.
- Les tokens sémantiques changent seuls dans `global.css`. Il n'y a rien à faire dans les templates.
- Pour un cas précis, utiliser `dark:` (ex. `dark:bg-surface-subtle`).

## Étape 7 : Choisir un état avec un dictionnaire

Pour un état qui change la couleur, ne jamais construire la classe. Déclarer les classes complètes :

```javascript
const CLASSES_STATUT = {
  publie: "bg-surface-info text-status-success-text",
  brouillon: "bg-status-warning-background text-status-warning-text",
};
```

## Checklist avant de livrer

- Aucune valeur `[...]`, aucune couleur de palette brute, aucun `absolute`.
- Textes en `em`, espacements en `rem`, bordures en `px`.
- Les classes BEM sont présentes sur les éléments principaux.