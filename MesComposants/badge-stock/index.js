import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import icon from "./../../icons.hmtl";
import template from "./template.html?raw";

/**
 * Classes Tailwind complètes selon l'état du stock (STK-b) :
 * - "En stock" : vert (emerald)
 * - "Bientôt épuisé" : orange (amber) avec pulsation
 * - "Épuisé" : rouge (rose)
 */
const STYLES_ETAT = {
  "En stock": {
    classes: "border-black",
    iconClasse: "fill-emerald-500 dark:fill-emerald-400",
  },

  "Bientôt épuisé": {
    classes: "border-amber-200 bg-amber-50/90 text-amber-800 dark:border-amber-800/80 dark:bg-amber-950/80 dark:text-amber-300",
    iconClasse: "fill-amber-500 dark:fill-amber-400 animate-pulse",
  },

  "Épuisé": {
    classes: "border-rose-200 bg-rose-50/90 text-rose-800 dark:border-rose-800/80 dark:bg-rose-950/80 dark:text-rose-300",
    iconClasse: "fill-rose-500 dark:fill-rose-400",
  }
};

/**
 * Détermine le libellé d'état normalisé à partir d'une chaîne ou d'une quantité numérique.
 *
 * @param {{etat?: string, stock?: number, seuilAlerte?: number}} data
 * @returns {"En stock" | "Bientôt épuisé" | "Épuisé"}
 */
function normaliserEtat(data = {}) {
  if (data?.etat) {
    const etatLower = String(data.etat).toLowerCase().trim();
    if (etatLower.includes("bientot") || etatLower.includes("faible") || etatLower.includes("alerte")) {
      return "Bientôt épuisé";
    }
    if (etatLower.includes("épuisé") || etatLower.includes("epuise") || etatLower.includes("rupture")) {
      return "Épuisé";
    }
    return "En stock";
  }

  if (typeof data?.stock === "number") {
    if (data.stock <= 0) return "Épuisé";
    if (data.stock <= (data.seuilAlerte ?? 5)) return "Bientôt épuisé";
    return "En stock";
  }

  return "En stock";
}

/**
 * Composant d'affichage de l'état des stocks (STK-b).
 */
let BadgeStockView = {
  /**
   * Retourne la chaîne HTML du badge avec les classes appropriées.
   *
   * @param {{etat?: string, stock?: number, seuilAlerte?: number}} data
   * @returns {string}
   */
  html: function (data = {}) {
    const etat = normaliserEtat(data);
    const style = STYLES_ETAT[etat] || STYLES_ETAT["En stock"];

    return genericRenderer(template, {
      texte: etat,
      classes: style.classes,
      pointClasses: style.pointClasses,
    });
  },

  /**
   * Retourne le composant sous forme de DocumentFragment.
   *
   * @param {{etat?: string, stock?: number, seuilAlerte?: number}} data
   * @returns {DocumentFragment}
   */
  dom: function (data = {}) {
    return htmlToFragment(BadgeStockView.html(data));
  },
};

export { BadgeStockView };
