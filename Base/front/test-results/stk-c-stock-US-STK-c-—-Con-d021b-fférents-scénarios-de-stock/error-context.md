# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stk-c-stock.spec.js >> US STK-c — Contraintes de stock >> DoD — Tests avec différents scénarios de stock
- Location: tests/stk-c-stock.spec.js:268:3

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('input[name="quantite"]')
Expected: "50"
Received: "42"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" locator('input[name="quantite"]') with timeout 5000ms
  - waiting for locator('input[name="quantite"]')
    14 × locator resolved to <input min="1" max="42" value="1" type="number" name="quantite" aria-label="Quantité" class="h-10 w-14 bg-transparent text-center text-14"/>
       - unexpected value "42"

```

```yaml
- spinbutton "Quantité": "1"
```

# Test source

```ts
  179 |               stock: 10,
  180 |               src: "",
  181 |             },
  182 |           ])
  183 |         );
  184 |       },
  185 |       [id]
  186 |     );
  187 | 
  188 |     let appels = 0;
  189 |     await page.route("**/api/panier/verifier-stock", async (route) => {
  190 |       appels++;
  191 |       if (appels === 1) {
  192 |         // Chargement du panier : stock OK, la ligne s'affiche.
  193 |         await route.fulfill({
  194 |           json: {
  195 |             valide: true,
  196 |             lignes: [
  197 |               {
  198 |                 id,
  199 |                 nom: "Produit de test",
  200 |                 stock: 10,
  201 |                 quantiteDemandee: 2,
  202 |                 quantiteMax: 10,
  203 |                 estValide: true,
  204 |                 message: null,
  205 |               },
  206 |             ],
  207 |           },
  208 |         });
  209 |         return;
  210 |       }
  211 | 
  212 |       // Validation de la commande : le stock a chuté à 0, la commande est bloquée.
  213 |       await route.fulfill({
  214 |         json: {
  215 |           valide: false,
  216 |           lignes: [
  217 |             {
  218 |               id,
  219 |               nom: "Produit de test",
  220 |               stock: 0,
  221 |               quantiteDemandee: 2,
  222 |               quantiteMax: 0,
  223 |               estValide: false,
  224 |               message: "Ce produit est épuisé.",
  225 |             },
  226 |           ],
  227 |         },
  228 |       });
  229 |     });
  230 | 
  231 |     await aller(page, "panier");
  232 |     await expect(page.locator('[data-zone="lignes"] li')).toHaveCount(1);
  233 | 
  234 |     await page.locator('[data-action="valider"]').click();
  235 | 
  236 |     // La commande n'a pas été validée : le panier est toujours là.
  237 |     await expect(page.locator('[data-zone="lignes"] li')).toHaveCount(0);
  238 |     expect(page.locator('[data-role="compteur-panier"]')).toHaveText("0");
  239 | 
  240 |     const message = page.locator('[data-zone="message"]');
  241 |     await expect(message).toContainText("épuisé");
  242 |   });
  243 | 
  244 |   test("DoD — Vérification côté client et côté serveur", async ({ page }) => {
  245 |     const { slug, stock } = PRODUITS_TESTS[1]; // stock = 1
  246 |     const id = await idProduit(page, slug);
  247 | 
  248 |     // Côté client : borne le contrôle de quantité (max = stock).
  249 |     await aller(page, `produit/${slug}`);
  250 |     await expect(page.locator('input[name="quantite"]')).toHaveAttribute("max", String(stock));
  251 | 
  252 |     // Côté serveur : l'API de vérification est appelée à l'ajout.
  253 |     let verifieParServeur = false;
  254 |     await page.route("**/api/panier/verifier-stock", async (route) => {
  255 |       verifieParServeur = true;
  256 |       await route.fulfill({
  257 |         json: {
  258 |           valide: true,
  259 |           lignes: [{ id, stock, quantiteDemandee: 1, quantiteMax: stock, estValide: true, message: null }],
  260 |         },
  261 |       });
  262 |     });
  263 | 
  264 |     await page.locator('[data-action="ajouter-panier"]').click();
  265 |     expect(verifieParServeur).toBe(true);
  266 |   });
  267 | 
  268 |   test("DoD — Tests avec différents scénarios de stock", async ({ page }) => {
  269 |     for (const { slug, stock, libelle } of PRODUITS_TESTS) {
  270 |       await aller(page, `produit/${slug}`);
  271 |       const bouton = page.locator('[data-action="ajouter-panier"]');
  272 |       const input = page.locator('input[name="quantite"]');
  273 | 
  274 |       if (stock <= 0) {
  275 |         await expect(bouton).toBeDisabled();
  276 |         await expect(bouton).toHaveText("Épuisé");
  277 |       } else {
  278 |         await expect(bouton).not.toBeDisabled();
> 279 |         await expect(input).toHaveAttribute("max", String(stock));
      |                             ^ Error: expect(locator).toHaveAttribute(expected) failed
  280 |       }
  281 |     }
  282 |   });
  283 | });
  284 | 
  285 | /**
  286 |  * Répond que le produit donné est épuisé (stock 0).
  287 |  *
  288 |  * @param {import("@playwright/test").Route} route
  289 |  * @param {number|string} id
  290 |  */
  291 | async function routeFulfillEpuise(route, id) {
  292 |   await route.fulfill({
  293 |     json: {
  294 |       valide: false,
  295 |       lignes: [
  296 |         {
  297 |           id,
  298 |           stock: 0,
  299 |           quantiteDemandee: 1,
  300 |           quantiteMax: 0,
  301 |           estValide: false,
  302 |           message: "Ce produit est épuisé.",
  303 |         },
  304 |       ],
  305 |     },
  306 |   });
  307 | }
  308 | 
```