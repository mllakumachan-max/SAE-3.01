import { appliquerSeo } from "../../lib/seo.js";
import template from "./template.html?raw";

// Page statique : elle renvoie son template tel quel.
export function The404Page() {
  // Le titre et la description doivent dire la même chose que la page.
  appliquerSeo({
    titre: "Page introuvable",
    description: "Cette page n'existe pas : revenez au catalogue de la boutique.",
    chemin: "/",
  });

  return template;
}
