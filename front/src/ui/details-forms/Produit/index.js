import { genericRenderer, htmlToFragment } from "../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Formulaire admin de création ou modification d'un produit.
 * produit : { id?, nom, categorieId, description, prix, stock, seuilAlerte }
 * categories : [{ id, nom }]
 */
let ProduitFormView = {
  html: function (produit = {}) {
    return genericRenderer(template, {
      titre: produit.id ? "Modifier le produit" : "Nouveau produit",
      nom: produit.nom ?? "",
      description: produit.description ?? "",
      prix: produit.prix ?? "",
      stock: produit.stock ?? 0,
      seuilAlerte: produit.seuilAlerte ?? 5,
    });
  },

  /** Renvoie un message d'erreur clair (en français), ou null. */
  valider: function (v) {
    if (!v.nom.trim()) return "Le nom du produit est obligatoire.";
    if (!v.categorieId) return "Choisissez une catégorie.";
    if (v.prix === "" || Number(v.prix) < 0) return "Le prix doit être un nombre positif.";
    if (!Number.isInteger(Number(v.stock)) || Number(v.stock) < 0) return "Le stock doit être un entier positif ou nul.";
    if (!Number.isInteger(Number(v.seuilAlerte)) || Number(v.seuilAlerte) < 0) return "Le seuil d'alerte doit être un entier positif ou nul.";
    return null;
  },

  /**
   * @param {object} produit
   * @param {{categories?: Array<{id, nom}>, surEnregistrer?: (v) => void, surAnnuler?: () => void}} options
   * @returns {DocumentFragment}
   */
  dom: function (produit = {}, options = {}) {
    let fragment = htmlToFragment(ProduitFormView.html(produit));
    let formulaire = fragment.querySelector("form");
    let message = fragment.querySelector('[data-zone="message"]');
    let select = fragment.querySelector('[data-zone="categories"]');

    (options.categories || []).forEach((c) => {
      let opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nom;
      opt.selected = String(c.id) === String(produit.categorieId);
      select.appendChild(opt);
    });

    formulaire.addEventListener("submit", (ev) => {
      ev.preventDefault();
      let v = Object.fromEntries(new FormData(formulaire));
      v.nom = v.nom || "";
      let erreur = ProduitFormView.valider(v);
      message.textContent = erreur || "";
      message.classList.toggle("hidden", !erreur);
      if (!erreur && options.surEnregistrer) options.surEnregistrer(v);
    });

    fragment.querySelector('[data-action="annuler"]').addEventListener("click", () => options.surAnnuler?.());
    return fragment;
  },
};

export { ProduitFormView };