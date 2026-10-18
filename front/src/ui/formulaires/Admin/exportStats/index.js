import { genericRenderer, htmlToFragment } from "../../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Formulaire d'export des statistiques.
 * Ne fait que recueillir le format et la période : l'export est fait par le contrôleur.
 */
let FormulaireExportStatsView = {
  /**
   * @returns {string}
   */
  html: function () {
    return genericRenderer(template, {});
  },

  /**
   * @param {{surExporter?: (format: string, periode: string) => void,
   *          surFermer?: () => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (actions = {}) {
    let fragment = htmlToFragment(FormulaireExportStatsView.html());
    let formulaire = fragment.querySelector("form");

    if (formulaire) {
      formulaire.addEventListener("submit", (ev) => {
        ev.preventDefault();
        if (actions.surExporter) {
          actions.surExporter(formulaire.elements.format.value, formulaire.elements.periode.value);
        }
      });
    }

    fragment.querySelectorAll('[data-action="fermer"]').forEach((btn) => {
      if (actions.surFermer) btn.addEventListener("click", () => actions.surFermer());
    });

    return fragment;
  },
};

export { FormulaireExportStatsView };