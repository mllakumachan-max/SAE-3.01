import { genericRenderer, htmlToFragment } from "../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Formulaire de création ou de modification d'une catégorie.
 * Le composant ne valide rien : il recueille la saisie et la remet à la page.
 *
 * data : { id, nom, description }. Sans id, le formulaire est en création.
 */
let FormulaireCategorieView = {
  html: function (data = {}) {
    return genericRenderer(template, {
      titre: data.id ? "Modifier la catégorie" : "Nouvelle catégorie",
    });
  },

  /**
   * @param {object} data
   * @param {{surEnregistrer?: (valeurs: {libelle: string, description: string}) => void, surAnnuler?: () => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(FormulaireCategorieView.html(data));
    let form = fragment.querySelector("form");

    // Valeurs posées par propriété, jamais par HTML : aucune saisie n'est interprétée.
    form.elements.libelle.value = data.nom ?? "";
    form.elements.description.value = data.description ?? "";

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      actions.surEnregistrer?.({
        libelle: form.elements.libelle.value,
        description: form.elements.description.value,
      });
    });

    fragment.querySelector('[data-action="annuler"]').addEventListener("click", () => {
      actions.surAnnuler?.();
    });

    return fragment;
  },
};

export { FormulaireCategorieView };
