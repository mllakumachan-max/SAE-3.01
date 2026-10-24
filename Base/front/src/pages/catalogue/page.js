import { ProduitData } from "../../data/produit.js";
import { ajouterAuPanier } from "../../lib/panier.js";
import { htmlToFragment } from "../../lib/utils.js";
import { BarreOutilsView } from "../../ui/barre-outils/index.js";
import { FilArianeView } from "../../ui/fil-ariane/index.js";
import { GrilleProduitsView } from "../../ui/grille-produits/index.js";
import { MessageView } from "../../ui/message/index.js";
import { PaginationView } from "../../ui/pagination/index.js";
import template from "./template.html?raw";

/**
 * Page « Catalogue ».
 *
 * Au chargement, on ne précise aucun réglage : le serveur applique les
 * préférences qu'il a mémorisées. Ensuite, le tri et le nombre de produits par
 * page accompagnent chaque requête, et le serveur les mémorise.
 */

let M = {
  catalogue: null, // dernière réponse de l'API : produits et réglages appliqués
  message: null, // { type, texte }, ou null
  categorieSlug: null,
  categorieLibelle: null,
  termeRecherche: "",
};

let C = {};

/**
 * Demande une page du catalogue et range la réponse dans le modèle.
 * reglages ({ tri, parPage }) est facultatif, voir data/produit.js.
 */
C.charger = async function (page, reglages, categorieSlug = M.categorieSlug, recherche = M.termeRecherche) {
  try {
    M.catalogue = await ProduitData.fetchPage(page, reglages, categorieSlug, recherche);
    M.message = null;
  } catch (erreur) {
    M.catalogue = null;
    M.message = { type: "erreur", texte: `Impossible de charger le catalogue : ${erreur.message}` };
  }
};

// Changer un réglage rend la page courante sans objet : on repart de la première.
C.handler_changerTri = async function (tri) {
  await C.charger(1, { tri, parPage: M.catalogue.parPage }, M.categorieSlug, M.termeRecherche);
  V.rafraichir();
};

C.handler_changerParPage = async function (parPage) {
  await C.charger(1, { tri: M.catalogue.tri, parPage }, M.categorieSlug, M.termeRecherche);
  V.rafraichir();
};

C.handler_changerPage = async function (page) {
  await C.charger(page, { tri: M.catalogue.tri, parPage: M.catalogue.parPage }, M.categorieSlug, M.termeRecherche);
  V.rafraichir();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

C.handler_ajouterPanier = function (id) {
  const produit = (M.catalogue?.produits ?? []).find((p) => String(p.id) === String(id));
  if (produit) ajouterAuPanier(produit, 1);
};

C.handler_rechercher = async function (terme) {
  M.termeRecherche = (terme || "").trim();
  await C.charger(1, { tri: M.catalogue?.tri, parPage: M.catalogue?.parPage }, M.categorieSlug, M.termeRecherche);
  V.rafraichir();
};

C.init = async function (categorieSlug = null) {
  M.categorieSlug = categorieSlug !== null && categorieSlug !== undefined && categorieSlug !== "" ? categorieSlug : null;
  M.termeRecherche = "";

  // Écoute l'événement de recherche depuis le header
  document.removeEventListener("catalogue:recherche", C._onRecherche);
  C._onRecherche = (e) => {
    C.handler_rechercher(e.detail?.terme || "");
  };
  document.addEventListener("catalogue:recherche", C._onRecherche);

  await C.charger(1, undefined, M.categorieSlug, M.termeRecherche);
  M.categorieLibelle = M.catalogue?.categorie?.libelle ?? M.categorieSlug;
  return V.init();
};

let V = {};

V.racine = null; // élément racine de la page affichée

V.init = function () {
  let fragment = V.createPageFragment();
  V.racine = fragment.firstElementChild;
  return fragment;
};

/**
 * Reconstruit toute la page à partir du modèle, et remplace l'ancienne.
 * C'est le principe des frameworks : l'affichage se déduit de l'état, on ne le
 * retouche pas morceau par morceau.
 */
V.rafraichir = function () {
  let fragment = V.createPageFragment();
  let nouvelleRacine = fragment.firstElementChild;
  if (V.racine && V.racine.isConnected) {
    V.racine.replaceWith(fragment);
  }
  V.racine = nouvelleRacine;
};

V.createPageFragment = function () {
  let pageFragment = htmlToFragment(template);

  let elementsAriane = M.categorieSlug === null && !M.termeRecherche
    ? [{ libelle: "Catalogue" }]
    : M.termeRecherche
      ? [{ libelle: "Catalogue", lien: "/" }, { libelle: `Recherche : ${M.termeRecherche}` }]
      : [{ libelle: "Catalogue", lien: "/" }, { libelle: M.categorieLibelle }];
  pageFragment.querySelector('slot[name="ariane"]').replaceWith(FilArianeView.dom(elementsAriane));
  pageFragment.querySelector('slot[name="message"]').replaceWith(MessageView.dom(M.message));

  if (M.catalogue === null) {
    // Rien à afficher : on retire les emplacements restants.
    for (let slot of pageFragment.querySelectorAll("slot")) {
      slot.remove();
    }
    return pageFragment;
  }

  pageFragment.querySelector('slot[name="barre-outils"]').replaceWith(
    BarreOutilsView.dom(M.catalogue, {
      surTri: C.handler_changerTri,
      surParPage: C.handler_changerParPage,
    })
  );

  pageFragment.querySelector('slot[name="grille"]').replaceWith(GrilleProduitsView.dom(M.catalogue.produits, { surAjouterPanier: C.handler_ajouterPanier }));

  pageFragment.querySelector('slot[name="pagination"]').replaceWith(
    PaginationView.dom(M.catalogue, { surPage: C.handler_changerPage })
  );

  return pageFragment;
};

export function CataloguePage(params = {}) {
  return C.init(params.slug ?? params.Slug ?? params.categorie ?? null);
}
