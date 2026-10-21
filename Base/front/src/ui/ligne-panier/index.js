import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import { QuantiteView } from "../boutons/Quantite/index.js";
import template from "./template.html?raw";

/**
 * Une ligne du panier : image, nom, options choisies,
 * quantité (bornée par le stock) et total de la ligne.
 *
 * article : { id, nom, prix, quantite, stock, src, alt, lien, options: {Taille: "M"} }
 */
let LignePanierView = {
  html: function (article = {}) {
    const prixFormate =
      typeof article.prix === "number"
        ? article.prix.toFixed(2).replace(".", ",")
        : String(article.prix || "0,00");

    return genericRenderer(template, {
      src: article.src || "",
      alt: article.alt || article.nom || "",
      lien: article.lien || "#",
      nom: article.nom || "",
      prix: prixFormate,
    });
  },

  /** Total de la ligne : prix unitaire × quantité, options incluses. */
  total: function (article) {
    let prixOptions = Number(article.prixOptions || 0);
    return (Number(article.prix) + prixOptions) * Number(article.quantite || 1);
  },

  /**
   * @param {object} article
   * @param {{surQuantite?: (id, quantite) => void, surSupprimer?: (id) => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (article = {}, actions = {}) {
    let fragment = htmlToFragment(LignePanierView.html(article));

    let texteOptions = Object.entries(article.options || {})
      .map(([nom, valeur]) => `${nom} : ${valeur}`)
      .join(" · ");
    let zoneOptions = fragment.querySelector('[data-zone="options"]');
    if (zoneOptions) {
      zoneOptions.textContent = texteOptions;
    }

    let zoneQuantite = fragment.querySelector('[data-zone="quantite"]');
    if (zoneQuantite) {
      zoneQuantite.replaceWith(
        QuantiteView.dom(
          { valeur: article.quantite, min: 1, max: article.stock },
          { surChange: (q) => actions.surQuantite?.(article.id, q) }
        )
      );
    }

    let zoneTotal = fragment.querySelector('[data-zone="total"]');
    zoneTotal.textContent = LignePanierView.total(article).toFixed(2).replace(".", ",") + " €";

    let btnSupprimer = fragment.querySelector('[data-action="supprimer"]');
    btnSupprimer.addEventListener("click", () => actions.surSupprimer?.(article.id));

    return fragment;
  },
};

export { LignePanierView };