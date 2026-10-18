import { genericRenderer, htmlToFragment } from "../../../../lib/utils.js";
import { BadgeStockView } from "../../../badge-stock/index.js";
import template from "./template.html?raw";

const LIGNE = `<tr class="text-zinc-900 dark:text-zinc-100">
  <td class="px-4 py-3 font-medium">{{nom}}</td>
  <td class="px-4 py-3">{{stock}}</td>
  <td class="px-4 py-3">{{seuilAlerte}}</td>
  <td class="px-4 py-3" data-zone="etat"></td>
</tr>`;

/**
 * Tableau des stocks par produit.
 * stocks : [{ nom, stock, seuilAlerte, etat }]
 */
let TableauStocksView = {
  html: function () {
    return template;
  },

  dom: function (stocks = []) {
    let fragment = htmlToFragment(template);
    let corps = fragment.querySelector('[data-zone="lignes"]');

    if (stocks.length === 0) {
      corps.innerHTML = `<tr><td colspan="4" class="px-4 py-6 text-center text-zinc-500">Aucun stock à afficher.</td></tr>`;
      return fragment;
    }

    corps.innerHTML = stocks.map((s) => genericRenderer(LIGNE, s)).join("");
    let lignes = corps.querySelectorAll("tr");
    stocks.forEach((s, i) => {
      let zone = lignes[i].querySelector('[data-zone="etat"]');
      if (zone) {
        zone.appendChild(BadgeStockView.dom({ etat: s.etat, stock: s.stock, seuilAlerte: s.seuilAlerte }));
      }
    });

    return fragment;
  },
};

export { TableauStocksView };