import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import templateLigne from "./ligne.html?raw";

/**
 * Caractéristiques d'un produit : référence, marque, format, prix unitaire et
 * rayon. Seules les informations réellement connues sont affichées.
 *
 * produit : { reference, marque, format, prix_unitaire, unite_prix,
 *             sous_categorie }
 */
let InfosProduitView = {
  /**
   * Les caractéristiques à afficher, dans l'ordre d'importance.
   *
   * @param {object} produit
   * @returns {Array<{libelle: string, valeur: string}>}
   */
  caracteristiques: function (produit = {}) {
    const prixUnitaire =
      produit.prix_unitaire === null || produit.prix_unitaire === undefined
        ? null
        : Number(produit.prix_unitaire).toFixed(2).replace(".", ",");

    const caracteristiques = [
      { libelle: "Référence", valeur: produit.reference },
      { libelle: "Marque", valeur: produit.marque },
      { libelle: "Format", valeur: produit.format },
      {
        libelle: "Prix unitaire",
        valeur:
          prixUnitaire === null
            ? null
            : `${prixUnitaire} ${produit.unite_prix ?? "€"}`.trim(),
      },
      {
        libelle: "Rayon",
        valeur: produit.sous_categorie?.libelle ?? produit.sous_categorie ?? null,
      },
    ];

    return caracteristiques.filter((caracteristique) => Boolean(caracteristique.valeur));
  },

  /**
   * @param {object} produit
   * @returns {string}
   */
  html: function (produit = {}) {
    const lignes = InfosProduitView.caracteristiques(produit)
      .map((caracteristique) => genericRenderer(templateLigne, caracteristique))
      .join("");

    // Les lignes sont construites ici, à partir de valeurs échappées une à une :
    // seule cette partie du template est insérée sans échappement.
    return genericRenderer(template, {}).replace("{{lignes}}", lignes);
  },

  /**
   * @param {object} produit
   * @returns {DocumentFragment}
   */
  dom: function (produit = {}) {
    return htmlToFragment(InfosProduitView.html(produit));
  },
};

export { InfosProduitView };
