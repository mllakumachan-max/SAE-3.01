import { genericRenderer, htmlToFragment } from "../../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Suppression d'une catégorie.
 * Règle retenue : si la catégorie contient des produits, ils doivent être
 * réaffectés à une autre catégorie. Sans autre catégorie, la suppression est bloquée.
 *
 * data : { id, nom, nbProduits, categories: [{id, nom}] }  (categories = les autres)
 */
let ConfirmationSuppressionCategorieView = {
  html: function (data = {}) {
    return genericRenderer(template, { nom: data.nom ?? "" });
  },

  /**
   * @param {object} data
   * @param {{surConfirmer?: (id, cibleId: string|null) => void, surFermer?: () => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(ConfirmationSuppressionCategorieView.html(data));
    let info = fragment.querySelector('[data-zone="info"]');
    let zoneReaff = fragment.querySelector('[data-zone="reaffectation"]');
    let select = zoneReaff.querySelector("select");
    let erreur = fragment.querySelector('[data-zone="erreur"]');
    let btnConfirmer = fragment.querySelector('[data-action="confirmer"]');
    let nb = Number(data.nbProduits || 0);
    let autres = data.categories || [];

    if (nb === 0) {
      info.textContent = "Cette catégorie ne contient aucun produit.";
      zoneReaff.hidden = true;
    } else {
      info.textContent = `Elle contient ${nb} produit${nb > 1 ? "s" : ""}.`;
      if (autres.length === 0) {
        erreur.textContent = "Impossible de supprimer : créez d'abord une autre catégorie pour y réaffecter ses produits.";
        erreur.classList.remove("hidden");
        btnConfirmer.disabled = true;
        zoneReaff.hidden = true;
      } else {
        autres.forEach((c) => {
          let opt = document.createElement("option");
          opt.value = c.id;
          opt.textContent = c.nom;
          select.appendChild(opt);
        });
      }
    }

    btnConfirmer.addEventListener("click", () => {
      let cible = nb > 0 ? select.value : null;
      actions.surConfirmer?.(data.id, cible);
    });
    fragment.querySelectorAll('[data-action="fermer"]').forEach((b) =>
      b.addEventListener("click", () => actions.surFermer?.())
    );
    return fragment;
  },
};

export { ConfirmationSuppressionCategorieView };