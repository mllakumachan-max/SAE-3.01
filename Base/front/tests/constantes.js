/**
 * Constantes partagées par la configuration Playwright et les tests.
 *
 * L'adresse du site est celle que Vite sert en développement : le dossier du
 * projet sur le serveur est un préfixe de toutes les adresses.
 *
 *   http://localhost:5173/~ribatet1/SAE-3.01/Base/
 *
 * En production, la même application est servie par Apache :
 *
 *   https://mmi.unilim.fr/~ribatet1/SAE-3.01/Base/
 *
 * La variable d'environnement SAE301_BASE_URL permet de lancer la suite
 * contre une autre adresse (le site déployé, par exemple).
 */
export const BASE_URL =
  process.env.SAE301_BASE_URL ?? "http://localhost:5173/~ribatet1/SAE-3.01/Base/";

/**
 * Racine de l'API. Le back est servi au même endroit que le front, sous le
 * chemin « api/ » : en développement, Vite relaie ces appels vers le serveur.
 */
export const API_URL = new URL("api/", BASE_URL).toString();

/** Comptes de test utilisés par la suite. */
export const COMPTES = {
  admin: { login: "admin", mdp: "motdepasse" },
  client: { login: "alice", mdp: "azerty" },
};
