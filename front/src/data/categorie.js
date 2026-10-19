import { getRequest } from "../lib/api-request.js";

let CategorieData = {
  /**
   * Liste les catégories racines pour la navigation du client.
   */
  fetchAll: async function () {
    let reponse = await getRequest("categories");
    return Array.isArray(reponse) ? reponse : (reponse.categories ?? []);
  },
};

export { CategorieData };
