import { genericRenderer, htmlToFragment } from "../../../../lib/utils.js";
import template from "./template.html?raw";

// Gabarit d'une ligne. Les valeurs sont échappées par genericRenderer.
const LIGNE = `<tr class="text-zinc-900 dark:text-zinc-100">
  <td class="px-4 py-3 font-medium">{{nom}}</td>
  <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">{{description}}</td>
  <td class="px-4 py-3">{{nbProduits}}</td>
  <td class="whitespace-nowrap px-4 py-3 text-right">
    <button type="button" data-action="modifier" data-id="{{id}}" class="mr-3 text-blue-600 underline hover:text-blue-700 dark:text-blue-400">Modifier</button>
    <button type="button" data-action="supprimer" data-id="{{id}}" class="text-red-700 underline hover:text-red-900 dark:text-red-400">Supprimer</button>
  </td>
</tr>`;

/**
 * Tableau des catégories : nom, description, nombre de produits, actions.
 * categories : [{ id, nom, description, nbProduits }]
 */
let TableauCategoriesView = {
  html: function () {
    return template;
  },

  /**
   * @param {Array<object>} categories
   * @param {{surModifier?: (id) => void, surSupprimer?: (id) => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (categories = [], actions = {}) {
    let fragment = htmlToFragment(template);
    let corps = fragment.querySelector('[data-zone="lignes"]');

    corps.innerHTML = categories.length
      ? categories.map((c) => genericRenderer(LIGNE, c)).join("")
      : `<tr><td colspan="4" class="px-4 py-6 text-center text-zinc-500">Aucune catégorie pour le moment.</td></tr>`;

    corps.addEventListener("click", (ev) => {
      let bouton = ev.target.closest("[data-action]");
      if (!bouton) return;
      let id = bouton.dataset.id;
      if (bouton.dataset.action === "modifier") actions.surModifier?.(id);
      if (bouton.dataset.action === "supprimer") actions.surSupprimer?.(id);
    });

    return fragment;
  },
};

export { TableauCategoriesView };