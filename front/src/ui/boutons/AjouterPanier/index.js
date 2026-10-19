import { htmlToFragment } from "../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Bouton « Ajouter au panier ».
 * Peut être désactivé (produit épuisé) et signale le clic via actions.surAjouter.
 */
let AjouterPanierView = {
  html: function () {
    return template;
  },

  /**
   * @param {{epuise?: boolean}} data
   * @param {{surAjouter?: () => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(AjouterPanierView.html());
    let btn = fragment.querySelector('[data-action="ajouter-panier"]');

    if (btn) {
      if (data.epuise) {
        btn.disabled = true;
        btn.textContent = "Épuisé";
      } else if (actions.surAjouter) {
        btn.addEventListener("click", () => actions.surAjouter());
      }
    }

    return fragment;
  },
};

export { AjouterPanierView };
