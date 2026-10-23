// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api, url } from "./helpers.js";
import { COMPTES } from "./constantes.js";

/**
 * US CMD-c — Authentification
 *
 * En tant que visiteur, je veux créer un compte et me connecter afin de pouvoir
 * finaliser mes achats.
 *
 * Critères d'acceptation
 *  - Je peux créer un compte avec email et mot de passe
 *  - Je peux me connecter avec mes identifiants
 *  - Je peux me déconnecter
 *  - Mon mot de passe est stocké de manière sécurisée
 *  - Je reçois des messages d'erreur clairs en cas de problème
 *  - Ma session est maintenue lors de la navigation
 *
 * Definition of Done
 *  - Hashage sécurisé des mots de passe (bcrypt ou équivalent)
 *  - Gestion sécurisée des sessions (identifiant de session régénéré à la connexion)
 *
 * Les formulaires de connexion et de création de compte sont affichés depuis le
 * panier, au moment de valider la commande. Un test de non-superposition des
 * formulaires est ajouté en fin de fichier : il ne figure pas au sujet, mais il
 * couvre le bug corrigé dans la page panier.
 */

const MESSAGE_SUCCES = "Votre commande a été validée.";

/** Identifiant unique pour chaque création de compte : la base refuse les doublons. */
function emailUnique() {
  return `test.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@exemple.fr`;
}

/**
 * Ajoute le premier produit au panier, puis ouvre le panier.
 * @param {import("@playwright/test").Page} page
 */
async function preparerPanier(page) {
  const { donnees } = await api(page, "produits?page=1");
  const produit = donnees.produits[0];
  expect(produit).toBeTruthy();

  await aller(page, `produit/${produit.slug}`);
  await page.locator('button[data-action="ajouter-panier"]').click();
  await aller(page, "panier");
}

/**
 * La boîte de dialogue ouverte au-dessus du panier.
 * @param {import("@playwright/test").Page} page
 */
function dialogue(page) {
  return page.getByRole("dialog");
}

