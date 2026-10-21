import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Galerie d'images d'un produit : image principale, flèches et miniatures.
 * images : [{ src, alt }]
 */
let GalerieImagesView = {
  html: function () {
    return template;
  },

  /** @param {Array<{src: string, alt?: string}>} images @returns {DocumentFragment} */
  dom: function (images = []) {
    let fragment = htmlToFragment(template);
    let principale = fragment.querySelector('[data-zone="principale"]');
    let zoneMiniatures = fragment.querySelector('[data-zone="miniatures"]');
    let btnPrec = fragment.querySelector('[data-action="precedent"]');
    let btnSuiv = fragment.querySelector('[data-action="suivant"]');
    let index = 0;
    let miniatures = [];

    let zoneIndex = fragment.querySelector('[data-zone="index-image"]');
    let zoneTotal = fragment.querySelector('[data-zone="total-images"]');

    if (zoneTotal) {
      zoneTotal.textContent = String(images.length || 1);
    }

    if (images.length <= 1) {
      if (btnPrec) btnPrec.hidden = true;
      if (btnSuiv) btnSuiv.hidden = true;
    }

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

    if (btnPrec) btnPrec.addEventListener("click", () => afficher(index - 1));
    if (btnSuiv) btnSuiv.addEventListener("click", () => afficher(index + 1));

    if (images.length > 0) afficher(0);
    return fragment;
  },
};

export { GalerieImagesView };