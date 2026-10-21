import { genericRenderer, htmlToFragment } from "../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Espace personnel : modification du profil.
 * Le changement de mot de passe exige le mot de passe actuel.
 */
let ProfilFormView = {
  html: function (data = {}) {
    return genericRenderer(template, {
      nom: data.nom || "",
      email: data.email || "",
    });
  },

  /** Valide le formulaire et renvoie un message d'erreur, ou null. */
  valider: function (valeurs) {
    if (!valeurs.nom.trim()) return "Le nom est obligatoire.";
    if (!/^\S+@\S+\.\S+$/.test(valeurs.email)) return "L'adresse email n'est pas valide.";
    if (valeurs.mdpNouveau || valeurs.mdpConfirmation) {
      if (!valeurs.mdpActuel) return "Saisissez votre mot de passe actuel pour le modifier.";
      if (valeurs.mdpNouveau.length < 8) return "Le nouveau mot de passe doit contenir au moins 8 caractères.";
      if (valeurs.mdpNouveau !== valeurs.mdpConfirmation) return "La confirmation ne correspond pas au nouveau mot de passe.";
    }
    return null;
  },

  /**
   * @param {{nom?: string, email?: string}} data
   * @param {{surEnregistrer?: (profil: object) => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(ProfilFormView.html(data));
    let formulaire = fragment.querySelector("form");
    let message = fragment.querySelector('[data-zone="message"]');

    formulaire.addEventListener("submit", (ev) => {
      ev.preventDefault();
      let v = Object.fromEntries(new FormData(formulaire));
      v.nom = v.nom || "";
      v.email = v.email || "";
      let erreur = ProfilFormView.valider(v);
      message.textContent = erreur || "";
      message.classList.toggle("hidden", !erreur);
      if (!erreur && actions.surEnregistrer) actions.surEnregistrer(v);
    });

    return fragment;
  },
};

export { ProfilFormView };