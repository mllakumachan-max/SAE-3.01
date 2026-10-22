import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

// Barre de réglages du catalogue : critère de tri et nombre de produits par page.
// Le composant ne décide de rien : il affiche les valeurs reçues, et signale
// les changements par les fonctions reçues dans actions.
let BarreOutilsView = {
  html: function (data) {
    return genericRenderer(template, {
      libelleTotal: "produits",
      libelleParPage: "Produits par page",
      libelleUnite: "produits",
      ...data,
    });
  },

  /**
   * @param {{tri: string, parPage: number, total: number}} data
   * @param {{surTri: (tri: string) => void,
   *          surParPage: (parPage: number) => void}} actions
   */
  dom: function (data, actions) {
    let fragment = htmlToFragment(BarreOutilsView.html(data));
    let tri = fragment.querySelector('select[name="tri"]');
    let parPage = fragment.querySelector('select[name="parPage"]');

    if (tri) {
      if (Array.isArray(data.optionsTri)) {
        tri.replaceChildren(...data.optionsTri.map(({ valeur, libelle }) => {
          let option = document.createElement("option");
          option.value = valeur;
          option.textContent = libelle;
          return option;
        }));
      }
      tri.value = data.tri;
      tri.addEventListener("change", () => actions.surTri(tri.value));
    }
    if (parPage) {
      parPage.value = String(data.parPage);
      parPage.addEventListener("change", () => actions.surParPage(Number(parPage.value)));
    }

    return fragment;
  },
};

export { BarreOutilsView };
