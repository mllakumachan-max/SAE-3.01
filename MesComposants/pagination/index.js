import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Navigation entre les pages.
 */
let PaginationView = {
  /**
   * @param {{page: number, pagesTotal: number}} data
   * @returns {string}
   */
  html: function (data) {
    return genericRenderer(template, {
      page: data.page || 1,
      pagesTotal: data.pagesTotal || 1,
    });
  },

  /**
   * @param {{page: number, pagesTotal: number}} data
   * @param {{surPage?: (page: number) => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (data, actions = {}) {
    let fragment = htmlToFragment(PaginationView.html(data));
    let precedente = fragment.querySelector('[data-action="precedente"]');
    let suivante = fragment.querySelector('[data-action="suivante"]');

    if (precedente) {
      precedente.disabled = data.page <= 1;
      if (actions.surPage) {
        precedente.addEventListener("click", () => actions.surPage(data.page - 1));
      }
    }

    if (suivante) {
      suivante.disabled = data.page >= data.pagesTotal;
      if (actions.surPage) {
        suivante.addEventListener("click", () => actions.surPage(data.page + 1));
      }
    }

    return fragment;
  },
};

export { PaginationView };
