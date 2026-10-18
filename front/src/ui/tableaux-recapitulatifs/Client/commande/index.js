import { genericRenderer, htmlToFragment } from "../../../../lib/utils.js";
import template from "./template.html?raw";

// Gabarit d'une ligne du récapitulatif (les valeurs sont échappées).
const LIGNE = `<li class="flex items-start justify-between gap-4 py-3 text-sm">
  <div>
    <p class="font-medium text-zinc-900 dark:text-zinc-100">{{nom}}</p>
    <p class="text-xs text-zinc-500 dark:text-zinc-400">{{options}}</p>
  </div>
  <p class="whitespace-nowrap text-zinc-700 dark:text-zinc-300">{{quantite}} × {{prix}} €</p>
</li>`;

/**
 * Récapitulatif de commande avant validation : lignes, mode de retrait,
 * total, puis confirmation explicite par un clic.
 * commande : { lignes: [{nom, quantite, prix, options}], modeRetrait, total }
 */
let RecapitulatifCommandeView = {
  html: function () {
    return template;
  },

  dom: function (commande = {}, actions = {}) {
    let fragment = htmlToFragment(template);
    let liste = fragment.querySelector('[data-zone="lignes"]');

    liste.innerHTML = (commande.lignes || [])
      .map((l) =>
        genericRenderer(LIGNE, {
          nom: l.nom,
          quantite: l.quantite,
          prix: l.prix,
          options: Object.entries(l.options || {}).map(([k, v]) => `${k} : ${v}`).join(" · "),
        })
      )
      .join("");

    fragment.querySelector('[data-zone="retrait"]').textContent = commande.modeRetrait || "";
    fragment.querySelector('[data-zone="total"]').textContent =
      Number(commande.total || 0).toFixed(2).replace(".", ",") + " €";

    fragment.querySelector('[data-action="confirmer"]').addEventListener("click", () => actions.surConfirmer?.(commande));
    fragment.querySelector('[data-action="retour"]').addEventListener("click", () => actions.surRetour?.());

    return fragment;
  },
};

export { RecapitulatifCommandeView };