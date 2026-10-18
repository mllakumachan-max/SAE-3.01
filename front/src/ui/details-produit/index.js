import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import { BadgeStockView } from "../badge-stock/index.js";
import { QuantiteView } from "../boutons/Quantite/index.js";
import template from "./template.html?raw";

/**
 * Fiche détaillée d'un produit :
 * image, description, prix, stock, quantité et ajout au panier.
 * Ce n'est PAS la carte de la grille : voir carte-produit pour celle-ci.
 *
 * produit : { id, nom, prix, src, alt, description, etat, stock, seuilAlerte,
 *             lienCategorie, lienCatalogue }
 */
let DetailProduitView = {
  /**
   * @param {object} produit
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
      description: produit.description || "",
    });
  },

  /**
   * @param {object} produit
   * @param {{surAjouterPanier?: (id: number|string, quantite: number) => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (produit = {}, actions = {}) {
    let fragment = htmlToFragment(DetailProduitView.html(produit));

    // Badge de stock inséré dans son slot
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

    // Contrôleur de quantité inséré dans son slot
    let quantiteChoisie = 1;
    let slotQuantite = fragment.querySelector('slot[name="quantite"]');
    if (slotQuantite) {
      slotQuantite.replaceWith(
        QuantiteView.dom(
          { valeur: 1, min: 1, max: produit.stock },
          { surChange: (q) => { quantiteChoisie = q; } }
        )
      );
    }

    let btnAjout = fragment.querySelector('[data-action="ajouter-panier"]');
    const estEpuise = produit.etat === "Épuisé" || produit.stock === 0;

    if (btnAjout) {
      if (estEpuise) {
        btnAjout.disabled = true;
        btnAjout.textContent = "Épuisé";
      } else if (actions.surAjouterPanier) {
        btnAjout.addEventListener("click", () => {
          actions.surAjouterPanier(produit.id, quantiteChoisie);
        });
      }
    }

    return fragment;
  },
};

export { DetailProduitView };