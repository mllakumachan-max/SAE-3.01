---
name: ecrire-tests-playwright
description: Écrit le fichier de test Playwright d'une user story (ex. DEC-a) dans Base/front/tests/, nommé d'après son code, avec sa description, un test par critère d'acceptation (CA) et par point du Definition of Done (DoD). À utiliser pour tester une story.
---

# Écrire les tests Playwright d'une user story

Exemple suivi : US **DEC-a** (Navigation par catégories), testée dans `Base/front/tests/dec-a-categories.spec.js`.

## Étape 1 : Lire la story

1. Lire sa fiche dans `README.md`.
2. Lire ses CA et son DoD dans le sujet (`SAE_3_01_-_Parcours_utilisateur_…pdf`).
3. Recopier CA et DoD tels quels : ce sont les libellés des tests.

## Étape 2 : Nommer le fichier

`<code-en-minuscules>-<sujet>.spec.js` dans `Base/front/tests/` : `DEC-a` → `dec-a-categories.spec.js`, `GOF-c` → `gof-c-categories.spec.js`.

## Étape 3 : Écrire l'en-tête

Le fichier commence par la description de la story, sans détail d'implémentation :

```js
/**
 * US DEC-a — Navigation par catégories
 *
 * En tant que visiteur, je veux filtrer les produits par catégorie afin de
 * trouver plus facilement ce qui m'intéresse.
 *
 * Critères d'acceptation
 *  - …
 *
 * Definition of Done
 *  - …
 */
```

## Étape 4 : Un test par critère

- Chaque CA : `test("CA — …")`. Chaque point du DoD : `test("DoD — …")`.
- Tous dans `test.describe("US <CODE> — <Titre>")`, avec `beforeEach` qui appelle `aller(page)`.

## Étape 5 : Utiliser les helpers

À importer depuis `./helpers.js` et `./constantes.js`, jamais à redéfinir :

- `aller(page, chemin)`, `url(chemin)` : navigation et adresse absolue.
- `api(page, uri, {method, body})` : appel API, c'est la **référence**.
- `connecter`, `deconnecter`, `COMPTES` : sessions de test.
- `cartes`, `menuCategories`, `attendreImage`, `PRIX` : lecture de l'écran.

## Étape 6 : Appliquer les règles

1. Comparer l'écran à l'API, jamais à une valeur écrite en dur.
2. Choisir la donnée dans l'API, puis `expect(donnee).toBeTruthy()`.
3. Sélecteurs par rôle, texte ou `href`, jamais de classes Tailwind.
4. Assertions web-first (`await expect(…)`). Aucun `waitForTimeout`.
5. « Sans rechargement » : poser `window.__marqueur` avant l'action et le revérifier après.
6. Chaque test part de `aller(page)` et réussit seul.

## Étape 7 : Modèle

```js
// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api, cartes } from "./helpers.js";

/* En-tête de l'US : voir l'étape 3 */
test.describe("US <CODE> — <Titre>", () => {
  test.beforeEach(async ({ page }) => {
    await aller(page);
  });

  test("CA — <CA recopié>", async ({ page }) => {
    const { statut, donnees } = await api(page, "<ressource>");
    expect(statut).toBe(200);
    await expect(cartes(page)).toHaveCount(donnees.produits.length);
  });

  test("DoD — <DoD recopié>", async ({ page }) => {
    await page.evaluate(() => { /** @type {any} */ (window).__marqueur = "vivant"; });
    // Action qui ne doit pas recharger la page.
    expect(await page.evaluate(() => /** @type {any} */ (window).__marqueur)).toBe("vivant");
  });
});
```

## Étape 8 : Vérifier

- `cd Base/front && npx playwright test tests/<fichier>.spec.js`
- `node .agents/skills/verifier-projet/scripts/check-projet.js .` (depuis la racine)

Contrôles : nom conforme à l'US, en-tête complet, un test par CA et par point du DoD, aucun `waitForTimeout` ni valeur en dur. Ne jamais modifier `test-results/` à la main.