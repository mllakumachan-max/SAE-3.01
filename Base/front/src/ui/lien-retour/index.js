import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Lien de retour (« ← Retour au catalogue », « ← Continuer mes achats »).
 * data : { libelle, lien }
 */
let LienRetourView = {
  html: function (data = {}) {
    return genericRenderer(template, { libelle: data.libelle ?? "Retour", lien: data.lien ?? "#" });
  },
  dom: function (data = {}) {
    return htmlToFragment(LienRetourView.html(data));
  },
};

export { LienRetourView };