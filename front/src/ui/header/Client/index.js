import { genericRenderer, htmlToFragment } from "../../../lib/utils.js";
import { basculerTheme } from "../../../lib/theme.js";
import template from "./template.html?raw";
import templateA from "./templateA.html?raw";
import logoUrl from "../../../images/logo.webp";

/**
 * En-tête de la boutique client.
 */
let HeaderClientView = {
  /**
   * @param {{
   *   nbArticles?: number,
   *   categories?: Array<{id?: number|string, nom?: string, libelle?: string, lien?: string, nb_produits?: number|string, nbProduits?: number|string}>,
   * }} data
   * @returns {string}
   */
  html: function (data = {}) {
    const estSombre = document.documentElement.classList.contains("theme-dark");
    const iconTheme = estSombre ? "#icon-sun" : "#icon-moon";

    return genericRenderer(template, {
      nbArticles: data.nbArticles ?? data.totalArticles ?? 0,
      "icon-theme": iconTheme,
      "logo-src": logoUrl,
    });
  },

  /**
   * @param {{
   *   nbArticles?: number,
   *   categories?: Array<object>,
   * }} data
   * @param {{
   *   surChangerTheme?: () => void
   * }} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(HeaderClientView.html(data));

    // Insertion propre des liens de catégories dans le slot sans passer par escapeHtml
    let slotCategories = fragment.querySelector('slot[name="categories"]');
    if (slotCategories && Array.isArray(data.categories)) {
      let liensCategories = data.categories.map((cat) => {
        let htmlLien = genericRenderer(templateA, {
          nom: cat.nom || cat.libelle || "",
          lien: cat.lien || (cat.id ? `/categorie/${cat.id}` : "/"),
          "nb-produits": cat.nb_produits ?? cat.nbProduits ?? "",
        });
        return htmlToFragment(htmlLien);
      });
      slotCategories.replaceWith(...liensCategories);
    } else if (slotCategories) {
      slotCategories.remove();
    }

    let btnTheme = fragment.querySelector('[data-action="theme"]');
    if (btnTheme) {
      btnTheme.addEventListener("click", () => {
        basculerTheme();
        const estSombre = document.documentElement.classList.contains("theme-dark");
        const useIcon = btnTheme.querySelector("use");
        if (useIcon) {
          useIcon.setAttribute("href", estSombre ? "#icon-sun" : "#icon-moon");
        }
        if (actions.surChangerTheme) {
          actions.surChangerTheme();
        }
      });
    }

    return fragment;
  },
};

export { HeaderClientView, HeaderClientView as HeaderView };
