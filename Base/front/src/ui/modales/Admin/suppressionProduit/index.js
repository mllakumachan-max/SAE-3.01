import { genericRenderer, htmlToFragment } from "../../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Confirmation de suppression d'un produit.
 */
let ConfirmationSuppressionProduitView = {
  html: function (data = {}) {
    return genericRenderer(template, { nom: data.nom ?? "" });
  },

  /**
   * @param {{id, nom}} data
   * @param {{surConfirmer?: (id) => void, surFermer?: () => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(ConfirmationSuppressionProduitView.html(data));
    fragment.querySelector('[data-action="confirmer"]').addEventListener("click", () => actions.surConfirmer?.(data.id));
    fragment.querySelectorAll('[data-action="fermer"]').forEach((b) =>
      b.addEventListener("click", () => actions.surFermer?.())
    );
    return fragment;
  },
};

export { ConfirmationSuppressionProduitView };