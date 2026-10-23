import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let BarreRechercheView = {
  html: function (data = {}) {
    return template;
  },
  dom: function (data = {}, actions = {}) {
    let fragment = htmlToFragment(BarreRechercheView.html(data));
    let input = fragment.querySelector('input[type="search"]');
    if (input && actions.surRecherche) {
      input.addEventListener("input", (e) => actions.surRecherche(e.target.value));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          actions.surRecherche?.(e.target.value);
        }
      });
    }
    return fragment;
  },
};

export { BarreRechercheView };
