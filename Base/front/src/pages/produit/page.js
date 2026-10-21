import { ProduitData } from "../../data/produit.js";
import { htmlToFragment } from "../../lib/utils.js";
import { appliquerSeo } from "../../lib/seo.js";
import { ajouterAuPanier } from "../../lib/panier.js";
import { DetailProduitView } from "../../ui/details-produit/index.js";
import { FilArianeView } from "../../ui/fil-ariane/index.js";
import { MessageView } from "../../ui/message/index.js";
import template from "./template.html?raw";

/**
 * Page « Fiche produit ».
 *
 * L'adresse de la page est l'adresse publique du produit :
 * /produit/couette-sans-housse-easy. Le slug qu'elle contient désigne le
 * produit dans l'API.
 */

let M = {
  slug: null, // le slug lu dans l'URL
  produit: null, // le produit reçu de l'API, ou null
  galerie: [], // les images du produit, dans l'ordre d'affichage
  message: null, // { type, texte }, ou null
};

let C = {};

/**
 * Demande le produit et sa galerie, et range la réponse dans le modèle.
 */
C.charger = async function (slug) {
  try {
    const reponse = await ProduitData.fetchBySlug(slug);

    M.produit = reponse.produit;
    M.galerie = reponse.galerie;
    M.message = null;
  } catch (erreur) {
    M.produit = null;
    M.galerie = [];
    M.message = {
      type: "erreur",
      texte:
        erreur.statut === 404
          ? "Ce produit n'existe pas ou n'est plus disponible."
          : `Impossible de charger ce produit : ${erreur.message}`,
    };
  }
};

/**
 * Le produit sous la forme attendue par les composants : la galerie s'y
 * range avec lui, et les liens de retour y sont calculés.
 */
C.produitAffichage = function () {
  if (M.produit === null) return null;

  const categorie = M.produit.categorie ?? null;

  return {
    ...M.produit,
    images: M.galerie,
    lienCatalogue: "/",
    libelleCatalogue: "Tous les produits",
    lienCategorie: categorie?.slug ? `/categorie/${categorie.slug}` : "/",
    libelleCategorie: categorie?.libelle ?? "Catégorie",
  };
};

/**
 * Le fil d'Ariane : catalogue, catégorie, puis le produit.
 */
C.filAriane = function () {
  const items = [{ libelle: "Catalogue", lien: "/" }];
  const categorie = M.produit?.categorie;

  if (categorie?.slug) {
    items.push({ libelle: categorie.libelle, lien: `/categorie/${categorie.slug}` });
  }

  if (M.produit) {
    items.push({ libelle: M.produit.nom });
  }

  return items;
};

/**
 * Ajout au panier : le compteur de l'en-tête suit automatiquement, grace au
 * module panier.
 */
C.handler_ajouterPanier = function (id, quantite) {
  if (M.produit === null) return;

  ajouterAuPanier(
    {
      id: id ?? M.produit.id,
      slug: M.produit.slug,
      nom: M.produit.nom,
      prix: M.produit.prix,
      src: M.galerie[0]?.src ?? "",
    },
    quantite
  );

  M.message = { type: "succes", texte: `${M.produit.nom} a été ajouté au panier.` };

  // Seul le message est mis à jour : reconstruire toute la page ferait perdre
  // l'image affichée et la quantité choisie.
  V.majMessage();
};

/**
 * Les métadonnées de la page : c'est ce que voient les moteurs de recherche et
 * les aperçus de liens.
 */
C.majSeo = function () {
  if (M.produit === null) {
    appliquerSeo({
      titre: "Produit introuvable",
      description: "Ce produit n'existe pas ou n'est plus disponible.",
      chemin: "/",
    });
    return;
  }

  const description =
    (M.produit.description || "").slice(0, 300).trim() || `Fiche produit : ${M.produit.nom}.`;

  appliquerSeo({
    titre: M.produit.nom,
    description,
    image: M.galerie[0]?.src ?? "",
    chemin: `/produit/${M.produit.slug}`,
    type: "product",
  });
};

C.init = async function (slug) {
  M.slug = slug ?? null;

  await C.charger(M.slug);

  C.majSeo();

  return V.init();
};

let V = {};

V.racine = null; // élément racine de la page affichée
V.zoneMessage = null; // zone qui accueille le message d'information

V.init = function () {
  let fragment = V.createPageFragment();
  V.racine = fragment.firstElementChild;
  return fragment;
};

/**
 * Reconstruit toute la page à partir du modèle, et remplace l'ancienne.
 */
V.rafraichir = function () {
  let fragment = V.createPageFragment();
  let nouvelleRacine = fragment.firstElementChild;
  V.racine.replaceWith(fragment);
  V.racine = nouvelleRacine;
};

/**
 * Met à jour le seul message, sans toucher au reste de la page.
 */
V.majMessage = function () {
  if (V.zoneMessage === null) return;
  V.zoneMessage.replaceChildren(MessageView.dom(M.message));
};

V.createPageFragment = function () {
  let pageFragment = htmlToFragment(template);

  pageFragment.querySelector('slot[name="ariane"]').replaceWith(FilArianeView.dom(C.filAriane()));

  V.zoneMessage = pageFragment.querySelector('[data-zone="message"]');
  V.zoneMessage.replaceChildren(MessageView.dom(M.message));

  let slotProduit = pageFragment.querySelector('slot[name="produit"]');

  if (M.produit === null) {
    // Produit introuvable : il ne reste que le message.
    for (let slot of pageFragment.querySelectorAll("slot")) {
      slot.remove();
    }
    return pageFragment;
  }

  slotProduit.replaceWith(
    DetailProduitView.dom(C.produitAffichage(), {
      surAjouterPanier: C.handler_ajouterPanier,
    })
  );

  return pageFragment;
};

export function ProduitPage(params = {}) {
  return C.init(params.slug ?? params.Slug ?? null);
}
