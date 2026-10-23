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
    stock: produit.stock,
    seuilAlerte: produit.seuil_alerte,
    src: urlImage(produit.src),
    options: (produit.options || []).map((option) => ({
      id: option.id,
      nom: option.nom,
      ordre: option.ordre,
      valeurs: (option.valeurs || []).map((valeur) => ({
        id: valeur.id,
        valeur: valeur.valeur,
        // Les DECIMAL arrivent en texte : on les convertit en nombre.
        prixSupplement: valeur.prix_supplement === null ? 0 : Number(valeur.prix_supplement),
        ordre: valeur.ordre,
      })),
    })),
  };
};

/**
 * Met une image de galerie sous la forme attendue par la vue : une adresse
 * utilisable, un texte alternatif et son ordre d'affichage.
 */
let mettreImageEnForme = function (image) {
  return {
    chemin: image.chemin,
    src: urlImage(image.chemin),
    alt: image.texte_alternatif ?? "",
    ordre: Number(image.ordre ?? 0),
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
    options: (reponse.options ?? []).map((option) => ({
      id: option.id,
      nom: option.nom,
      ordre: option.ordre,
      valeurs: (option.valeurs ?? []).map((valeur) => ({
        id: valeur.id,
        valeur: valeur.valeur,
        // Les DECIMAL arrivent en texte : on les convertit en nombre.
        prixSupplement: valeur.prix_supplement === null ? 0 : Number(valeur.prix_supplement),
        ordre: valeur.ordre,
      })),
    })),
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
 * Ajoute une ou plusieurs images : POST /api/admin/produits/:id/images
 * donnees : [{ image: "data:image/…;base64,…", texte_alternatif }, ...]
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

/**
 * Liste les options d'un produit pour l'admin :
 * GET /api/admin/produits/:id/options  -> { options }
 */
ProduitData.fetchAdminOptions = function (id) {
  return getRequest(`admin/produits/${encodeURIComponent(id)}/options`).then((reponse) => reponse.options);
};

/**
 * Crée une option pour un produit :
 * POST /api/admin/produits/:id/options -> { options }
 */
ProduitData.creerOption = function (produitId, donnees) {
  return postRequest(`admin/produits/${encodeURIComponent(produitId)}/options`, donnees).then((reponse) => reponse.options);
};

/**
 * Modifie une option :
 * PUT /api/admin/produits/options/:id -> { options }
 */
ProduitData.modifierOption = function (id, donnees) {
  return putRequest(`admin/produits/options/${encodeURIComponent(id)}`, donnees).then((reponse) => reponse.options);
};

/**
 * Supprime une option (et ses valeurs) :
 * DELETE /api/admin/produits/options/:id -> { options }
 */
ProduitData.supprimerOption = function (id) {
  return deleteRequest(`admin/produits/options/${encodeURIComponent(id)}`).then((reponse) => reponse.options);
};

/**
 * Ajoute une valeur à une option :
 * POST /api/admin/produits/options/:id/valeurs -> { options }
 */
ProduitData.ajouterValeur = function (optionId, donnees) {
  return postRequest(`admin/produits/options/${encodeURIComponent(optionId)}/valeurs`, donnees).then((reponse) => reponse.options);
};

/**
 * Modifie une valeur d'option :
 * PUT /api/admin/produits/valeurs/:id -> { options }
 */
ProduitData.modifierValeur = function (id, donnees) {
  return putRequest(`admin/produits/valeurs/${encodeURIComponent(id)}`, donnees).then((reponse) => reponse.options);
};

/**
 * Supprime une valeur d'option :
 * DELETE /api/admin/produits/valeurs/:id -> { options }
 */
ProduitData.supprimerValeur = function (id) {
  return deleteRequest(`admin/produits/valeurs/${encodeURIComponent(id)}`).then((reponse) => reponse.options);
};

export { ProduitData };