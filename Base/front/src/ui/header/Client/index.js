import { genericRenderer, htmlToFragment } from "../../../lib/utils.js";
import { basculerTheme } from "../../../lib/theme.js";
import { CategorieData } from "../../../data/categorie.js";
import { BarreRechercheView } from "../../barre-recherche/index.js";
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

    let slotRecherche = fragment.querySelector('slot[name="recherche"]');
    if (slotRecherche) {
      slotRecherche.replaceWith(BarreRechercheView.dom(data, actions));
    }

    let slotCategories = fragment.querySelector('slot[name="categories"]');
    if (slotCategories) {
      if (Array.isArray(data.categories) && data.categories.length > 0) {
        slotCategories.replaceWith(...data.categories.map(HeaderClientView.creerLienCategorie));
      } else {
        HeaderClientView.chargerCategories(slotCategories);
      }
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

  creerLienCategorie: function (categorie) {
    const chemin = `/categorie/${encodeURIComponent(categorie.slug)}`;
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    const lien = categorie.lien || `${base}${chemin}`;
    const fragment = htmlToFragment(
      genericRenderer(templateA, {
        nom: categorie.nom || categorie.libelle || "",
        lien,
        "nb-produits": categorie.nb_produits ?? categorie.nbProduits ?? 0,
      })
    );
    const element = fragment.firstElementChild;

    if (window.location.pathname === lien) {
      element.setAttribute("aria-current", "page");
    }

    return fragment;
  },

  chargerCategories: async function (slot) {
    try {
      const categories = await CategorieData.fetchAll();
      if (!slot.isConnected) return;

      const liens = categories.map(HeaderClientView.creerLienCategorie);
      slot.replaceWith(...liens);
    } catch (erreur) {
      if (slot?.isConnected) {
        slot.remove();
      }
    }
  },
};

export { HeaderClientView };
