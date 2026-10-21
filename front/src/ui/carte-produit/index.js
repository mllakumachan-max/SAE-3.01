import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import { BadgeStockView } from "../badge-stock/index.js";
import template from "./template.html?raw";

/**
 * Carte d'un produit e-commerce Action :
 * { id, nom, prix, src, alt, etat, stock, seuilAlerte, lien }
 */
let CarteProduitView = {
  /**
   * @param {{
   *   id: number|string,
   *   nom: string,
   *   prix: number|string,
   *   src?: string,
   *   alt?: string,
   *   etat?: string,
   *   stock?: number,
   *   seuilAlerte?: number,
   *   lien?: string
   * }} produit
   * @returns {string}
   */
  html: function (produit = {}) {
    const prixFormate =
      typeof produit.prix === "number"
        ? produit.prix.toFixed(2).replace(".", ",")
        : String(produit.prix || "0,00");

    return genericRenderer(template, {
      nom: produit.nom || "",
      prix: prixFormate,
      src: produit.src || produit.image || "",
      alt: produit.alt || produit.nom || "Produit Action",
      lien: produit.lien || (produit.id ? `/produit/${produit.id}` : "#"),
    });
  },

  /**
   * @param {{
   *   id: number|string,
   *   nom: string,
   *   prix: number|string,
   *   src?: string,
   *   alt?: string,
   *   etat?: string,
   *   stock?: number,
   *   seuilAlerte?: number,
   *   lien?: string
   * }} produit
   * @param {{surAjouterPanier?: (id: number|string) => void}} [actions]
   * @returns {DocumentFragment}
   */
  dom: function (produit = {}, actions = {}) {
    let fragment = htmlToFragment(CarteProduitView.html(produit));

    // Insertion dynamique du composant badge-stock dans son slot
    let slotBadge = fragment.querySelector('slot[name="badge-stock"]');
    if (slotBadge) {
      slotBadge.replaceWith(
        BadgeStockView.dom({
          etat: produit.etat,
          stock: produit.stock,
          seuilAlerte: produit.seuilAlerte,
        })
      );
    }

    // Gestion du bouton d'ajout au panier selon disponibilité
    let btnAjout = fragment.querySelector('[data-action="ajouter-panier"]');
    const estEpuise =
      produit.etat === "Épuisé" ||
      produit.etat === "epuise" ||
      produit.stock === 0;

    if (btnAjout) {
      if (estEpuise) {
        btnAjout.disabled = true;
        btnAjout.textContent = "Épuisé";
      } else if (actions.surAjouterPanier) {
        btnAjout.addEventListener("click", () => actions.surAjouterPanier(produit.id));
      }
    }

    return fragment;
  },
};

export { CarteProduitView };
