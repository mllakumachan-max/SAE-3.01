
import { deleteRequest, getRequest, postRequest, putRequest } from "../lib/api-request.js";
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
    prix_unitaire: produit.prix_unitaire === null ? null : Number(produit.prix_unitaire),
    src: urlImage(produit.src),
  };
};

/**
 * Met une image de galerie sous la forme attendue par la vue : une adresse
 * utilisable et un texte alternatif.
 */
let mettreImageEnForme = function (image) {
  return {
    src: urlImage(image.chemin),
    alt: image.texte_alternatif ?? "",
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
ProduitData.fetchPage = async function (page, reglages, categorieSlug = null) {
  let uri = `produits?page=${page}`;

  if (categorieSlug !== null && categorieSlug !== undefined && categorieSlug !== "") {
    uri += `&categorie=${encodeURIComponent(categorieSlug)}`;
  }

  if (reglages !== undefined) {
    uri += `&tri=${encodeURIComponent(reglages.tri)}&parPage=${reglages.parPage}`;
  }

  let reponse = await getRequest(uri);

  return { ...reponse, produits: reponse.produits.map(mettreEnForme) };
};

/**
 * La fiche d'un produit : GET /api/produits/:slug
 *
 * Le slug est l'adresse publique du produit, celle qui figure dans l'URL de
 * la page. La réponse contient le produit et sa galerie d'images :
 * { produit, galerie }
 */
ProduitData.fetchBySlug = async function (slug) {
  let reponse = await getRequest(`produits/${encodeURIComponent(slug)}`);

  return {
    ...reponse,
    produit: mettreEnForme(reponse.produit),
    galerie: (reponse.galerie ?? []).map(mettreImageEnForme),
  };
};

/**
 * Traduit un produit du back-office vers les noms utilisés par les formulaires
 * et les tableaux. Les DECIMAL, reçus en texte, deviennent des nombres.
 */
function versVueAdmin(produit) {
  return {
    id: produit.id,
    reference: produit.reference,
    slug: produit.slug,
    nom: produit.nom,
    categorieId: produit.categorie_id,
    categorie: produit.categorie,
    marque: produit.marque ?? "",
    format: produit.format ?? "",
    description: produit.description ?? "",
    prix: Number(produit.prix),
    prixUnitaire: produit.prix_unitaire === null ? "" : Number(produit.prix_unitaire),
    unitePrix: produit.unite_prix ?? "",
    badge: produit.badge ?? "",
    stock: produit.stock,
    seuilAlerte: produit.seuil_alerte,
    images: (produit.images ?? []).map((image) => ({
      id: image.id,
      src: urlImage(image.chemin),
      alt: image.texte_alternatif ?? "",
    })),
  };
}

/**
 * Liste paginée des produits pour l'administrateur : GET /api/admin/produits
 */
ProduitData.fetchAdminListe = async function (page = 1, reglages) {
  let uri = `admin/produits?page=${page}`;

  if (reglages !== undefined) {
    uri += `&tri=${encodeURIComponent(reglages.tri)}&parPage=${reglages.parPage}`;
  }

  let reponse = await getRequest(uri);
  return { ...reponse, produits: reponse.produits.map(versVueAdmin) };
};

/**
 * Crée un produit : POST /api/admin/produits. donnees : champs en snake_case.
 */
ProduitData.creer = async function (donnees) {
  let reponse = await postRequest("admin/produits", donnees);
  return versVueAdmin(reponse.produit);
};

/**
 * Modifie un produit : PUT /api/admin/produits/:id
 */
ProduitData.modifier = async function (id, donnees) {
  let reponse = await putRequest(`admin/produits/${encodeURIComponent(id)}`, donnees);
  return versVueAdmin(reponse.produit);
};

/**
 * Supprime un produit : DELETE /api/admin/produits/:id
 */
ProduitData.supprimer = function (id) {
  return deleteRequest(`admin/produits/${encodeURIComponent(id)}`);
};

/**
 * Ajoute une image : POST /api/admin/produits/:id/images
 * donnees : { image: "data:image/…;base64,…", texte_alternatif }
 */
ProduitData.ajouterImage = function (id, donnees) {
  return postRequest(`admin/produits/${encodeURIComponent(id)}/images`, donnees);
};

/**
 * Supprime une image : DELETE /api/admin/produits/:id/images/:imageId
 */
ProduitData.supprimerImage = function (id, imageId) {
  return deleteRequest(
    `admin/produits/${encodeURIComponent(id)}/images/${encodeURIComponent(imageId)}`
  );
};

export { ProduitData };