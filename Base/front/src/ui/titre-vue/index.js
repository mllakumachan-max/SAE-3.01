import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Titre de la page courante. Sous-titre facultatif.
 * data : { titre, sousTitre? }
 */
let TitreVueView = {
  html: function (data = {}) {
    return genericRenderer(template, { titre: data.titre ?? "", sousTitre: data.sousTitre ?? "" });
  },
  dom: function (data = {}) {
    let fragment = htmlToFragment(TitreVueView.html(data));
    if (!data.sousTitre) fragment.querySelector("p").remove();
    return fragment;
  },
};

export { TitreVueView };