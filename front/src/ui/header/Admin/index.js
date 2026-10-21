import { htmlToFragment } from "../../../lib/utils.js";
import { basculerTheme } from "../../../lib/theme.js";
import template from "./template.html?raw";

/**
 * En-tête de l'espace administration.
 */
let HeaderAdminView = {
  /**
   * @returns {string}
   */
  html: function () {
    return template;
  },

  /**
   * @param {{surDeconnexion?: () => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (actions = {}) {
    let fragment = htmlToFragment(template);

    let btnTheme = fragment.querySelector('[data-action="theme"]');
    if (btnTheme) {
      btnTheme.addEventListener("click", basculerTheme);
    }

    let btnDeconnexion = fragment.querySelector('[data-action="deconnexion"]');
    if (btnDeconnexion && actions.surDeconnexion) {
      btnDeconnexion.addEventListener("click", () => actions.surDeconnexion());
    }

    return fragment;
  },
};

export { HeaderAdminView };
