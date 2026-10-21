import { genericRenderer, htmlToFragment } from "../../../../lib/utils.js";
import template from "./template.html?raw";

const LIGNE = `<tr class="text-zinc-900 dark:text-zinc-100">
  <td class="px-4 py-3 font-medium">{{numero}}</td>
  <td class="px-4 py-3">{{date}}</td>
  <td class="px-4 py-3">{{client}}</td>
  <td class="px-4 py-3">{{total}} €</td>
  <td class="px-4 py-3">{{statut}}</td>
  <td class="whitespace-nowrap px-4 py-3 text-right">
    <button type="button" data-action="detail" data-id="{{id}}" class="mr-3 text-blue-600 underline hover:text-blue-700 dark:text-blue-400">Détail</button>
    <button type="button" data-action="annuler" data-id="{{id}}" class="text-red-700 underline hover:text-red-900 dark:text-red-400">Annuler</button>
  </td>
</tr>`;

/**
 * Tableau des commandes.
 * « Annuler » n'est proposé que tant que la commande n'est pas retirée.
 * commandes : [{ id, numero, date, client, total, statut }]
 */
let TableauCommandesView = {
  html: function () {
    return template;
  },

  dom: function (commandes = [], actions = {}) {
    let fragment = htmlToFragment(template);
    let corps = fragment.querySelector('[data-zone="lignes"]');

    if (commandes.length === 0) {
      corps.innerHTML = `<tr><td colspan="6" class="px-4 py-6 text-center text-zinc-500">Aucune commande pour le moment.</td></tr>`;
      return fragment;
    }

    corps.innerHTML = commandes.map((c) => genericRenderer(LIGNE, c)).join("");

    // Pas d'annulation d'une commande déjà retirée ou annulée
    let lignes = corps.querySelectorAll("tr");
    commandes.forEach((c, i) => {
      if (c.statut === "retirée" || c.statut === "annulée") {
        lignes[i].querySelector('[data-action="annuler"]').remove();
      }
    });

    corps.addEventListener("click", (ev) => {
      let bouton = ev.target.closest("[data-action]");
      if (!bouton) return;
      if (bouton.dataset.action === "detail") actions.surDetail?.(bouton.dataset.id);
      if (bouton.dataset.action === "annuler") actions.surAnnuler?.(bouton.dataset.id);
    });

    return fragment;
  },
};

export { TableauCommandesView };