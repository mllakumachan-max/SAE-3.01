import { htmlToFragment } from "../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Contrôle de quantité : bornes min et max (le stock disponible).
 * La valeur est toujours ramenée dans l'intervalle [min, max].
 */
let QuantiteView = {
  html: function () {
    return template;
  },

  /** Ramène une valeur saisie dans [min, max]. */
  ajuster: function (valeur, min = 1, max = Infinity) {
    let n = parseInt(valeur, 10);
    if (Number.isNaN(n)) n = min;
    return Math.min(Math.max(n, min), max);
  },

  /**
   * @param {{valeur?: number, min?: number, max?: number}} data
   * @param {{surChange?: (quantite: number) => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let min = data.min ?? 1;
    let max = data.max ?? Infinity;
    let fragment = htmlToFragment(template);
    let champ = fragment.querySelector('input[name="quantite"]');
    let moins = fragment.querySelector('[data-action="moins"]');
    let plus = fragment.querySelector('[data-action="plus"]');

    champ.min = min;
    if (Number.isFinite(max)) champ.max = max;

    let mettreAJour = (nouvelle, notifier = true) => {
      let valeur = QuantiteView.ajuster(nouvelle, min, max);
      champ.value = valeur;
      moins.disabled = valeur <= min;
      plus.disabled = valeur >= max;
      if (notifier && actions.surChange) actions.surChange(valeur);
    };

    champ.value = QuantiteView.ajuster(data.valeur ?? min, min, max);
    moins.disabled = champ.value <= min;
    plus.disabled = champ.value >= max;

    moins.addEventListener("click", () => mettreAJour(Number(champ.value) - 1));
    plus.addEventListener("click", () => mettreAJour(Number(champ.value) + 1));
    champ.addEventListener("change", () => mettreAJour(champ.value));

    return fragment;
  },
};

export { QuantiteView };