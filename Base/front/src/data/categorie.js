import { deleteRequest, getRequest, postRequest, putRequest } from "../lib/api-request.js";

/**
 * Traduit une catégorie de l'API vers les noms attendus par les composants.
 * L'API parle en snake_case (libelle, nb_produits), les composants en français courant.
 */
function versVue(categorie) {
  return {
    id: categorie.id,
    nom: categorie.libelle,
    description: categorie.description ?? "",
    nbProduits: categorie.nb_produits ?? 0,
  };
}

let CategorieData = {
  /**
   * Liste les catégories racines pour la navigation du client.
   */
  fetchAll: async function () {
    let reponse = await getRequest("categories");
    return Array.isArray(reponse) ? reponse : (reponse.categories ?? []);
  },

  /**
   * Liste toutes les catégories pour l'administrateur (GET /api/admin/categories).
   */
  fetchAdminListe: async function (tri = "nom") {
    let reponse = await getRequest(`admin/categories?tri=${encodeURIComponent(tri)}`);
    return reponse.categories.map(versVue);
  },

  /** Liste paginée des catégories pour leur écran de gestion Admin. */
  fetchAdminPage: async function (page, tri, parPage) {
    let uri = `admin/categories?page=${page}&tri=${encodeURIComponent(tri)}&parPage=${parPage}`;
    let reponse = await getRequest(uri);
    return { ...reponse, categories: reponse.categories.map(versVue) };
  },

  /**
   * Crée une catégorie (POST /api/admin/categories). donnees : { libelle, description }
   */
  creer: async function (donnees) {
    let reponse = await postRequest("admin/categories", donnees);
    return versVue(reponse.categorie);
  },

  /**
   * Modifie une catégorie (PUT /api/admin/categories/:id).
   */
  modifier: async function (id, donnees) {
    let reponse = await putRequest(`admin/categories/${encodeURIComponent(id)}`, donnees);
    return versVue(reponse.categorie);
  },

  /**
   * Supprime une catégorie (DELETE /api/admin/categories/:id).
   * cibleId : catégorie qui reçoit les produits, obligatoire si la catégorie en contient.
   */
  supprimer: async function (id, cibleId = null) {
    let corps = cibleId === null ? {} : { cible_id: Number(cibleId) };
    return deleteRequest(`admin/categories/${encodeURIComponent(id)}`, corps);
  },
};

export { CategorieData };
