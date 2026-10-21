import { genericRenderer, htmlToFragment } from "../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Détail d'une commande passée avec le bouton « Commander à nouveau ».
 * commande : { numero, date, statut, modeRetrait, total,
 *              lignes: [{ nom, quantite, prix, options: {Taille: "M"} }] }
 */
let DetailCommandeView = {
  html: function (commande = {}) {
    return genericRenderer(template, {
      numero: commande.numero ?? "",
      date: commande.date ?? "",
      statut: commande.statut ?? "",
      modeRetrait: commande.modeRetrait ?? "",
      total: commande.total ?? "",
    });
  },

  /**
   * @param {object} commande
   * @param {{surCommanderANouveau?: (numero) => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (commande = {}, actions = {}) {
    let fragment = htmlToFragment(DetailCommandeView.html(commande));
    let liste = fragment.querySelector('[data-zone="lignes"]');

    (commande.lignes || []).forEach((ligne) => {
      let li = document.createElement("li");
      li.className = "flex items-center justify-between gap-4 py-3 text-sm";
      let gauche = document.createElement("div");
      let nom = document.createElement("p");
      nom.className = "font-medium text-zinc-900 dark:text-zinc-100";
      nom.textContent = ligne.nom;
      gauche.appendChild(nom);
      let options = Object.entries(ligne.options || {}).map(([k, v]) => `${k} : ${v}`).join(" · ");
      if (options) {
        let p = document.createElement("p");
        p.className = "text-xs text-zinc-500 dark:text-zinc-400";
        p.textContent = options;
        gauche.appendChild(p);
      }
      let droite = document.createElement("p");
      droite.className = "whitespace-nowrap text-zinc-700 dark:text-zinc-300";
      droite.textContent = `${ligne.quantite} × ${ligne.prix} €`;
      li.append(gauche, droite);
      liste.appendChild(li);
    });

    let btn = fragment.querySelector('[data-action="commander-a-nouveau"]');
    btn.addEventListener("click", () => actions.surCommanderANouveau?.(commande.numero));

    return fragment;
  },
};

export { DetailCommandeView };