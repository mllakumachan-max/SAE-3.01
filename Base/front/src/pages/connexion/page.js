import { AuthData } from "../../data/auth.js";
import { htmlToFragment } from "../../lib/utils.js";
import { MessageView } from "../../ui/message/index.js";
import template from "./template.html?raw";

/**
 * Page « Connexion client ».
 *
 * Affiche le formulaire de connexion par défaut. Cliquer sur « Créer un compte »
 * fait disparaître ce formulaire pour laisser place au formulaire d'inscription,
 * et inversement avec « Me connecter ».
 */

let M = {
  mode: "connexion", // "connexion" | "inscription"
  login: "",
  message: null, // { type, texte }, ou null
};

let C = {};

C.handler_connexion = async function (login, mdp) {
  M.login = login;
  try {
    await AuthData.login(login, mdp);
    M.message = { type: "succes", texte: "Vous êtes connecté." };
    M.mode = "connexion";
  } catch (erreur) {
    M.message = { type: "erreur", texte: erreur.message };
  }
  V.rafraichir();
};

C.handler_inscription = async function (login, mdp, mdpConfirmation) {
  M.login = login;
  try {
    await AuthData.register(login, mdp, mdpConfirmation);
    await AuthData.login(login, mdp);
    M.message = { type: "succes", texte: "Compte créé, vous êtes connecté." };
    M.mode = "connexion";
  } catch (erreur) {
    M.message = { type: "erreur", texte: erreur.message };
  }
  V.rafraichir();
};

C.handler_basculerInscription = function () {
  M.mode = "inscription";
  M.message = null;
  V.rafraichir();
};

C.handler_basculerConnexion = function () {
  M.mode = "connexion";
  M.message = null;
  V.rafraichir();
};

C.init = async function () {
  M.message = null;
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
 */
V.rafraichir = function () {
  let fragment = V.createPageFragment();
  let nouvelleRacine = fragment.firstElementChild;
  V.racine.replaceWith(fragment);
  V.racine = nouvelleRacine;
};

V.createPageFragment = function () {
  let pageFragment = htmlToFragment(template);

  pageFragment.querySelector('slot[name="message"]').replaceWith(MessageView.dom(M.message));

  const estConnexion = M.mode === "connexion";
  const formulaireConnexion = pageFragment.querySelector('form[name="connexion"]');
  const formulaireInscription = pageFragment.querySelector('form[name="inscription"]');

  // Un seul formulaire est visible à la fois : l'autre est retiré du flux.
  formulaireConnexion.hidden = !estConnexion;
  formulaireInscription.hidden = estConnexion;

  pageFragment.querySelector('[data-zone="titre"]').textContent = estConnexion
    ? "Connexion client"
    : "Créer un compte client";

  formulaireConnexion.addEventListener("submit", (ev) => {
    ev.preventDefault();
    C.handler_connexion(
      formulaireConnexion.elements.login.value.trim(),
      formulaireConnexion.elements.mdp.value
    );
  });

  formulaireInscription.addEventListener("submit", (ev) => {
    ev.preventDefault();
    C.handler_inscription(
      formulaireInscription.elements.login.value.trim(),
      formulaireInscription.elements.mdp.value,
      formulaireInscription.elements.mdp_confirmation ? formulaireInscription.elements.mdp_confirmation.value : ""
    );
  });

  pageFragment.querySelectorAll('[data-action="basculer-inscription"]').forEach((bouton) => {
    bouton.addEventListener("click", C.handler_basculerInscription);
  });

  pageFragment.querySelectorAll('[data-action="basculer-connexion"]').forEach((bouton) => {
    bouton.addEventListener("click", C.handler_basculerConnexion);
  });

  return pageFragment;
};

export function ConnexionPage() {
  return C.init();
}
