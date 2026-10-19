import { getRequest } from "../lib/api-request.js";

let ProduitData = {};

/**
 * Une page du catalogue : GET /api/produits?page=…
 *
 * reglages ({ tri, parPage }) n'est fourni qu'après un choix de l'utilisateur.
 * Sans lui, le serveur applique les préférences qu'il a mémorisées.
 *
 * La réponse contient les produits et les réglages réellement appliqués :
 * { produits, tri, parPage, page, pagesTotal, total }
 */
ProduitData.fetchPage = async function (page, reglages) {
  let uri = `produits?page=${page}`;

  if (reglages !== undefined) {
    uri += `&tri=${encodeURIComponent(reglages.tri)}&parPage=${reglages.parPage}`;
  }

  return getRequest(uri);
};

export { ProduitData };
