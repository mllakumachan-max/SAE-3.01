import { genericRenderer, htmlToFragment } from "../../../lib/utils.js";
import { basculerTheme } from "../../../lib/theme.js";
import logoUrl from "../../../images/logo.webp";
import template from "./template.html?raw";
import templateA from "./templateA.html?raw";

const NAVIGATION_ADMIN = [
  { lien: "/admin/produits", nom: "Produits" },
  { lien: "/admin/categories", nom: "Catégories" },
  { lien: "/admin/commandes", nom: "Commandes" },
];

/**
 * En-tête de l'espace administration.
 */
let HeaderAdminView = {
  /**
   * @returns {string}
   */
  html: function () {
    const estSombre = document.documentElement.classList.contains("theme-dark");

    return genericRenderer(template, {
      "icon-theme": estSombre ? "#icon-sun" : "#icon-moon",
      "logo-src": logoUrl,
    });
  },

  /**
  * @param {{adminConnecte?: boolean, surDeconnexion?: () => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (actions = {}) {
    let fragment = htmlToFragment(HeaderAdminView.html());
    let zoneNavigation = fragment.querySelector('[data-zone="navigation-authentifie"]');
    if (zoneNavigation) zoneNavigation.hidden = !actions.adminConnecte;

    let btnDeconnexion = fragment.querySelector('[data-action="deconnexion"]');
    if (btnDeconnexion) btnDeconnexion.hidden = !actions.adminConnecte;

    let slotNavigation = fragment.querySelector('slot[name="navigation"]');
    if (slotNavigation) {
      const liens = NAVIGATION_ADMIN.map((lien) =>
        htmlToFragment(genericRenderer(templateA, lien))
      );
      slotNavigation.replaceWith(...liens);
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
      });
    }

    if (btnDeconnexion && actions.surDeconnexion) {
      btnDeconnexion.addEventListener("click", () => actions.surDeconnexion());
    }

    return fragment;
  },
};

export { HeaderAdminView };
