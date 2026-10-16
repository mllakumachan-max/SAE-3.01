import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import { basculerTheme } from "../../lib/theme.js";
import template from "./template.html?raw";
import templateA from "./templateA.html?raw";

/**
 * En-tête de la boutique client.
 */
let HeaderClientView = {
  /**
   * @param {{
   *   nbArticles?: number,
   *   categories?: Array<{id?: number|string, nom?: string, libelle?: string, lien?: string, nb_produits?: number|string, nbProduits?: number|string}>,
   *   categorie?: string
   * }} data
   * @returns {string}
   */
  html: function (data = {}) {
    let categoriesHtml = "";

    if (Array.isArray(data.categories)) {
      categoriesHtml = data.categories
        .map((cat) => {
          return genericRenderer(templateA, {
            nom: cat.nom || cat.libelle || "",
            lien: cat.lien || (cat.id ? `/categorie/${cat.id}` : "/"),
            "nb-produits": cat.nb_produits ?? cat.nbProduits ?? "",
          });
        })
        .join("");
    } else if (typeof data.categorie === "string") {
      categoriesHtml = data.categorie;
    }

    return genericRenderer(template, {
      nbArticles: data.nbArticles ?? data.totalArticles ?? 0,
      categorie: categoriesHtml,
    });
  },

  /**
   * @param {{
   *   nbArticles?: number,
   *   categories?: Array<object>,
   *   categorie?: string
   * }} data
   * @param {{
   *   surChangerTheme?: () => void
   * }} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(HeaderClientView.html(data));

    let btnTheme = fragment.querySelector('[data-action="theme"]');
    if (btnTheme) {
      btnTheme.addEventListener("click", () => {
        basculerTheme();
        if (actions.surChangerTheme) {
          actions.surChangerTheme();
        }
      });
    }

    return fragment;
  },
};

export { HeaderClientView, HeaderClientView as HeaderView };
