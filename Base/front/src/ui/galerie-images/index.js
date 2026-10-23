import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Galerie d'images d'un produit : image principale, flèches et miniatures.
 * images : [{ chemin, src, alt, ordre }]
 *
 * options.activeChemin : chemin de l'image à afficher en principal (optionnel).
 *   Quand il correspond à une image, celle-ci est affichée et sa miniature
 *   est mise en avant. Sinon, la première image est affichée.
 */
let GalerieImagesView = {
  html: function () {
    return template;
  },

  /**
   * @param {Array<{chemin?: string, src: string, alt?: string, ordre: number}>} images
   * @param {{activeChemin?: string|null}} options
   * @returns {DocumentFragment}
   */
  dom: function (images = [], options = {}) {
    let fragment = htmlToFragment(template);
    let principale = fragment.querySelector('[data-zone="principale"]');
    let zoneMiniatures = fragment.querySelector('[data-zone="miniatures"]');
    let btnPrec = fragment.querySelector('[data-action="precedent"]');
    let btnSuiv = fragment.querySelector('[data-action="suivant"]');
    let index = 0;
    let miniatures = [];
    let activeChemin = options.activeChemin ?? null;

    let zoneIndex = fragment.querySelector('[data-zone="index-image"]');
    let zoneTotal = fragment.querySelector('[data-zone="total-images"]');

    if (zoneTotal) {
      zoneTotal.textContent = String(images.length || 1);
    }

    if (images.length <= 1) {
      if (btnPrec) btnPrec.hidden = true;
      if (btnSuiv) btnSuiv.hidden = true;
    }

    // Indice de l'image à afficher : celle dont le chemin correspond à
    // activeChemin, sinon la première.
    let indiceActif = function () {
      if (activeChemin !== null) {
        const trouve = images.findIndex((img) => img.chemin === activeChemin);
        if (trouve !== -1) {
          return trouve;
        }
      }
      return 0;
    };

    let afficher = (i) => {
      index = (i + images.length) % images.length;
      principale.src = images[index].src;
      principale.alt = images[index].alt || "";
      if (zoneIndex) {
        zoneIndex.textContent = String(index + 1);
      }
      miniatures.forEach((m, k) => m.setAttribute("aria-current", k === index ? "true" : "false"));
    };

    images.forEach((img, i) => {
      let bouton = document.createElement("button");
      bouton.type = "button";
      bouton.setAttribute("aria-label", `Voir l'image ${i + 1}`);
      bouton.className = "h-16 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 aria-[current=true]:border-zinc-950 dark:aria-[current=true]:border-zinc-50";
      let mini = document.createElement("img");
      mini.src = img.src;
      mini.alt = "";
      mini.className = "h-full w-full object-contain";
      bouton.appendChild(mini);
      bouton.addEventListener("click", () => afficher(i));
      zoneMiniatures.appendChild(bouton);
      miniatures.push(bouton);
    });

    if (images.length > 0) afficher(indiceActif());
    return fragment;
  },
};

export { GalerieImagesView };