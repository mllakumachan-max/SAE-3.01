import { htmlToFragment } from "../../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Choix des options d'un produit : une liste de boutons radio par option.
 * Les valeurs indisponibles ne sont pas sélectionnables.
 *
 * data : {
 *   options: [{ nom: "Taille", valeurs: ["S","M","L"], indisponibles?: ["L"] }],
 *   selection?: { Taille: "M" }
 * }
 */
let OptionsView = {
  html: function () {
    return template;
  },

  /**
   * @param {{options?: Array<{nom: string, valeurs: string[], indisponibles?: string[]}>,
   *          selection?: Object<string, string>}} data
   * @param {{surChange?: (selection: Object<string, string>) => void}} actions
   * @returns {DocumentFragment}
   */
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(template);
    let zone = fragment.querySelector('[data-zone="groupes"]');
    let selection = { ...(data.selection || {}) };

    (data.options || []).forEach((option) => {
      let groupe = document.createElement("div");
      groupe.className = "flex flex-col gap-2";

      let titre = document.createElement("p");
      titre.className = "text-sm font-medium text-zinc-900 dark:text-zinc-100";
      titre.textContent = `${option.nom} : ${selection[option.nom] ?? "non choisi"}`;
      groupe.appendChild(titre);

      let liste = document.createElement("div");
      liste.className = "flex flex-wrap gap-2";

      option.valeurs.forEach((valeur) => {
        let indispo = (option.indisponibles || []).includes(valeur);
        let label = document.createElement("label");
        label.className = "cursor-pointer rounded-md border border-zinc-200 px-3 py-2 text-sm has-[:checked]:border-zinc-950 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40 dark:border-zinc-800 dark:text-zinc-100 dark:has-[:checked]:border-zinc-50";

        let radio = document.createElement("input");
        radio.type = "radio";
        radio.name = option.nom;
        radio.value = valeur;
        radio.className = "sr-only";
        radio.disabled = indispo;
        radio.checked = selection[option.nom] === valeur;

        radio.addEventListener("change", () => {
          selection[option.nom] = valeur;
          titre.textContent = `${option.nom} : ${valeur}`;
          if (actions.surChange) actions.surChange({ ...selection });
        });

        label.appendChild(radio);
        label.append(indispo ? `${valeur} (épuisé)` : valeur);
        liste.appendChild(label);
      });

      groupe.appendChild(liste);
      zone.appendChild(groupe);
    });

    return fragment;
  },
};

export { OptionsView };