// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api, attendreApp } from "./helpers.js";
import { COMPTES } from "./constantes.js";

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64"
);

/** @typedef {Record<string, any>} ProduitApi */

/** @param {string} prefixe */
function nomUnique(prefixe) {
  return `${prefixe} ${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/** @param {string} nom @param {Record<string, any>} [extra] @returns {ProduitApi} */
function produitValide(nom, extra = {}) {
  return {
    nom,
    reference: "",
    categorie_id: 4,
    marque: "Test",
    format: "",
    description: "Produit créé par le test GOF-a.",
    prix: "12.50",
    prix_unitaire: "",
    unite_prix: "",
    badge: "",
    stock: 4,
    seuil_alerte: 3,
    ...extra,
  };
}

/** @param {import("@playwright/test").Page} page */
async function seConnecterAdmin(page) {
  await aller(page, "admin");
  await page.locator('input[name="login"]').fill(COMPTES.admin.login);
  await page.locator('input[name="mdp"]').fill(COMPTES.admin.mdp);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByText(`Connecté en tant que ${COMPTES.admin.login}`)).toBeVisible();
  await aller(page, "admin/produits");
}

/** @param {import("@playwright/test").Page} page @param {string} nom */
function ligneProduit(page, nom) {
  return page.locator("tr", { hasText: nom });
}

/**
 * @param {import("@playwright/test").Page} page
 * @param {{nom: string, categorie?: string, prix?: number|string, stock?: number|string, seuil?: number|string}} donnees
 */
async function remplirFormulaire(page, { nom, categorie = "Bricolage", prix, stock, seuil }) {
  const formulaire = page.locator("form").first();
  await formulaire.locator('input[name="nom"]').fill(nom);
  await formulaire.locator('select[name="categorieId"]').selectOption({ label: categorie });
  if (prix !== undefined) await formulaire.locator('input[name="prix"]').fill(String(prix));
  if (stock !== undefined) await formulaire.locator('input[name="stock"]').fill(String(stock));
  if (seuil !== undefined) await formulaire.locator('input[name="seuilAlerte"]').fill(String(seuil));
  return formulaire;
}

test.describe("US GOF-a — Gestion des produits", () => {
  /** @type {number[]} */
  let crees = [];

  test.beforeEach(async ({ page }) => {
    crees = [];
    await seConnecterAdmin(page);
    await expect(page.getByRole("heading", { name: "Gestion des produits" })).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    for (const id of crees) {
      await api(page, `admin/produits/${id}`, { method: "DELETE" });
    }
  });

  test("CA — Je peux ajouter un produit avec ses informations", async ({ page }) => {
    const nom = nomUnique("Produit ajout");
    await page.getByRole("button", { name: "Nouveau produit" }).click();
    await remplirFormulaire(page, { nom, prix: 12.5, stock: 4, seuil: 3 });
    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect(page.getByText(`Produit « ${nom} » enregistré.`)).toBeVisible();
    const ligne = ligneProduit(page, nom);
    await expect(ligne).toBeVisible();
    await expect(ligne).toContainText("Bricolage");
    await expect(ligne).toContainText("12.5");

    const { donnees } = await api(page, "admin/produits");
    const cree = donnees.produits.find((/** @type {ProduitApi} */ produit) => produit.nom === nom);
    expect(cree).toBeTruthy();
    crees.push(cree.id);
  });

  test("CA — Je peux modifier un produit existant", async ({ page }) => {
    const nom = nomUnique("Produit modif");
    const { donnees } = await api(page, "admin/produits", {
      method: "POST",
      body: produitValide(nom),
    });
    crees.push(donnees.produit.id);
    await aller(page, "admin/produits");

    await ligneProduit(page, nom).getByRole("button", { name: "Modifier" }).click();
    const nouveauNom = `${nom} modifié`;
    await remplirFormulaire(page, { nom: nouveauNom, prix: 9.9, stock: 0, seuil: 2 });
    await expect(page.getByRole("heading", { name: "Modifier le produit" })).toBeVisible();
    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect(page.getByText(`Produit « ${nouveauNom} » enregistré.`)).toBeVisible();
    await expect(ligneProduit(page, nouveauNom)).toBeVisible();
    await expect(ligneProduit(page, nouveauNom)).toContainText("9.9");
  });

  test("CA — Je peux supprimer un produit, après confirmation", async ({ page }) => {
    const nom = nomUnique("Produit suppr");
    const { donnees } = await api(page, "admin/produits", {
      method: "POST",
      body: produitValide(nom),
    });
    const id = donnees.produit.id;
    await aller(page, "admin/produits");

    await ligneProduit(page, nom).getByRole("button", { name: "Supprimer" }).click();
    const dialogue = page.getByRole("dialog");
    await expect(dialogue).toContainText(nom);
    await dialogue.getByRole("button", { name: "Annuler" }).click();
    await expect(ligneProduit(page, nom)).toBeVisible();

    await ligneProduit(page, nom).getByRole("button", { name: "Supprimer" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Supprimer" }).click();
    await expect(page.getByText(`Produit « ${nom} » supprimé.`)).toBeVisible();
    await expect(ligneProduit(page, nom)).toHaveCount(0);

    const { statut } = await api(page, `admin/produits/${id}`, { method: "DELETE" });
    expect(statut).toBe(404);
  });

  test("CA — Je peux téléverser une image, puis la supprimer", async ({ page }) => {
    const nom = nomUnique("Produit image");
    await page.getByRole("button", { name: "Nouveau produit" }).click();
    await remplirFormulaire(page, { nom, prix: 5, stock: 1, seuil: 1 });
    await page.locator('input[name="image"]').setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: PNG_1X1,
    });
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText(`Produit « ${nom} » enregistré.`)).toBeVisible();

    const { donnees } = await api(page, "admin/produits");
    const cree = donnees.produits.find((/** @type {ProduitApi} */ produit) => produit.nom === nom);
    crees.push(cree.id);
    expect(cree.images).toHaveLength(1);
    expect(cree.images[0].chemin).toMatch(/^uploads\/produits\/produit-\d+-[0-9a-f]+\.jpg$/);

    await ligneProduit(page, nom).getByRole("button", { name: "Modifier" }).click();
    const vignette = page.locator('[data-zone="images"] img');
    await expect(vignette).toHaveCount(1);
    await expect(vignette).toHaveAttribute("src", /uploads\/produits\//);

    await page.locator('[data-zone="images"]').getByRole("button", { name: "Supprimer l\'image" }).click();
    await expect(page.getByText("Image supprimée.")).toBeVisible();
    await expect(page.locator('[data-zone="images"] img')).toHaveCount(0);
  });

  test("CA — Je peux fixer le prix, le stock et le seuil d'alerte", async ({ page }) => {
    const nom = nomUnique("Produit stock");
    await page.getByRole("button", { name: "Nouveau produit" }).click();
    await remplirFormulaire(page, { nom, prix: 7.25, stock: 2, seuil: 6 });
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText(`Produit « ${nom} » enregistré.`)).toBeVisible();

    const { donnees } = await api(page, "admin/produits");
    const cree = donnees.produits.find((/** @type {ProduitApi} */ produit) => produit.nom === nom);
    crees.push(cree.id);
    expect(cree.prix).toBe("7.25");
    expect(cree.stock).toBe(2);
    expect(cree.seuil_alerte).toBe(6);
    await expect(ligneProduit(page, nom)).toContainText("Bientôt épuisé");
  });

  test("Validation — un nom vide ou un prix négatif est refusé", async ({ page }) => {
    await page.getByRole("button", { name: "Nouveau produit" }).click();
    const formulaire = page.locator("form").first();

    await formulaire.locator('select[name="categorieId"]').selectOption({ label: "Bricolage" });
    await formulaire.locator('input[name="prix"]').fill("12");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.locator('[data-zone="message"]')).toHaveText("Le nom du produit est obligatoire.");

    await formulaire.locator('input[name="nom"]').fill("Produit invalide");
    await formulaire.locator('input[name="prix"]').fill("-3");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.locator('[data-zone="message"]')).toHaveText(/Le prix doit être un nombre positif/);

    const { donnees } = await api(page, "admin/produits");
    expect(
      donnees.produits.find((/** @type {ProduitApi} */ produit) => produit.nom === "Produit invalide")
    ).toBeUndefined();
  });

  test("DoD — CRUD complet des produits (API)", async ({ page }) => {
    const nom = nomUnique("Produit CRUD");
    const creation = await api(page, "admin/produits", {
      method: "POST",
      body: produitValide(nom),
    });
    expect(creation.statut).toBe(201);
    const id = creation.donnees.produit.id;
    crees.push(id);

    const liste = await api(page, "admin/produits");
    expect(liste.statut).toBe(200);
    expect(liste.donnees.produits.some((/** @type {ProduitApi} */ produit) => produit.id === id)).toBe(true);

    const modification = await api(page, `admin/produits/${id}`, {
      method: "PUT",
      body: produitValide(`${nom} édité`, { stock: 9, seuil_alerte: 1 }),
    });
    expect(modification.statut).toBe(200);
    expect(modification.donnees.produit.nom).toBe(`${nom} édité`);
    expect(modification.donnees.produit.stock).toBe(9);

    const suppression = await api(page, `admin/produits/${id}`, { method: "DELETE" });
    expect(suppression.statut).toBe(200);
    crees = crees.filter((produitId) => produitId !== id);
  });

  test("DoD — Téléversement et redimensionnement des images (API)", async ({ page }) => {
    const creation = await api(page, "admin/produits", {
      method: "POST",
      body: produitValide(nomUnique("Produit redim")),
    });
    const id = creation.donnees.produit.id;
    crees.push(id);

    const image = `data:image/png;base64,${PNG_1X1.toString("base64")}`;
    const ajout = await api(page, `admin/produits/${id}/images`, {
      method: "POST",
      body: { image, texte_alternatif: creation.donnees.produit.nom },
    });
    expect(ajout.statut).toBe(201);
    expect(ajout.donnees.image.chemin).toMatch(/\.jpg$/);

    const texte = `data:text/plain;base64,${Buffer.from("pas une image").toString("base64")}`;
    const refus = await api(page, `admin/produits/${id}/images`, {
      method: "POST",
      body: { image: texte },
    });
    expect(refus.statut).toBe(400);
  });

  test("Droits — un visiteur sans session est refusé (401)", async ({ page }) => {
    await api(page, "logout", { method: "POST" });
    const { statut } = await api(page, "admin/produits");
    expect(statut).toBe(401);
  });

  test("Droits — un client connecté est refusé (403)", async ({ page }) => {
    await api(page, "logout", { method: "POST" });
    await api(page, "login", { method: "POST", body: COMPTES.client });
    const { statut } = await api(page, "admin/produits");
    expect(statut).toBe(403);
    const ecriture = await api(page, "admin/produits", {
      method: "POST",
      body: produitValide("Interdit"),
    });
    expect(ecriture.statut).toBe(403);
  });

  test("Serveur — une référence déjà utilisée est refusée (409)", async ({ page }) => {
    const reference = String(Math.floor(1000000 + Math.random() * 8999999));
    const premiere = await api(page, "admin/produits", {
      method: "POST",
      body: produitValide(nomUnique("Produit ref"), { reference }),
    });
    expect(premiere.statut).toBe(201);
    crees.push(premiere.donnees.produit.id);

    const doublon = await api(page, "admin/produits", {
      method: "POST",
      body: produitValide(nomUnique("Doublon"), { reference }),
    });
    expect(doublon.statut).toBe(409);
  });

  test("Serveur — un stock négatif ou une catégorie inconnue est refusé (400)", async ({ page }) => {
    const negatif = await api(page, "admin/produits", {
      method: "POST",
      body: produitValide(nomUnique("Stock neg"), { stock: -2 }),
    });
    expect(negatif.statut).toBe(400);

    const inconnue = await api(page, "admin/produits", {
      method: "POST",
      body: produitValide(nomUnique("Cat inconnue"), { categorie_id: 999 }),
    });
    expect(inconnue.statut).toBe(400);
  });

  test("Serveur — modifier ou supprimer un produit absent renvoie 404", async ({ page }) => {
    const modification = await api(page, "admin/produits/999999", {
      method: "PUT",
      body: produitValide("Produit absent"),
    });
    expect(modification.statut).toBe(404);
    const suppression = await api(page, "admin/produits/999999", { method: "DELETE" });
    expect(suppression.statut).toBe(404);
  });

  test("Serveur — le slug reste stable après modification", async ({ page }) => {
    const nom = nomUnique("Slug stable");
    const creation = await api(page, "admin/produits", {
      method: "POST",
      body: produitValide(nom),
    });
    const id = creation.donnees.produit.id;
    crees.push(id);
    const slug = creation.donnees.produit.slug;

    const modification = await api(page, `admin/produits/${id}`, {
      method: "PUT",
      body: produitValide(`${nom} autre nom`),
    });
    expect(modification.donnees.produit.slug).toBe(slug);
  });

  test("Page — un visiteur non connecté voit le message d'accès réservé", async ({ page }) => {
    await api(page, "logout", { method: "POST" });
    await aller(page, "admin/produits");
    await attendreApp(page);
    await expect(page.getByText("Cette page est réservée à l'administrateur.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Nouveau produit" })).toBeHidden();
  });

  test("CA — Je peux trier et choisir le nombre de produits par page", async ({ page }) => {
    const { statut, donnees: initial } = await api(page, "admin/produits?page=1");
    expect(statut).toBe(200);
    expect(initial.total).toBeGreaterThan(0);
    await expect(page.locator('select[name="tri"]')).toHaveValue(initial.tri);
    await expect(page.locator('select[name="parPage"]')).toHaveValue(String(initial.parPage));
    await expect(page.locator("tbody tr")).toHaveCount(Math.min(initial.total, initial.parPage));

    const reponseTri = page.waitForResponse((reponse) =>
      reponse.url().includes("/api/admin/produits?") && reponse.url().includes("tri=prix")
    );
    await page.locator('select[name="tri"]').selectOption("prix");
    const listeTriee = await (await reponseTri).json();
    expect(listeTriee.tri).toBe("prix");
    await expect(page.locator("tbody tr").first().locator("td").first()).toHaveText(listeTriee.produits[0].nom);

    const reponseTaille = page.waitForResponse((reponse) =>
      reponse.url().includes("/api/admin/produits?") && reponse.url().includes("parPage=24")
    );
    await page.locator('select[name="parPage"]').selectOption("24");
    const listePaginee = await (await reponseTaille).json();
    await expect(page.locator("tbody tr")).toHaveCount(Math.min(listePaginee.total, 24));
    await expect(page.getByText(`Page 1 sur ${listePaginee.pagesTotal}`, { exact: true })).toBeVisible();
  });

  test("CA — Je peux trier par catégorie, stock et état", async ({ page }) => {
    const selectTri = page.locator('select[name="tri"]');

    for (const tri of ["categorie", "stock", "etat"]) {
      const reponseTri = page.waitForResponse((reponse) =>
        reponse.url().includes("/api/admin/produits?") && reponse.url().includes(`tri=${tri}`)
      );
      await selectTri.selectOption(tri);
      const liste = await (await reponseTri).json();
      expect(liste.tri).toBe(tri);
      await expect(page.locator("tbody tr").first().locator("td").first()).toHaveText(liste.produits[0].nom);

      if (tri === "categorie") {
        for (let index = 1; index < liste.produits.length; index++) {
          expect(
            liste.produits[index - 1].categorie.localeCompare(liste.produits[index].categorie, "fr", {
              sensitivity: "base",
            })
          ).toBeLessThanOrEqual(0);
        }
      } else if (tri === "stock") {
        for (let index = 1; index < liste.produits.length; index++) {
          expect(liste.produits[index - 1].stock).toBeLessThanOrEqual(liste.produits[index].stock);
        }
      } else {
        /** @param {ProduitApi} produit */
        const rangEtat = (produit) =>
          produit.stock <= 0 ? 0 : produit.stock <= produit.seuil_alerte ? 1 : 2;
        for (let index = 1; index < liste.produits.length; index++) {
          expect(rangEtat(liste.produits[index - 1])).toBeLessThanOrEqual(rangEtat(liste.produits[index]));
        }
      }
    }
  });
});