import { AuthData } from "../../data/auth.js";
import { CategorieData } from "../../data/categorie.js";
import { ErreurApi } from "../../lib/api-request.js";
import { htmlToFragment } from "../../lib/utils.js";
import { BarreOutilsView } from "../../ui/barre-outils/index.js";
import { FormulaireCategorieView } from "../../ui/forms-creer/Categorie/index.js";
import { ConfirmationSuppressionCategorieView } from "../../ui/modales/Admin/suppressionCategorie/index.js";
import { MessageView } from "../../ui/message/index.js";
import { PaginationView } from "../../ui/pagination/index.js";
import { TableauCategoriesView } from "../../ui/tableaux-recapitulatifs/Admin/categories/index.js";
import template from "./template.html?raw";

/**
 * Page « Gestion des catégories » (GOF-c), réservée à l'administrateur.
 *
 * Comme la page Administration, la page ne protège rien elle-même : c'est
 * l'API qui répond 401 ou 403, et la page affiche ce qu'elle reçoit.
 * Les règles de saisie sont vérifiées ici pour répondre vite, puis à nouveau
 * par l'API, qui reste la référence.
 */

const LIBELLE_MAX = 100;
const DESCRIPTION_MAX = 500;

let M = {
  acces: null, // null (inconnu), "ok", "non-connecte" ou "refuse"
  categories: [], // catégories affichées dans le tableau
  tri: "nom",
  parPage: 12,
  page: 1,
  pagesTotal: 1,
  total: 0,
  toutesCategories: [], // liste complète disponible pour la réaffectation à la suppression
  message: null, // { type, texte }, ou null
  edition: null, // formulaire ouvert : { id, nom, description } ; id à null = création
  suppression: null, // catégorie en cours de suppression, ou null
};

let C = {};

/**
 * Charge la liste. Le serveur décide de l'accès : 401, 403 ou la liste.
 */
C.chargerCategories = async function (page = M.page, tri = M.tri, parPage = M.parPage) {
  try {
    let liste = await CategorieData.fetchAdminPage(page, tri, parPage);
    M.categories = liste.categories;
    M.tri = liste.tri;
    M.parPage = liste.parPage;
    M.page = liste.page;
    M.pagesTotal = liste.pagesTotal;
    M.total = liste.total;
    M.acces = "ok";
  } catch (erreur) {
    M.categories = [];
    if (erreur instanceof ErreurApi && erreur.statut === 401) {
      M.acces = "non-connecte";
    } else if (erreur instanceof ErreurApi && erreur.statut === 403) {
      M.acces = "refuse";
    } else {
      M.message = { type: "erreur", texte: erreur.message };
    }
  }
};

C.handler_changerTri = async function (tri) {
  await C.chargerCategories(1, tri, M.parPage);
  V.rafraichir();
};

C.handler_changerParPage = async function (parPage) {
  await C.chargerCategories(1, M.tri, parPage);
  V.rafraichir();
};

