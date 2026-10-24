// @ts-check
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { aller, api, connecter, deconnecter, url } from "./helpers.js";
import { COMPTES } from "./constantes.js";

/**
 * US GOF-b — Back-office
 *
 * En tant qu'administrateur, je veux accéder à un back-office sécurisé afin de
 * gérer le site.
 *
 * Critères d'acceptation
 *  - J'accède au back-office par une URL dédiée (/admin)
 *  - L'authentification des administrateurs est séparée de celle des clients
 *  - La page d'accueil du back-office affiche quelques indicateurs simples
 *    (nombre de produits, nombre de commandes)
 *  - J'ai une navigation claire entre les sections d'administration
 *  - Le design est cohérent avec le front-office mais distinct
 *
 * Definition of Done
 *  - Compte administrateur de test en base de données
 *  - Aucune page /admin n'est accessible sans authentification administrateur
 */

/**
 * Se connecte avec le formulaire d'administration de la page.
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} login
 * @param {string} mdp
 */
async function seConnecter(page, login, mdp) {
  await page.locator('input[name="login"]').fill(login);
  await page.locator('input[name="mdp"]').fill(mdp);
  await page.getByRole("button", { name: "Se connecter" }).click();
}

/**
 * La valeur d'un indicateur du tableau de bord : le nombre affiché au-dessus
 * de son libellé.
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} libelle
 * @returns {Promise<number>}
 */
async function indicateur(page, libelle) {
  const carte = page.getByText(libelle, { exact: true }).locator("..");
  const texte = (await carte.locator("div").first().innerText()).trim();
  return Number(texte);
}

