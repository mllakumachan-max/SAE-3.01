import { genericRenderer, htmlToFragment } from "../../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Formulaire de connexion client (Click & Collect).
 */
let FormulaireConnexionClientView = {
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
   *   surConnexion?: (login: string, mdp: string) => void,
   *   surBasculerInscription?: () => void,
   *   surFermer?: () => void,
   *   surRetourPanier?: () => void
   * }} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(FormulaireConnexionClientView.html(data));
    let formulaire = fragment.querySelector("form");

    if (formulaire) {
      formulaire.addEventListener("submit", (ev) => {
        ev.preventDefault();
        if (actions.surConnexion) {
          actions.surConnexion(
            formulaire.elements.login.value.trim(),
            formulaire.elements.mdp.value
          );
        }
      });
    }

    let btnFermer = fragment.querySelector('[data-action="fermer"]');
    if (btnFermer && actions.surFermer) {
      btnFermer.addEventListener("click", () => actions.surFermer());
    }

    let btnInscription = fragment.querySelector('[data-action="basculer-inscription"]');
    if (btnInscription && actions.surBasculerInscription) {
      btnInscription.addEventListener("click", () => actions.surBasculerInscription());
    }

    let btnRetourPanier = fragment.querySelector('[data-action="retour-panier"]');
    if (btnRetourPanier && actions.surRetourPanier) {
      btnRetourPanier.addEventListener("click", () => actions.surRetourPanier());
    }

    return fragment;
  },
};

export { FormulaireConnexionClientView, FormulaireConnexionClientView as FormulaireConnexionView };
