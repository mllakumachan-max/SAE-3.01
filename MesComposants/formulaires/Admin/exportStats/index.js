import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Formulaire de connexion administrateur.
 * Transmet les identifiants au contrôleur sans stocker d'état.
 */
let FormulaireConnexionAdminView = {
  /**
   * @param {{login?: string}} data Identifiant à pré-remplir
   * @returns {string}
   */
  html: function (data = {}) {
    return genericRenderer(template, {
      login: data?.login || "",
    });
  },

  /**
   * @param {{login?: string}} data
   * @param {{surConnexion?: (login: string, mdp: string) => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(FormulaireConnexionAdminView.html(data));
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

    return fragment;
  },
};

export { FormulaireConnexionAdminView, FormulaireConnexionAdminView as FormulaireConnexionView };
