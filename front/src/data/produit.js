
import { getRequest } from "../lib/api-request.js";
import { urlImage } from "../lib/images.js";

let ProduitData = {};

/**
 * Met un produit reçu de l'API sous la forme attendue par les composants.
 *
 * - MySQL renvoie les DECIMAL sous forme de texte ("9.95") : on les convertit
 *   en nombre, pour que l'affichage puisse les formater (9,95 €).
 * - L'API renvoie le chemin de l'image tel qu'il est en base : on le traduit
 *   en adresse réelle (voir lib/images.js).
 */
let mettreEnForme = function (produit) {
  return {
    ...produit,
    prix: Number(produit.prix),
    src: urlImage(produit.src),
  };
};

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

  let reponse = await getRequest(uri);

  return { ...reponse, produits: reponse.produits.map(mettreEnForme) };
};

export { ProduitData };