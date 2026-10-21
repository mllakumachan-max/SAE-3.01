import { getRequest } from "../lib/api-request.js";

let StatsData = {};

/**
 * Statistiques du catalogue : GET /api/admin/stats, réservé aux
 * administrateurs (401 sans connexion, 403 sans le rôle admin).
 *
 * { totalProduits: 60, prixMoyen: 9.95, prixMinimum: 0.99,
 *   prixMaximum: 49.99,
 *   parCategorie: [ { categorie: "Habitat", nombre: 11 }, ... ] }
 */
StatsData.fetch = async function () {
  return getRequest("admin/stats");
};

export { StatsData };