test.describe("US CMD-c — Authentification", () => {
  test.beforeEach(async ({ page }) => {
    await aller(page);
    await page.evaluate(() => window.localStorage.clear());
    await preparerPanier(page);
    await page.getByRole("button", { name: /valider/i }).first().click();
  });

  test("CA — Je peux créer un compte avec email et mot de passe", async ({ page }) => {
    const email = emailUnique();
    const mdp = "motdepasse-test-1";

    await dialogue(page).getByRole("button", { name: "Créer un compte" }).click();
    await dialogue(page).getByLabel("Adresse email").fill(email);
    await dialogue(page).getByLabel("Mot de passe", { exact: true }).fill(mdp);
    await dialogue(page).getByLabel("Confirmer le mot de passe").fill(mdp);
    await dialogue(page).getByRole("button", { name: "Créer mon compte" }).click();

    // Le compte est créé, puis connecté : la commande est validée.
    await expect(page.getByText(MESSAGE_SUCCES)).toBeVisible();
    await expect(dialogue(page)).toHaveCount(0);
  });

  test("CA — Je peux me connecter avec mes identifiants", async ({ page }) => {
    // Référence : l'API accepte bien ces identifiants.
    const reference = await api(page, "login", {
      method: "POST",
      body: { login: COMPTES.client.login, mdp: COMPTES.client.mdp },
    });
    expect(reference.statut).toBe(200);
    expect(reference.donnees.connecte).toBe(true);

    await dialogue(page).getByLabel("Adresse email").fill(COMPTES.client.login);
    await dialogue(page).getByLabel("Mot de passe").fill(COMPTES.client.mdp);
    await dialogue(page).getByRole("button", { name: "Me connecter" }).click();

    await expect(page.getByText(MESSAGE_SUCCES)).toBeVisible();
    await expect(dialogue(page)).toHaveCount(0);
  });

  test("CA — Je peux me déconnecter", async ({ page }) => {
    await api(page, "login", {
      method: "POST",
      body: { login: COMPTES.client.login, mdp: COMPTES.client.mdp },
    });

    const { statut, donnees } = await api(page, "logout", { method: "POST" });
    expect(statut).toBe(200);
    expect(donnees.connecte).toBe(false);
  });

  test("CA — Mon mot de passe est stocké de manière sécurisée", async ({ page }) => {
    // Le serveur ne renvoie jamais le mot de passe en clair, ni à la création
    // ni à la connexion : la réponse ne doit contenir aucune trace de lui.
    const mdp = "motdepasse-secret-42";
    const { donnees } = await api(page, "register", {
      method: "POST",
      body: { login: emailUnique(), mdp, mdp_confirmation: mdp },
    });

    expect(JSON.stringify(donnees)).not.toContain(mdp);
  });

  test("CA — Je reçois des messages d'erreur clairs en cas de problème", async ({ page }) => {
    // Référence : mauvais mot de passe refusé avec un statut 401.
    const reference = await api(page, "login", {
      method: "POST",
      body: { login: COMPTES.client.login, mdp: "mauvais-mot-de-passe" },
    });
    expect(reference.statut).toBe(401);
    expect(reference.donnees.erreur).toBeTruthy();

    await dialogue(page).getByLabel("Adresse email").fill(COMPTES.client.login);
    await dialogue(page).getByLabel("Mot de passe").fill("mauvais-mot-de-passe");
    await dialogue(page).getByRole("button", { name: "Me connecter" }).click();

    await expect(page.getByText(reference.donnees.erreur)).toBeVisible();
  });

  test("CA — Ma session est maintenue lors de la navigation", async ({ page }) => {
    await api(page, "login", {
      method: "POST",
      body: { login: COMPTES.client.login, mdp: COMPTES.client.mdp },
    });

    const cookiesAvant = await page.context().cookies();
    await aller(page, "panier");
    await aller(page);
    const cookiesApres = await page.context().cookies();

    expect(cookiesAvant.length).toBeGreaterThan(0);
    expect(cookiesApres.map((c) => c.name)).toEqual(cookiesAvant.map((c) => c.name));
  });

  test("DoD — Le hashage des mots de passe permet une connexion après une déconnexion", async ({ page }) => {
    // Un mot de passe haché doit encore être vérifié correctement : on crée un
    // compte, on se déconnecte, puis on se reconnecte avec le même mot de passe.
    const login = emailUnique();
    const mdp = "motdepasse-hash-123";

    const creation = await api(page, "register", {
      method: "POST",
      body: { login, mdp, mdp_confirmation: mdp },
    });
    expect(creation.statut).toBe(201);

    await api(page, "logout", { method: "POST" });
    const connexion = await api(page, "login", { method: "POST", body: { login, mdp } });
    expect(connexion.statut).toBe(200);
  });

  test("DoD — L'identifiant de session change à la connexion", async ({ page }) => {
    const cookieSession = async () =>
      (await page.context().cookies()).find((c) => /sess/i.test(c.name))?.value ?? null;

    // Une session anonyme existe avant la connexion.
    await api(page, "produits?page=1");
    const avant = await cookieSession();
    expect(avant).toBeTruthy();

    await api(page, "login", {
      method: "POST",
      body: { login: COMPTES.client.login, mdp: COMPTES.client.mdp },
    });
    const apres = await cookieSession();

    expect(apres).toBeTruthy();
    expect(apres).not.toBe(avant);
  });

  test("Bug — Passer de la connexion à la création de compte ne superpose pas les formulaires", async ({ page }) => {
    await page.evaluate(() => {
      /** @type {any} */ (window).__marqueur = "vivant";
    });

    await expect(page.getByRole("heading", { name: "Connexion client" })).toBeVisible();
    await dialogue(page).getByRole("button", { name: "Créer un compte" }).click();

    // L'ancien formulaire a disparu : un seul dialogue, celui de l'inscription.
    await expect(page.getByRole("heading", { name: "Connexion client" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Créer un compte client" })).toBeVisible();
    await expect(dialogue(page)).toHaveCount(1);

    // Pas de rechargement de la page pendant le changement de formulaire.
    expect(await page.evaluate(() => /** @type {any} */ (window).__marqueur)).toBe("vivant");
  });
});
