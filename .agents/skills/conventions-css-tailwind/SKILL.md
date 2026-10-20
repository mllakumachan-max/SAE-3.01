---
name: conventions-css-tailwind
description: Applique les conventions de style CSS et Tailwind v4 pour le projet (BEM, variables sémantiques et primitives du thème, unités strictes em/rem/px, interdiction de l'arbitraire/injecté brut et de la position absolute).
---

# Conventions CSS et Tailwind v4

Ce skill définit les règles strictes de stylage, d'unités de mesure, d'intégration Tailwind CSS v4 et de nommage pour l'ensemble des templates HTML (`front/src/ui/`, `front/src/pages/`, `front/src/layouts/`) et des styles du projet.

---

## 1. Règles d'or & Unités de mesure obligatoires

1. **Règles strictes sur les unités :**
   - 🔤 **Taille des textes toujours en `em`** :
     - Utiliser les utilitaires du thème définis en `em` (ex: `text-12` à `text-48` dans `global.css` : `0.75em`, `0.875em`, `1em`, `1.25em`, etc.).
     - Permet une mise à l'échelle typographique proportionnelle et relative au composant conteneur.
   - 📐 **Espacements toujours en `rem` (marges internes, marges externes, gap)** :
     - Utiliser les classes d'espacement standard de Tailwind qui reposent strictement sur `rem` :
       - Marges internes (padding) : `p-4` (1rem), `px-2.5` (0.625rem), `py-2` (0.5rem), etc.
       - Marges externes (margin) : `m-4`, `mb-2`, `mt-6`, etc.
       - Espacements flex/grid (gap) : `gap-2` (0.5rem), `gap-4` (1rem), `gap-x-6`, etc.
     - ❌ **Interdit** : valeurs d'espacement en `px` ou en `em`.
   - 🎨 **Décorations et bordures toujours en `px`** :
     - Épaisseurs de bordures : `border` (1px), `border-2` (2px), etc.
     - Anneaux de focus (outline/ring) et séparateurs en `px` (ex: `outline-2`, `outline-offset-2`).

2. **Aucune valeur injectée ou arbitraire en dur :**
   - ❌ **Interdit** : classes de couleurs directes/par défaut non déclarées comme sémantiques (ex: `text-amber-500`, `bg-blue-600`, `border-zinc-200`).
   - ❌ **Interdit** : valeurs arbitraires Tailwind directes (ex: `text-[0.875rem]`, `w-[320px]`, `p-[15px]`, `m-[10px]`).
   - ❌ **Interdit** : concaténation dynamique de classes JS (ex: `"text-" + couleur`).
   - ✅ **Obligatoire** : utiliser exclusivement les utilitaires générés par les tokens `@theme` et `@theme inline` définis dans `global.css`.

3. **Privilégier les variables sémantiques puis primitives :**
   - **Couleurs sémantiques** : toujours préférer les rôles sémantiques :
     - Textes : `text-text-primary`, `text-text-secondary`, `text-text-disabled`, `text-text-link`, `text-text-inverse`.
     - Surfaces / Arrière-plans : `bg-background-default`, `bg-background-subtle`, `bg-surface-default`, `bg-surface-subtle`, `bg-surface-info`.
     - Bordures : `border-border-default`, `border-border-subtle`, `border-border-strong`, `border-border-focus`.
     - Actions : `bg-action-primary-background`, `text-action-primary-text`, `border-action-secondary-border`, etc.
     - Statuts : `text-status-success-text`, `bg-status-warning-background`, etc.
     - Accents : `bg-accent-primary`, `text-accent-secondary`.
   - **Couleurs de palette (primitives)** : si aucun rôle sémantique n'existe, utiliser les tokens déclarés du thème (ex: `text-palette-neutral-700`, `bg-palette-blue-brand`, `bg-palette-neutral-100`).

4. **Positionnement : Ne JAMAIS utiliser `absolute` :**
   - ❌ **Interdit** : `absolute`, `fixed` pour le placement ordinaire d'éléments d'interface.
   - ✅ **Obligatoire** : construire les mises en page exclusivement avec **Flexbox** (`flex`, `items-center`, `justify-between`, etc.) et **CSS Grid** (`grid`, `grid-cols-...`).
   - Les superpositions ou alignements d'indicateurs/badges doivent s'appuyer sur la structure de flux, le flex wrap, ou des conteneurs de grille superposés (`col-start-1 row-start-1`).

5. **Méthodologie BEM (Block Element Modifier) :**
   - Structurer le balisage HTML avec des classes de nommage BEM pour donner du sens au composant, accompagnées des classes utilitaires Tailwind :
     - **Bloc** : `c-carte-produit` (ou `c-<nom-composant>`)
     - **Élément** : `c-carte-produit__image`, `c-carte-produit__titre`, `c-carte-produit__prix`
     - **Modificateur** : `c-carte-produit--indisponible`, `c-bouton--primaire`
   - Le style principal est appliqué par les classes utilitaires Tailwind sur ces balises, tandis que les classes BEM garantissent la lisibilité structurelle.

---

## 2. Thème sombre et Variantes

- Le thème sombre est piloté par la classe `.theme-dark` posée sur `<html>`.
- Les variables sémantiques basculent automatiquement dans `global.css` sous `.theme-dark`.
- Pour les cas spécifiques requérant une variante explicite, utiliser le modificateur `dark:...` (ex: `dark:bg-surface-subtle`).

---

## 3. Exemple d'application : Template d'un composant (`carte-produit/template.html`)

```html
<article class="c-carte-produit flex flex-col justify-between overflow-hidden rounded-lg border border-border-default bg-surface-default shadow-xs transition-shadow hover:shadow-md">
  <figure class="c-carte-produit__contenu flex flex-col">
    <!-- Image en flux / Flex sans absolute (padding en rem : p-4 = 1rem) -->
    <div class="c-carte-produit__media flex h-48 w-full items-center justify-center overflow-hidden bg-background-subtle p-4">
      <img 
        src="{{src}}" 
        alt="{{alt}}" 
        class="c-carte-produit__image h-full w-full object-contain transition-transform duration-200 hover:scale-105" 
        loading="lazy" 
      />
    </div>

    <!-- Espacements internes en rem (p-4), texte en em (text-16, text-20, text-14), bordures en px (border = 1px) -->
    <figcaption class="c-carte-produit__details flex flex-col p-4">
      <h2 class="c-carte-produit__titre mb-1 text-16 font-medium text-text-primary line-clamp-2">
        {{nom}}
      </h2>

      <!-- Alignement Flex sans absolute (gap et marges en rem) -->
      <div class="c-carte-produit__prix-zone mb-3 flex items-baseline justify-between gap-2">
        <span class="c-carte-produit__prix text-20 font-bold text-text-primary">
          {{prix}} €
        </span>
        <slot name="badge-stock"></slot>
      </div>

      <a href="{{lien}}" data-link class="c-carte-produit__lien text-14 font-medium text-text-link underline">
        Voir le détail
      </a>

      <button 
        type="button" 
        data-action="ajouter-panier" 
        class="c-carte-produit__btn-ajout mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-action-primary-background px-4 text-16 font-medium text-action-primary-text transition-opacity hover:opacity-90 disabled:bg-action-disabled-background disabled:text-action-disabled-text disabled:cursor-not-allowed"
      >
        Ajouter au panier
      </button>
    </figcaption>
  </figure>
</article>
```

---

## 4. Dictionnaire de correspondance d'états (remplace les classes dynamiques)

Dans `index.js`, associer les statuts à des classes sémantiques complètes et prédéfinies :

```javascript
const CLASSES_VARIANTES_BEM = {
  disponible: {
    bem: "c-badge--succes",
    tailwind: "bg-surface-info text-status-success-text border border-border-default"
  },
  alerte: {
    bem: "c-badge--alerte",
    tailwind: "bg-status-warning-background text-status-warning-text border border-border-subtle"
  }
};
```
