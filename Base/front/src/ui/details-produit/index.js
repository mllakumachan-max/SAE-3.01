import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import { BadgeStockView } from "../badge-stock/index.js";
import { QuantiteView } from "../boutons/Quantite/index.js";
import { GalerieImagesView } from "../galerie-images/index.js";
import { LienRetourView } from "../lien-retour/index.js";
import { OptionsView } from "../boutons/Options/index.js";
import template from "./template.html?raw";

/**
 * Fiche détaillée d'un produit :
 * image, description, prix, options, quantité et ajout au panier.
 * Ce n'est PAS la carte de la grille : voir carte-produit pour celle-ci.
 *
 * produit : { id, nom, prixBase, prixActuel, src, alt, description, etat, stock,
 *             seuilAlerte, images, options, selection, quantite,
 *             lienCategorie, lienCatalogue }
 */
let DetailProduitView = {
  /**
   * @param {object} produit
   * @returns {string}
   */
  html: function (produit = {}) {
    const prixFormate =
      typeof produit.prixActuel === "number"
        ? produit.prixActuel.toFixed(2).replace(".", ",")
        : String(produit.prixActuel || "0,00");

    return genericRenderer(template, {
      nom: produit.nom || "",
      prix: prixFormate,
      description: produit.description || "",
    });
  },

  /**
   * @param {object} produit
   * @param {{surAjouterPanier?: (id: number|string) => void,
   *          surSelectionChange?: (nom: string, valeur: string) => void,
   *          surQuantite?: (quantite: number) => void}} actions
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

    // Choix des options inséré dans sa zone
    let zoneOptions = fragment.querySelector('[data-zone="options"]');
    if (zoneOptions) {
      zoneOptions.replaceWith(
        OptionsView.dom(
          {
            options: produit.options || [],
            selection: produit.selection || {},
          },
          {
            surChange: (selection) => {
              // On ne sait pas quelle option a changé : on compare avec la
              // sélection précédemment affichée pour n'appliquer que le choix
              // de l'utilisateur, puis on rafraichit le prix.
              const precedente = produit.selection || {};
              for (const option of produit.options || []) {
                const valeur = selection[option.nom];
                if (valeur !== undefined && valeur !== precedente[option.nom]) {
                  if (actions.surSelectionChange) {
                    actions.surSelectionChange(option.nom, valeur);
                  }
                }
              }
            },
          }
        )
      );
    }

    // Contrôleur de quantité inséré dans son slot
    let slotQuantite = fragment.querySelector('slot[name="quantite"]');
    if (slotQuantite) {
      slotQuantite.replaceWith(
        QuantiteView.dom(
          { valeur: produit.quantite ?? 1, min: 1, max: produit.stock },
          { surChange: (q) => { if (actions.surQuantite) actions.surQuantite(q); } }
        )
      );
    }

    // Galerie d'images insérée dans son slot
    let slotGalerie = fragment.querySelector('slot[name="galerie"]');
    if (slotGalerie) {
      slotGalerie.replaceWith(GalerieImagesView.dom(produit.images ?? []));
    }

    // Liens de retour : vers le catalogue, et vers la catégorie du produit
    let slotCatalogue = fragment.querySelector('slot[name="lien-retour-catalogue"]');
    if (slotCatalogue) {
      slotCatalogue.replaceWith(
        LienRetourView.dom({
          libelle: produit.libelleCatalogue ?? "Tous les produits",
          lien: produit.lienCatalogue ?? "/",
        })
      );
    }

    let slotCategorie = fragment.querySelector('slot[name="lien-retour-categorie"]');
    if (slotCategorie) {
      slotCategorie.replaceWith(
        LienRetourView.dom({
          libelle: produit.libelleCategorie ?? "Catégorie",
          lien: produit.lienCategorie ?? "/",
        })
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
          actions.surAjouterPanier(produit.id);
        });
      }
    }

    return fragment;
  },
};

export { DetailProduitView };
