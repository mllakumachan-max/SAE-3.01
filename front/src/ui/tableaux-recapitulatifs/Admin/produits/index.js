import { genericRenderer, htmlToFragment } from "../../../../lib/utils.js";
import { BadgeStockView } from "../../../badge-stock/index.js";
import template from "./template.html?raw";

const LIGNE = `<tr class="text-zinc-900 dark:text-zinc-100">
  <td class="px-4 py-3 font-medium">{{nom}}</td>
  <td class="px-4 py-3">{{categorie}}</td>
  <td class="px-4 py-3">{{prix}} €</td>
  <td class="px-4 py-3">{{stock}}</td>
  <td class="px-4 py-3" data-zone="etat"></td>
  <td class="whitespace-nowrap px-4 py-3 text-right">
    <button type="button" data-action="modifier" data-id="{{id}}" class="mr-3 text-blue-600 underline hover:text-blue-700 dark:text-blue-400">Modifier</button>
    <button type="button" data-action="supprimer" data-id="{{id}}" class="text-red-700 underline hover:text-red-900 dark:text-red-400">Supprimer</button>
  </td>
</tr>`;

/**
 * Tableau des produits avec l'état du stock.
 * produits : [{ id, nom, categorie, prix, stock, seuilAlerte, etat }]
 */
let TableauProduitsView = {
  html: function () {
    return template;
  },

  dom: function (produits = [], actions = {}) {
    let fragment = htmlToFragment(template);
    let corps = fragment.querySelector('[data-zone="lignes"]');

    if (produits.length === 0) {
      corps.innerHTML = `<tr><td colspan="6" class="px-4 py-6 text-center text-zinc-500">Aucun produit pour le moment.</td></tr>`;
    } else {
      corps.innerHTML = produits.map((p) => genericRenderer(LIGNE, p)).join("");
      // Le badge d'état est un composant : on l'insère dans chaque cellule dédiée
      let lignes = corps.querySelectorAll("tr");
      produits.forEach((p, i) => {
        let zone = lignes[i].querySelector('[data-zone="etat"]');
        if (zone) {
          zone.appendChild(BadgeStockView.dom({ etat: p.etat, stock: p.stock, seuilAlerte: p.seuilAlerte }));
        }
      });
    }

    corps.addEventListener("click", (ev) => {
      let bouton = ev.target.closest("[data-action]");
      if (!bouton) return;
      if (bouton.dataset.action === "modifier") actions.surModifier?.(bouton.dataset.id);
      if (bouton.dataset.action === "supprimer") actions.surSupprimer?.(bouton.dataset.id);
    });

    return fragment;
  },
};

export { TableauProduitsView };