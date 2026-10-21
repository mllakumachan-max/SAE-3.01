import { genericRenderer, htmlToFragment } from "../../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Formulaire de modification des options d'un article.
 *
 * data : {
 *   nom: string,
 *   options: Array<{ nom: string, valeurs: string[] }>,  // ex. { nom: "Taille", valeurs: ["S","M","L"] }
 *   selection?: { [nomOption]: valeurChoisie }
 * }
 */
let FormulaireModifOptionsView = {
  /**
   * @param {{nom?: string}} data
   * @returns {string}
   */
  html: function (data = {}) {
    return genericRenderer(template, { nom: data.nom || "" });
  },

  /**
   * @param {{nom?: string, options?: Array<{nom: string, valeurs: string[]}>,
   *          selection?: Object<string, string>}} data
   * @param {{surEnregistrer?: (selection: Object<string, string>) => void,
   *          surFermer?: () => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(FormulaireModifOptionsView.html(data));
    let zone = fragment.querySelector('[data-zone="options"]');
    let formulaire = fragment.querySelector("form");
    let selects = {};

    // Un <select> par option, construit avec createElement : les valeurs ne passent
    // jamais par du HTML brut.
    (data.options || []).forEach((option) => {
      let label = document.createElement("label");
      label.className = "flex flex-col gap-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100";
      label.textContent = option.nom;

      let select = document.createElement("select");
      select.name = option.nom;
      select.className = "h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm font-normal dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100";

      option.valeurs.forEach((valeur) => {
        let opt = document.createElement("option");
        opt.value = valeur;
        opt.textContent = valeur;
        if (data.selection?.[option.nom] === valeur) opt.selected = true;
        select.appendChild(opt);
      });

      label.appendChild(select);
      zone.appendChild(label);
      selects[option.nom] = select;
    });

    if (formulaire) {
      formulaire.addEventListener("submit", (ev) => {
        ev.preventDefault();
        let selection = {};
        for (let nom in selects) selection[nom] = selects[nom].value;
        if (actions.surEnregistrer) actions.surEnregistrer(selection);
      });
    }

    fragment.querySelectorAll('[data-action="fermer"]').forEach((btn) => {
      if (actions.surFermer) btn.addEventListener("click", () => actions.surFermer());
    });

    return fragment;
  },
};

export { FormulaireModifOptionsView };