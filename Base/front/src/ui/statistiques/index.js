import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import templateLigne from "./ligne-stats.html?raw";

/**
 * Composant Tableau de bord statistiques (Epic 3.9 - PIL-a) :
 * - Revenus des 7 derniers jours
 * - Statistiques des commandes (nombre, statuts)
 * - Histogramme des stocks par produit
 * - Top des produits vendus
 * - Alertes de stocks faibles
 *
 * @typedef {{
 *   revenus7j?: number,
 *   totalCommandes?: number,
 *   totalProduits?: number,
 *   alertesStock?: number,
 *   statutsCommandes?: Array<{statut: string, nombre: number}>,
 *   stocksParProduit?: Array<{nom: string, stock: number, seuilAlerte?: number}>,
 *   topVentes?: Array<{nom: string, quantite: number, totalVentes?: number}>
 * }} StatsECommerce
 */
let StatistiquesView = {
  /**
   * Génère le HTML initial du tableau de bord.
   *
   * @param {StatsECommerce} stats
   * @returns {string}
   */
  html: function (stats = {}) {
    const revenus =
      typeof stats.revenus7j === "number"
        ? stats.revenus7j.toFixed(2).replace(".", ",")
        : "0,00";

    return genericRenderer(template, {
      revenus7j: revenus,
      totalCommandes: stats.totalCommandes ?? 0,
      totalProduits: stats.totalProduits ?? 0,
      alertesStock: stats.alertesStock ?? 0,
    });
  },

  /**
   * Construit le DocumentFragment interactif avec l'histogramme et les listes.
   *
   * @param {StatsECommerce} stats
   * @returns {DocumentFragment}
   */
  dom: function (stats = {}) {
    let fragment = htmlToFragment(StatistiquesView.html(stats));

    // 1. Commandes par statut
    let zoneStatuts = fragment.querySelector('[data-zone="statuts-commandes"]');
    if (zoneStatuts && Array.isArray(stats.statutsCommandes)) {
      stats.statutsCommandes.forEach((item) => {
        let div = document.createElement("div");
        div.className = "flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950";
        div.innerHTML = `
          <span class="capitalize text-zinc-600 dark:text-zinc-400">${item.statut}</span>
          <span class="font-bold text-zinc-900 dark:text-zinc-100">${item.nombre}</span>
        `;
        zoneStatuts.appendChild(div);
      });
    }

    // 2. Histogramme des stocks par produit (CSS natif)
    let zoneStocks = fragment.querySelector('[data-zone="graphique-stocks"]');
    if (zoneStocks && Array.isArray(stats.stocksParProduit)) {
      const maxStock = Math.max(...stats.stocksParProduit.map((p) => p.stock || 0), 1);

      stats.stocksParProduit.forEach((prod) => {
        let pct = Math.max(5, Math.round(((prod.stock || 0) / maxStock) * 100));
        let estFaible = (prod.stock || 0) <= (prod.seuilAlerte ?? 5);

        let barre = document.createElement("div");
        barre.className = "flex items-center gap-3 text-xs";

        let nom = document.createElement("span");
        nom.className = "w-40 shrink-0 truncate text-zinc-700 dark:text-zinc-300";
        nom.textContent = prod.nom;
        nom.title = prod.nom;

        let conteneurBarre = document.createElement("div");
        conteneurBarre.className = "h-4 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800";

        let fill = document.createElement("div");
        fill.className = estFaible
          ? "h-full rounded-full bg-amber-500 transition-all duration-300"
          : "h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300";
        fill.style.width = `${pct}%`;

        let valeur = document.createElement("span");
        valeur.className = "w-8 text-right font-medium text-zinc-900 dark:text-zinc-100";
        valeur.textContent = prod.stock;

        conteneurBarre.appendChild(fill);
        barre.append(nom, conteneurBarre, valeur);
        zoneStocks.appendChild(barre);
      });
    }

    // 3. Top des ventes
    let zoneVentes = fragment.querySelector('[data-zone="top-ventes"]');
    if (zoneVentes && Array.isArray(stats.topVentes)) {
      stats.topVentes.forEach((v) => {
        let htmlLigne = genericRenderer(templateLigne, {
          nom: v.nom || "Article",
          detail: `${v.quantite || 0} vendus`,
          valeur: v.totalVentes ? `${Number(v.totalVentes).toFixed(2).replace(".", ",")} €` : "",
        });
        zoneVentes.appendChild(htmlToFragment(htmlLigne));
      });
    }

    return fragment;
  },
};

export { StatistiquesView };
