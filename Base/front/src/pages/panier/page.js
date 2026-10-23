import { htmlToFragment } from "../../lib/utils.js";
import {
  lignesPanier,
  modifierQuantite,
  retirerDuPanier,
  viderPanier,
  majCompteurPanier,
  verifierStock,
  ecrire,
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

C.charger = async function () {
  M.panier = lignesPanier();

  if (M.panier.length === 0) {
    M.message = null;
    return;
  }

  // Vérification côté serveur : le stock peut avoir été modifié pendant la
  // session (par un achat client ou par l'administration). Les quantités du
  // panier sont alors ajustées automatiquement au stock disponible.
  let modifie = false;
  const messagesErreur = [];

  try {
    const verification = await verifierStock(
      M.panier.map((ligne) => ({ id: ligne.id, quantite: ligne.quantite }))
    );

    for (const resultat of verification.lignes) {
      const ligne = M.panier.find((l) => String(l.id) === String(resultat.id));
      if (!ligne) continue;

      // Mémorise le stock courant pour borner le contrôle de quantité (ligne-panier).
      ligne.stock = resultat.stock ?? ligne.stock;

      if (!resultat.estValide) {
        modifie = true;
        if (resultat.quantiteMax <= 0) {
          // Produit épuisé : on retire la ligne du panier.
          M.panier = M.panier.filter((l) => String(l.id) !== String(resultat.id));
          messagesErreur.push(`${ligne.nom ?? "Cet article"} a été retiré du panier : produit épuisé.`);
        } else {
          ligne.quantite = resultat.quantiteMax;
          messagesErreur.push(
            `${ligne.nom ?? "Cet article"} : quantité ajustée au stock disponible (${resultat.quantiteMax} maximum).`
          );
        }
      }
    }
  } catch (erreur) {
    // API indisponible : on garde le panier tel quel, sans le bloquer.
  }

  if (modifie) {
    ecrire(M.panier);
    majCompteurPanier();
  }

  M.message = messagesErreur.length > 0
    ? { type: "erreur", texte: messagesErreur.join(" ") }
    : null;
};

C.handler_surQuantite = async function (id, quantite) {
  modifierQuantite(id, quantite);
  await C.charger();
  majCompteurPanier();
  V.rafraichir();
};

C.handler_surSupprimer = async function (id) {
  const nom = M.panier.find((ligne) => String(ligne.id) === String(id))?.nom;
  retirerDuPanier(id);
  await C.charger();
  majCompteurPanier();
  M.message = { type: "succes", texte: `Le produit "${nom}" a bien été supprimé du panier.` };
  V.rafraichir();
};

C.handler_surValider = async function () {
  if (M.panier.length === 0) return;

  // Vérification côté serveur avant la validation de la commande.
  let verification;
  try {
    verification = await verifierStock(
      M.panier.map((ligne) => ({ id: ligne.id, quantite: ligne.quantite }))
    );
  } catch (erreur) {
    // API indisponible : on ne peut pas garantir le stock, on bloque.
    M.message = {
      type: "erreur",
      texte: "Impossible de vérifier le stock actuellement. Réessayez dans un instant.",
    };
    V.rafraichir();
    return;
  }

  const invalides = (verification.lignes ?? []).filter((ligne) => !ligne.estValide);

  if (invalides.length > 0) {
    // On ajuste automatiquement les quantités et on bloque la validation.
    let modifie = false;
    const messages = [];

    for (const resultat of invalides) {
      const ligne = M.panier.find((l) => String(l.id) === String(resultat.id));
      if (!ligne) continue;

      modifie = true;
      if (resultat.quantiteMax <= 0) {
        M.panier = M.panier.filter((l) => String(l.id) !== String(resultat.id));
        messages.push(`${ligne.nom ?? "Cet article"} retiré du panier : produit épuisé.`);
      } else {
        ligne.quantite = resultat.quantiteMax;
        messages.push(
          `${ligne.nom ?? "Cet article"} : quantité ajustée à ${resultat.quantiteMax} (stock disponible).`
        );
      }
    }

    if (modifie) {
      ecrire(M.panier);
      majCompteurPanier();
    }

    M.message = {
      type: "erreur",
      texte: `${messages.join(" ")} Vérifiez votre panier avant de valider la commande.`,
    };
    V.rafraichir();
    return;
  }

  // Stock confirmé : validation de la commande.
  viderPanier();
  majCompteurPanier();
  M.panier = [];
  M.message = { type: "succes", texte: "Votre commande a été validée." };
  V.rafraichir();
};

C.handler_surContinuer = function () {
  window.location.href = import.meta.env.BASE_URL;
};

C.init = async function () {
  await C.charger();
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
