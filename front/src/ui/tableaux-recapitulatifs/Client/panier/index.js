import { htmlToFragment } from "../../../../lib/utils.js";
import { LignePanierView } from "../../../ligne-panier/index.js";
import template from "./template.html?raw";

/**
 * Contenu du panier : une ligne par article, total recalculé à chaque changement.
 * Les lignes sont composées avec LignePanierView, comme la grille compose les cartes.
 *
 * articles : [{ id, nom, prix, quantite, stock, src, alt, lien, options, prixOptions }]
 */
let PanierView = {
  html: function () {
    return template;
  },

  /** Total du panier en euros (somme des lignes, options incluses). */
  total: function (articles = []) {
    return articles.reduce((somme, a) => somme + LignePanierView.total(a), 0);
  },

  /**
   * @param {Array<object>} articles
   * @param {{surQuantite?, surSupprimer?, surValider?, surContinuer?}} actions
   * @returns {DocumentFragment}
   */
  dom: function (articles = [], actions = {}) {
    let fragment = htmlToFragment(template);
    let liste = fragment.querySelector('[data-zone="lignes"]');
    let vide = fragment.querySelector('[data-zone="vide"]');
    let btnValider = fragment.querySelector('[data-action="valider"]');

    let remplir = (liste) => {
      liste.innerHTML = "";
      articles.forEach((a) => {
        liste.appendChild(
          LignePanierView.dom(a, {
            surQuantite: (id, q) => {
              a.quantite = q;
              majTotal();
              actions.surQuantite?.(id, q);
            },
            surSupprimer: (id) => {
              articles.splice(articles.indexOf(a), 1);
              remplir(liste);
              majTotal();
              actions.surSupprimer?.(id);
            },
          })
        );
      });
    };

    let majTotal = () => {
      fragment.querySelector('[data-zone="total"]').textContent =
        PanierView.total(articles).toFixed(2).replace(".", ",") + " €";
      btnValider.disabled = articles.length === 0;
      vide.classList.toggle("hidden", articles.length > 0);
    };

    remplir(liste);
    majTotal();

    btnValider.addEventListener("click", () => actions.surValider?.(articles));
    fragment.querySelector('[data-action="continuer"]').addEventListener("click", () => actions.surContinuer?.());

    return fragment;
  },
};

export { PanierView };