C.handler_changerPage = async function (page) {
  await C.chargerCategories(page, M.tri, M.parPage);
  V.rafraichir();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

C.trouverCategorie = function (id) {
  return M.categories.find((c) => String(c.id) === String(id)) ?? null;
};

/**
 * Contrôle de saisie côté page. Renvoie un message d'erreur, ou null si la saisie est correcte.
 */
C.validerFormulaire = function ({ libelle, description }) {
  if (libelle.trim() === "") return "Le nom de la catégorie est obligatoire.";
  if (libelle.trim().length > LIBELLE_MAX) return `Le nom ne doit pas dépasser ${LIBELLE_MAX} caractères.`;
  if (description.trim().length > DESCRIPTION_MAX) return `La description ne doit pas dépasser ${DESCRIPTION_MAX} caractères.`;
  return null;
};

C.handler_ouvrirCreation = function () {
  M.edition = { id: null, nom: "", description: "" };
  M.suppression = null;
  M.message = null;
  V.rafraichir();
};

C.handler_ouvrirModification = function (id) {
  const categorie = C.trouverCategorie(id);
  if (!categorie) return;
  M.edition = { id: categorie.id, nom: categorie.nom, description: categorie.description };
  M.suppression = null;
  M.message = null;
  V.rafraichir();
};

C.handler_annulerFormulaire = function () {
  M.edition = null;
  V.rafraichir();
};

C.handler_enregistrer = async function (valeurs) {
  // La saisie est gardée : en cas d'erreur, le formulaire reste rempli.
  M.edition = { ...M.edition, nom: valeurs.libelle, description: valeurs.description };

  const erreurSaisie = C.validerFormulaire(valeurs);
  if (erreurSaisie) {
    M.message = { type: "erreur", texte: erreurSaisie };
    V.rafraichir();
    return;
  }

  const donnees = { libelle: valeurs.libelle.trim(), description: valeurs.description.trim() };

  try {
    if (M.edition.id === null) {
      await CategorieData.creer(donnees);
      M.message = { type: "succes", texte: `Catégorie « ${donnees.libelle} » créée.` };
    } else {
      await CategorieData.modifier(M.edition.id, donnees);
      M.message = { type: "succes", texte: `Catégorie « ${donnees.libelle} » modifiée.` };
    }
    M.edition = null;
    await C.chargerCategories();
  } catch (erreur) {
    M.message = { type: "erreur", texte: erreur.message };
  }

  V.rafraichir();
};

C.handler_demanderSuppression = async function (id) {
  const categorie = C.trouverCategorie(id);
  if (!categorie) return;
  try {
    M.toutesCategories = await CategorieData.fetchAdminListe(M.tri);
  } catch (erreur) {
    M.message = { type: "erreur", texte: erreur.message };
    V.rafraichir();
    return;
  }
  M.suppression = categorie;
  M.edition = null;
  M.message = null;
  V.rafraichir();
};

C.handler_annulerSuppression = function () {
  M.suppression = null;
  V.rafraichir();
};

C.handler_confirmerSuppression = async function (id, cibleId) {
  const nom = C.trouverCategorie(id)?.nom ?? "";

  try {
    await CategorieData.supprimer(id, cibleId);
    M.suppression = null;
    M.message = { type: "succes", texte: `Catégorie « ${nom} » supprimée.` };
    await C.chargerCategories();
  } catch (erreur) {
    // La confirmation reste ouverte : le message dit pourquoi la suppression est refusée.
    M.message = { type: "erreur", texte: erreur.message };
  }

  V.rafraichir();
};

/**
 * L'en-tête admin émet « admin:deconnexion » sur toutes les pages /admin.
 * Cette page ne réagit que si elle est affichée.
 */
C.handler_deconnexion = async function () {
  if (!V.racine?.isConnected) return;

  try {
    await AuthData.logout();
    M.message = { type: "info", texte: "Vous êtes déconnecté." };
  } catch (erreur) {
    M.message = { type: "erreur", texte: erreur.message };
  }

  M.acces = "non-connecte";
  M.categories = [];
  M.edition = null;
  M.suppression = null;
  V.rafraichir();
};

document.addEventListener("admin:deconnexion", C.handler_deconnexion);

C.init = async function () {
  M.message = null;
  M.edition = null;
  M.suppression = null;
  await C.chargerCategories();
  return V.init();
};

let V = {};

V.racine = null; // élément racine de la page affichée

V.init = function () {
  let fragment = V.createPageFragment();
  V.racine = fragment.firstElementChild;
  return fragment;
};

// Même principe que les autres pages : toute la page se reconstruit à partir de M.
V.rafraichir = function () {
  let fragment = V.createPageFragment();
  let nouvelleRacine = fragment.firstElementChild;
  V.racine.replaceWith(fragment);
  V.racine = nouvelleRacine;
};

V.createPageFragment = function () {
  let pageFragment = htmlToFragment(template);
  let accesOk = M.acces === "ok";

  pageFragment.querySelector('[data-action="creer"]').hidden = !accesOk;
  pageFragment.querySelector('[data-action="creer"]').addEventListener("click", C.handler_ouvrirCreation);
  pageFragment.querySelector('[data-zone="acces"]').hidden = accesOk;

  pageFragment.querySelector('slot[name="message"]').replaceWith(MessageView.dom(M.message));

  pageFragment.querySelector('slot[name="formulaire"]').replaceWith(
    M.edition
      ? FormulaireCategorieView.dom(M.edition, {
          surEnregistrer: C.handler_enregistrer,
          surAnnuler: C.handler_annulerFormulaire,
        })
      : ""
  );

  pageFragment.querySelector('slot[name="suppression"]').replaceWith(
    M.suppression
      ? ConfirmationSuppressionCategorieView.dom(
          {
            id: M.suppression.id,
            nom: M.suppression.nom,
            nbProduits: M.suppression.nbProduits,
            categories: M.toutesCategories
              .filter((c) => c.id !== M.suppression.id)
              .map((c) => ({ id: c.id, nom: c.nom })),
          },
          {
            surConfirmer: C.handler_confirmerSuppression,
            surFermer: C.handler_annulerSuppression,
          }
        )
      : ""
  );

  pageFragment.querySelector('slot[name="barre-outils"]').replaceWith(
    accesOk
      ? BarreOutilsView.dom({
          tri: M.tri,
          parPage: M.parPage,
          total: M.total,
          libelleTotal: "catégories",
          libelleParPage: "Catégories par page",
          libelleUnite: "catégories",
          optionsTri: [
            { valeur: "nom", libelle: "Nom (A → Z)" },
            { valeur: "produits_asc", libelle: "Nombre de produits (croissant)" },
            { valeur: "produits_desc", libelle: "Nombre de produits (décroissant)" },
          ],
        }, {
          surTri: C.handler_changerTri,
          surParPage: C.handler_changerParPage,
        })
      : ""
  );

  pageFragment.querySelector('slot[name="tableau"]').replaceWith(
    accesOk
      ? TableauCategoriesView.dom(M.categories, {
          surModifier: C.handler_ouvrirModification,
          surSupprimer: C.handler_demanderSuppression,
        })
      : ""
  );

  pageFragment.querySelector('slot[name="pagination"]').replaceWith(
    accesOk ? PaginationView.dom(M, { surPage: C.handler_changerPage }) : ""
  );

  return pageFragment;
};

export function AdminCategoriesPage() {
  return C.init();
}
