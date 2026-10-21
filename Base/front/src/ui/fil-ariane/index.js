import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

/**
 * Fil d'Ariane : indique où se trouve le visiteur.
 * items : [{ libelle, lien? }] ; le dernier élément est la page courante.
 */
let FilArianeView = {
  html: function () {
    return template;
  },

  /** @param {Array<{libelle: string, lien?: string}>} items @returns {DocumentFragment} */
  dom: function (items = []) {
    let fragment = htmlToFragment(template);
    let liste = fragment.querySelector('[data-zone="items"]');

    items.forEach((item, i) => {
      let dernier = i === items.length - 1;
      let li = document.createElement("li");
      li.className = "flex items-center gap-2";

      if (dernier || !item.lien) {
        let span = document.createElement("span");
        span.textContent = item.libelle;
        span.className = "font-medium text-zinc-900 dark:text-zinc-100";
        if (dernier) span.setAttribute("aria-current", "page");
        li.appendChild(span);
      } else {
        let a = document.createElement("a");
        a.href = item.lien;
        a.dataset.link = "";
        a.textContent = item.libelle;
        a.className = "text-zinc-500 underline hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200";
        li.appendChild(a);
      }

      if (!dernier) {
        let sep = document.createElement("span");
        sep.textContent = "/";
        sep.setAttribute("aria-hidden", "true");
        sep.className = "text-zinc-400";
        li.appendChild(sep);
      }
      liste.appendChild(li);
    });

    return fragment;
  },
};

export { FilArianeView };