import { genericRenderer, htmlToFragment } from "../../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Confirmation d'annulation d'une commande.
 * Une annulation n'a lieu qu'après une confirmation explicite.
 */
let ConfirmationAnnulationView = {
  html: function (data = {}) {
    return genericRenderer(template, { numero: data.numero ?? "" });
  },

  /**
   * @param {{id, numero}} data
   * @param {{surConfirmer?: (id) => void, surFermer?: () => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(ConfirmationAnnulationView.html(data));
    fragment.querySelector('[data-action="confirmer"]').addEventListener("click", () => actions.surConfirmer?.(data.id));
    fragment.querySelectorAll('[data-action="fermer"]').forEach((b) =>
      b.addEventListener("click", () => actions.surFermer?.())
    );
    return fragment;
  },
};

export { ConfirmationAnnulationView };