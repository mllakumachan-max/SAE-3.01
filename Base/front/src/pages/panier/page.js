import { htmlToFragment } from "../../lib/utils.js";
import {
  lignesPanier,
  modifierQuantite,
  retirerDuPanier,
  viderPanier,
  majCompteurPanier,
} from "../../lib/panier.js";
import { PanierView } from "../../ui/tableaux-recapitulatifs/Client/panier/index.js";
import { MessageView } from "../../ui/message/index.js";
import template from "./template.html?raw";

/**
 * Page « Mon panier ».
 *
 * Affiche les articles du panier (conservé dans localStorage), permet de
 * modifier les quantités, de supprimer un article ou de valider le panier.
 */

let M = {
  panier: [], // articles du panier
  message: null, // { type, texte }, ou null
};

let C = {};

C.charger = function () {
  M.panier = lignesPanier();
};

C.handler_surQuantite = function (id, quantite) {
  modifierQuantite(id, quantite);
  C.charger();
  majCompteurPanier();
  V.rafraichir();
};

C.handler_surSupprimer = function (id) {
  retirerDuPanier(id);
  C.charger();
  majCompteurPanier();
  V.rafraichir();
};

C.handler_surValider = function () {
  viderPanier();
  majCompteurPanier();
  M.panier = [];
  M.message = { type: "succes", texte: "Votre commande a été validée." };
  V.rafraichir();
};

C.handler_surContinuer = function () {
  window.location.href = "/";
};

C.init = function () {
  C.charger();
  return V.init();
};

let V = {};

V.racine = null;

V.init = function () {
  let fragment = V.createPageFragment();
  V.racine = fragment.firstElementChild;
  return fragment;
};

V.rafraichir = function () {
  let fragment = V.createPageFragment();
  let nouvelleRacine = fragment.firstElementChild;
  V.racine.replaceWith(fragment);
  V.racine = nouvelleRacine;
};

V.createPageFragment = function () {
  let pageFragment = htmlToFragment(template);

  pageFragment.querySelector('slot[name="panier"]').replaceWith(
    PanierView.dom(M.panier, {
      surQuantite: C.handler_surQuantite,
      surSupprimer: C.handler_surSupprimer,
      surValider: C.handler_surValider,
      surContinuer: C.handler_surContinuer,
    })
  );

  pageFragment.querySelector('slot[name="message"]').replaceWith(MessageView.dom(M.message));

  return pageFragment;
};

export function PanierPage() {
  return C.init();
}
