import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Formulaire de création de compte client (Click & Collect).
 */
let FormulaireInscriptionClientView = {
  /**
   * @param {{login?: string}} data
   * @returns {string}
   */
  html: function (data = {}) {
    return genericRenderer(template, {
      login: data?.login || "",
    });
  },

  /**
   * @param {{login?: string}} data
   * @param {{
   *   surInscription?: (login: string, mdp: string, mdpConfirmation: string) => void,
   *   surBasculerConnexion?: () => void,
   *   surFermer?: () => void,
   *   surRetourPanier?: () => void
   * }} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(FormulaireInscriptionClientView.html(data));
    let formulaire = fragment.querySelector("form");

    if (formulaire) {
      formulaire.addEventListener("submit", (ev) => {
        ev.preventDefault();
        if (actions.surInscription) {
          actions.surInscription(
            formulaire.elements.login.value.trim(),
            formulaire.elements.mdp.value,
            formulaire.elements.mdp_confirmation ? formulaire.elements.mdp_confirmation.value : ""
          );
        }
      });
    }

    let btnFermer = fragment.querySelector('[data-action="fermer"]');
    if (btnFermer && actions.surFermer) {
      btnFermer.addEventListener("click", () => actions.surFermer());
    }

    let btnConnexion = fragment.querySelector('[data-action="basculer-connexion"]');
    if (btnConnexion && actions.surBasculerConnexion) {
      btnConnexion.addEventListener("click", () => actions.surBasculerConnexion());
    }

    let btnRetourPanier = fragment.querySelector('[data-action="retour-panier"]');
    if (btnRetourPanier && actions.surRetourPanier) {
      btnRetourPanier.addEventListener("click", () => actions.surRetourPanier());
    }

    return fragment;
  },
};

export { FormulaireInscriptionClientView };
