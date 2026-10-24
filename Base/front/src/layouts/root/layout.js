import { htmlToFragment } from "../../lib/utils.js";
import { estAdminConnecte } from "../../lib/admin-session.js";
import { nombreArticles } from "../../lib/panier.js";
import { HeaderClientView } from "../../ui/header/Client/index.js";
import { HeaderAdminView } from "../../ui/header/Admin/index.js";
import template from "./template.html?raw";

/**
 * Layout principal : l'en-tête, puis la page affichée.
 *
 * Le slot nommé « header » est remplacé ici. Le slot sans nom est laissé au
 * routeur, qui y place la page.
 *
 * L'en-tête dépend de la route : l'en-tête admin sur /admin*, l'en-tête
 * client ailleurs.
 *
 * @param {string} path Chemin de la route courante (ex: "/", "/admin")
 * @returns {DocumentFragment}
 */
export function RootLayout(path = "/") {
  let layout = htmlToFragment(template);

  const estAdmin = path === "/admin" || path.startsWith("/admin/");
  const HeaderView = estAdmin ? HeaderAdminView : HeaderClientView;
  const actions = estAdmin
    ? {
        adminConnecte: estAdminConnecte(),
        surDeconnexion: () => document.dispatchEvent(new Event("admin:deconnexion")),
      }
    : {
        surRecherche: (terme) => {
          document.dispatchEvent(new CustomEvent("catalogue:recherche", { detail: { terme } }));
        },
      };

  const data = estAdmin ? {} : { nbArticles: nombreArticles() };

  const header = estAdmin ? HeaderAdminView.dom(actions) : HeaderClientView.dom(data, actions);
  layout.querySelector('slot[name="header"]').replaceWith(header);
  return layout;
}
