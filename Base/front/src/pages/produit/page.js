import { ProduitData } from "../../data/produit.js";
import { htmlToFragment } from "../../lib/utils.js";
import { appliquerSeo } from "../../lib/seo.js";
import { ajouterAuPanier, lignesPanier, verifierStock } from "../../lib/panier.js";
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
  options: [], // les options de personnalisation du produit
  selection: {}, // { nomOption: valeurChoisie }
  quantite: 1, // quantité choisie, préservée entre deux reconstructions
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
    M.options = reponse.options ?? [];
    // Aucun choix n'est préservé quand on change de produit.
    M.selection = {};
    M.quantite = 1;
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
    options: M.options,
    selection: M.selection,
    quantite: M.quantite,
    prixBase: Number(M.produit.prix || 0),
    prixActuel: C.prixActuel(),
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
 * Prix unitaire actuellement affiché : prix de base + suppléments des
 * options sélectionnées.
 */
C.prixActuel = function () {
  if (M.produit === null) return 0;

  let supplement = 0;
  for (const option of M.options) {
    const valeurChoisie = M.selection[option.nom];
    const valeur = (option.valeurs || []).find((v) => v.valeur === valeurChoisie);
    if (valeur) supplement += valeur.prixSupplement || 0;
  }

  return Number(M.produit.prix || 0) + supplement;
};

/**
 * L'utilisateur choisit une valeur pour une option. Le prix se recompute et
 * la page se rafraichit.
 */
C.selectionnerOption = function (nomOption, valeur) {
  if (M.produit === null) return;

  M.selection[nomOption] = valeur;
  V.rafraichir();
};

/**
 * L'utilisateur modifie la quantité.
 */
C.handler_quantite = function (quantite) {
  M.quantite = Math.max(1, Math.floor(Number(quantite) || 1));
};

/**
 * Ajout au panier avec vérification du stock, côté client et côté serveur.
 *
 * - Côté client : on refuse d'ajouter un produit épuisé, et on borne la
 *   quantité au stock connu (réponse immédiate, sans appel réseau).
 * - Côté serveur : on interroge l'API avec la quantité déjà présente dans le
 *   panier plus celle demandée, car le stock peut avoir changé depuis le
 *   chargement de la page. La quantité réellement ajoutée est alors bornée au
 *   stock courant.
 *
 * Seul le message est mis à jour : reconstruire toute la page ferait perdre
 * l'image affichée et la quantité choisie.
 */
C.handler_ajouterPanier = async function (id) {
  if (M.produit === null) return;

  const produitId = id ?? M.produit.id;
  const stock = Number(M.produit.stock) || 0;
  let quantiteFinale = M.quantite;

  // --- Vérification côté client -------------------------------------------
  if (stock <= 0) {
    M.message = {
      type: "erreur",
      texte: "Ce produit est épuisé et ne peut pas être ajouté au panier.",
    };
    V.majMessage();
    return;
  }

  if (quantiteFinale > stock) {
    quantiteFinale = stock;
    M.message = {
      type: "erreur",
      texte: `La quantité demandée dépasse le stock disponible (${stock} maximum). La quantité a été ajustée.`,
    };
  }

  // --- Vérification côté serveur (stock peut avoir évolué pendant la session)
  const ligneExistante = lignesPanier().find((ligne) => String(ligne.id) === String(produitId));
  const quantiteDejaDansPanier = Number(ligneExistante?.quantite || 0);

  let verification;
  try {
    verification = await verifierStock([{ id: produitId, quantite: quantiteDejaDansPanier + quantiteFinale }]);
  } catch (erreur) {
    // API indisponible : on s'en remet à la vérification côté client.
    verification = null;
  }

  const ligneVerifiee = verification?.lignes?.[0];

  if (ligneVerifiee && !ligneVerifiee.estValide) {
    // Le stock courant autorise au maximum quantiteMax articles au total dans
    // le panier. On ne peut donc en ajouter que le solde restant.
    const quantiteTotaleMax = Number(ligneVerifiee.quantiteMax) || 0;
    quantiteFinale = Math.max(0, quantiteTotaleMax - quantiteDejaDansPanier);

    if (quantiteFinale <= 0) {
      M.message = {
        type: "erreur",
        texte: ligneVerifiee.message || "Ce produit est épuisé.",
      };
      V.majMessage();
      return;
    }

    M.message = {
      type: "erreur",
      texte: `${ligneVerifiee.message || ""} La quantité a été ajustée à ${quantiteFinale} (maximum autorisé : ${quantiteTotaleMax} au total).`,
    };
  } else if (!M.message || M.message.type !== "erreur") {
    M.message = { type: "succes", texte: `${M.produit.nom} a été ajouté au panier.` };
  }

  ajouterAuPanier(
    {
      id: produitId,
      slug: M.produit.slug,
      nom: M.produit.nom,
      // Le prix tient compte des suppléments des options choisies.
      prix: C.prixActuel(),
      stock: M.produit.stock,
      src: M.galerie[0]?.src ?? "",
      options: { ...M.selection },
    },
    quantiteFinale
  );

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
      surSelectionChange: C.selectionnerOption,
      surQuantite: C.handler_quantite,
    })
  );

  return pageFragment;
};

export function ProduitPage(params = {}) {
  return C.init(params.slug ?? params.Slug ?? null);
}