test.describe("US GOF-b — Back-office", () => {
  test.beforeEach(async ({ page }) => {
    // Les appels à l'API sont faits depuis la page : ils ont besoin d'une
    // origine, celle du site.
    await aller(page, "admin");
  });

  test("CA — J'accède au back-office par une URL dédiée (/admin)", async ({ page }) => {
    await expect(page).toHaveURL(url("admin"));

    // L'en-tête de l'administration est celui du back-office, pas celui de la
    // boutique.
    await expect(page.getByRole("link", { name: /Administration/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tableau de bord" })).toHaveCount(0);
    await expect(page.locator('[data-action="deconnexion"]')).toBeHidden();

    // La boutique, elle, n'est pas là.
    await expect(page.getByRole("link", { name: "Panier" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Tous les produits" })).toHaveCount(0);
  });

  test("CA — L'authentification des administrateurs est séparée de celle des clients", async ({
    page,
  }) => {
    await aller(page, "admin");

    // La page propose son propre formulaire, celui de l'administration.
    await expect(page.getByRole("heading", { name: "Connexion administrateur" })).toBeVisible();
    await expect(page.locator('input[name="login"]')).toBeVisible();
    await expect(page.locator('input[name="mdp"]')).toBeVisible();

    // Un compte client ne donne pas accès au back-office.
    const client = await connecter(page, COMPTES.client.login, COMPTES.client.mdp);
    expect(client.statut).toBe(200);
    expect(client.donnees.role).toBe("user");

    const statsClient = await api(page, "admin/stats");
    expect(statsClient.statut).toBe(403);

    await deconnecter(page);

    // Un compte administrateur, lui, y donne accès.
    const admin = await connecter(page, COMPTES.admin.login, COMPTES.admin.mdp);
    expect(admin.statut).toBe(200);
    expect(admin.donnees.role).toBe("admin");

    const statsAdmin = await api(page, "admin/stats");
    expect(statsAdmin.statut).toBe(200);
  });

  test("CA — Le tableau de bord affiche des indicateurs simples", async ({ page }) => {
    await aller(page, "admin");
    await seConnecter(page, COMPTES.admin.login, COMPTES.admin.mdp);

    // L'indicateur « produits » correspond au nombre de produits du
    // catalogue.
    const { donnees: catalogue } = await api(page, "produits?page=1");
    await expect(page.getByText("Produits au catalogue", { exact: true })).toBeVisible();
    expect(await indicateur(page, "Produits au catalogue")).toBe(catalogue.total);

    // L'indicateur « commandes » est affiché. Il vaut 0 tant que la
    // commande n'est pas reprise dans les statistiques.
    await expect(page.getByText("Commandes passées", { exact: true })).toBeVisible();
    const commandes = await indicateur(page, "Commandes passées");
    expect(Number.isFinite(commandes)).toBe(true);
    expect(commandes).toBeGreaterThanOrEqual(0);
  });

  test("CA — La navigation entre les sections d'administration est claire", async ({ page }) => {
    await aller(page, "admin");
    await seConnecter(page, COMPTES.admin.login, COMPTES.admin.mdp);

    const menu = page.locator("header nav");

    for (const section of [
      { nom: "Tableau de bord", lien: "/admin" },
      { nom: "Produits", lien: "/admin/produits" },
      { nom: "Catégories", lien: "/admin/categories" },
      { nom: "Commandes", lien: "/admin/commandes" },
    ]) {
      const lien = menu.getByRole("link", { name: section.nom });
      await expect(lien).toBeVisible();
      // Le lien pointe vers la route de la section, sous le chemin du projet.
      await expect(lien).toHaveAttribute("href", new URL(url(section.lien)).pathname);
    }
  });

  test("CA — La session reste active pendant la navigation dans le back-office", async ({ page }) => {
    await seConnecter(page, COMPTES.admin.login, COMPTES.admin.mdp);

    await page.locator('header nav a[href$="/admin/produits"]').click();
    await expect(page.getByRole("heading", { name: "Gestion des produits" })).toBeVisible();
    await expect(page.locator('header nav a[href$="/admin/categories"]')).toBeVisible();
    await expect(page.locator('[data-action="deconnexion"]')).toBeVisible();
    expect((await api(page, "admin/stats")).statut).toBe(200);

    await page.locator('header nav a[href$="/admin/categories"]').click();
    await expect(page.getByRole("heading", { name: "Gestion des catégories" })).toBeVisible();
    await expect(page.locator('header nav a[href$="/admin/produits"]')).toBeVisible();
    expect((await api(page, "admin/stats")).statut).toBe(200);

    await page.locator('header nav a[href$="/admin"]').click();
    await expect(page.getByText("Produits au catalogue", { exact: true })).toBeVisible();

    await page.getByRole("link", { name: "Voir le site" }).click();
    await expect(page.getByRole("link", { name: "Panier" })).toBeVisible();
    expect((await api(page, "admin/stats")).statut).toBe(200);

    await aller(page, "admin");
    await expect(page.getByText("Produits au catalogue", { exact: true })).toBeVisible();
    await expect(page.locator('[data-action="deconnexion"]')).toBeVisible();
  });

  test("CA — Le design est cohérent avec le front-office mais distinct", async ({ page }) => {
    await aller(page, "admin");

    // Même identité graphique que la boutique : le même logo.
    const logoAdmin = page.locator("header img").first();
    await expect(logoAdmin).toBeVisible();

    await aller(page);
    const logoBoutique = page.locator("header img").first();
    await expect(logoBoutique).toBeVisible();

    expect(await logoAdmin.getAttribute("src")).toBe(await logoBoutique.getAttribute("src"));

    // Mais un back-office distinct : pas de panier, pas de barre de
    // catégories, et un lien pour revenir à la boutique.
    await aller(page, "admin");
    await expect(page.getByRole("link", { name: /Voir le site/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Panier" })).toHaveCount(0);
  });

  test("DoD — Un compte administrateur de test existe en base de données", async ({ page }) => {
    // Le compte est déclaré par le script d'initialisation de la base.
    const schema = readFileSync(new URL("../../sql/sae301.sql", import.meta.url), "utf-8");
    expect(schema).toMatch(/CREATE TABLE UTILISATEUR/);
    expect(schema).toMatch(/INSERT INTO UTILISATEUR/);
    expect(schema).toMatch(/'admin'/);

    // Et il est accepté par l'API, avec le rôle administrateur.
    const reponse = await connecter(page, COMPTES.admin.login, COMPTES.admin.mdp);
    expect(reponse.statut).toBe(200);
    expect(reponse.donnees.role).toBe("admin");
  });

  test("DoD — Aucune page /admin n'est accessible sans authentification administrateur", async ({
    page,
  }) => {
    // Sans session : l'API refuse, et la page n'affiche aucune donnée.
    await aller(page, "admin");
    await expect(page.getByRole("heading", { name: "Connexion administrateur" })).toBeVisible();
    await expect(page.getByText("Produits au catalogue", { exact: true })).toHaveCount(0);

    const sansSession = await api(page, "admin/stats");
    expect(sansSession.statut).toBe(403);

    // Avec une session de client : l'API refuse toujours.
    await connecter(page, COMPTES.client.login, COMPTES.client.mdp);
    const avecClient = await api(page, "admin/stats");
    expect(avecClient.statut).toBe(403);
    await deconnecter(page);

    // Avec une session d'administrateur : l'accès est accordé.
    await seConnecter(page, COMPTES.admin.login, COMPTES.admin.mdp);
    await expect(page.getByText("Produits au catalogue", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tableau de bord" })).toBeVisible();
    await expect(page.locator('[data-action="deconnexion"]')).toBeVisible();
    await expect(page.getByRole("heading", { name: "Connexion administrateur" })).toHaveCount(0);
    await expect(page.locator('input[name="login"]')).toHaveCount(0);
    expect((await api(page, "admin/stats")).statut).toBe(200);

    // Après la déconnexion, l'accès est de nouveau coupé.
    await page.locator('[data-action="deconnexion"]').click();
    await expect(page).toHaveURL(url("admin"));
    await expect(page.getByRole("heading", { name: "Connexion administrateur" })).toBeVisible();
    await expect(page.locator('input[name="login"]')).toBeVisible();
    await expect(page.getByRole("link", { name: "Tableau de bord" })).toHaveCount(0);
    await expect(page.locator('[data-action="deconnexion"]')).toBeHidden();
    expect((await api(page, "admin/stats")).statut).toBe(403);
  });
});
