import { AuthData } from "../../data/auth.js";
import { CategorieData } from "../../data/categorie.js";
import { ProduitData } from "../../data/produit.js";
import { ErreurApi } from "../../lib/api-request.js";
import { htmlToFragment } from "../../lib/utils.js";
import { definirAdminConnecte } from "../../lib/admin-session.js";
import { BarreOutilsView } from "../../ui/barre-outils/index.js";
import { ProduitFormView } from "../../ui/forms-creer/Produit/index.js";
import { MessageView } from "../../ui/message/index.js";
import { ConfirmationSuppressionProduitView } from "../../ui/modales/Admin/suppressionProduit/index.js";
import { PaginationView } from "../../ui/pagination/index.js";
import { TableauProduitsView } from "../../ui/tableaux-recapitulatifs/Admin/produits/index.js";
import template from "./template.html?raw";

/**
 * Page « Gestion des produits » (GOF-a), réservée à l'administrateur.
 *
 * Comme la page des catégories, la page ne protège rien elle-même : l'API répond
 * 401 ou 403, et la page affiche ce qu'elle reçoit.
 */

const IMAGE_OCTETS_MAX = 5 * 1024 * 1024;

let M = {
  acces: null, // null (inconnu), "ok", "non-connecte" ou "refuse"
  produits: [], // produits affichés dans le tableau
  tri: "nom",
  parPage: 12,
  page: 1,
  pagesTotal: 1,
  total: 0,
  categories: [], // pour la liste déroulante du formulaire
  message: null, // { type, texte }, ou null
  edition: null, // formulaire ouvert : { id, valeurs, images } ; id à null = création
  suppression: null, // produit en cours de suppression, ou null
};

let C = {};

/** Charge produits et catégories. Le serveur décide de l'accès. */
C.chargerDonnees = async function () {
  try {
    let [liste, categories] = await Promise.all([
      ProduitData.fetchAdminListe(1),
      CategorieData.fetchAdminListe(),
    ]);
    C.appliquerListe(liste);
    M.categories = categories;
    M.acces = "ok";
    definirAdminConnecte(true);
  } catch (erreur) {
    M.produits = [];
    M.categories = [];
    if (erreur instanceof ErreurApi && erreur.statut === 401) {
      M.acces = "non-connecte";
      definirAdminConnecte(false);
    } else if (erreur instanceof ErreurApi && erreur.statut === 403) {
      M.acces = "refuse";
      definirAdminConnecte(false);
    } else {
      M.message = { type: "erreur", texte: erreur.message };
    }
  }
};

C.appliquerListe = function (liste) {
  M.produits = liste.produits;
  M.tri = liste.tri;
  M.parPage = liste.parPage;
  M.page = liste.page;
  M.pagesTotal = liste.pagesTotal;
  M.total = liste.total;
};

C.chargerProduits = async function (page = M.page, reglages = { tri: M.tri, parPage: M.parPage }) {
  C.appliquerListe(await ProduitData.fetchAdminListe(page, reglages));
};

C.changerListe = async function (page, reglages) {
  try {
    await C.chargerProduits(page, reglages);
    M.message = null;
  } catch (erreur) {
    M.message = { type: "erreur", texte: erreur.message };
  }

  V.rafraichir();
};

C.handler_changerTri = function (tri) {
  return C.changerListe(1, { tri, parPage: M.parPage });
};

C.handler_changerParPage = function (parPage) {
  return C.changerListe(1, { tri: M.tri, parPage });
};

C.handler_changerPage = function (page) {
  return C.changerListe(page, { tri: M.tri, parPage: M.parPage }).then(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

C.trouverProduit = function (id) {
  return M.produits.find((p) => String(p.id) === String(id)) ?? null;
};

/** Valeurs du formulaire pour un produit neuf. */
C.valeursVides = function () {
  return {
    nom: "", reference: "", categorieId: "", marque: "", format: "", badge: "",
    description: "", prix: "", prixUnitaire: "", unitePrix: "", stock: 0, seuilAlerte: 5,
    images: [],
  };
};

/** Valeurs du formulaire à partir d'un produit existant. */
C.valeursDepuis = function (produit) {
  return {
    nom: produit.nom,
    reference: produit.reference,
    categorieId: String(produit.categorieId),
    marque: produit.marque,
    format: produit.format,
    badge: produit.badge,
    description: produit.description,
    prix: String(produit.prix),
    prixUnitaire: produit.prixUnitaire === "" ? "" : String(produit.prixUnitaire),
    unitePrix: produit.unitePrix,
    stock: produit.stock,
    seuilAlerte: produit.seuilAlerte,
  };
};

/** Forme attendue par l'API (snake_case). */
C.versApi = function (v) {
  return {
    nom: v.nom.trim(),
    reference: v.reference.trim(),
    categorie_id: Number(v.categorieId),
    marque: v.marque.trim(),
    format: v.format.trim(),
    description: v.description.trim(),
    prix: v.prix,
    prix_unitaire: v.prixUnitaire,
    unite_prix: v.unitePrix.trim(),
    badge: v.badge.trim(),
    stock: Number(v.stock),
    seuil_alerte: Number(v.seuilAlerte),
  };
};

/** Lit un fichier image en data URL, pour l'envoyer en JSON. */
C.lireDataUrl = function (fichier) {
  return new Promise((resolve, reject) => {
    const lecteur = new FileReader();
    lecteur.onload = () => resolve(lecteur.result);
    lecteur.onerror = () => reject(new Error("Lecture de l'image impossible."));
    lecteur.readAsDataURL(fichier);
  });
};

C.handler_ouvrirCreation = function () {
  M.edition = { id: null, valeurs: C.valeursVides(), images: [] };
  M.suppression = null;
  M.message = null;
  V.rafraichir();
};

C.handler_ouvrirModification = function (id) {
  const produit = C.trouverProduit(id);
  if (!produit) return;
  M.edition = { id: produit.id, valeurs: C.valeursDepuis(produit), images: produit.images };
  M.suppression = null;
  M.message = null;
  V.rafraichir();
};

C.handler_annulerFormulaire = function () {
  M.edition = null;
  V.rafraichir();
};

/**
 * Enregistre le produit, puis ajoute l'image choisie. Si l'image échoue, le
 * produit est déjà enregistré : le formulaire reste ouvert en modification.
 */
C.handler_enregistrer = async function (valeurs) {
  M.edition = { ...M.edition, valeurs };

  const erreurSaisie = ProduitFormView.valider(valeurs);
  if (erreurSaisie) {
    M.message = { type: "erreur", texte: erreurSaisie };
    V.rafraichir();
    return;
  }

  try {
    const donnees = C.versApi(valeurs);
    const produit =
      M.edition.id === null
        ? await ProduitData.creer(donnees)
        : await ProduitData.modifier(M.edition.id, donnees);

    // Le produit existe désormais : une nouvelle soumission le modifiera.
    M.edition = { ...M.edition, id: produit.id };

    if (Array.isArray(valeurs.images)) {
      for (const fichier of valeurs.images) {
        if (!(fichier instanceof File) || fichier.size === 0) continue;
        const image = await C.lireDataUrl(fichier);
        await ProduitData.ajouterImage(produit.id, [{
          image,
          texte_alternatif: produit.nom,
          nomFichier: fichier.name,
        }]);
      }
    }

    M.message = { type: "succes", texte: `Produit « ${produit.nom} » enregistré.` };
    M.edition = null;
    await C.chargerProduits();
  } catch (erreur) {
    M.message = { type: "erreur", texte: erreur.message };
    if (M.edition?.id) {
      // Le produit est enregistré : on recharge ses images pour rester exact.
      await C.chargerProduits().catch(() => {});
      const produit = C.trouverProduit(M.edition.id);
      if (produit) M.edition = { ...M.edition, images: produit.images };
    }
  }

  V.rafraichir();
};

/** Supprime une image. Le formulaire reste ouvert avec la saisie en cours. */
C.handler_supprimerImage = async function (imageId, valeursCourantes) {
  if (!M.edition?.id) return;

  try {
    await ProduitData.supprimerImage(M.edition.id, imageId);
    await C.chargerProduits();
    const produit = C.trouverProduit(M.edition.id);
    M.edition = { ...M.edition, valeurs: valeursCourantes, images: produit ? produit.images : [] };
    M.message = { type: "succes", texte: "Image supprimée." };
  } catch (erreur) {
    M.message = { type: "erreur", texte: erreur.message };
  }

  V.rafraichir();
};

C.handler_demanderSuppression = function (id) {
  const produit = C.trouverProduit(id);
  if (!produit) return;
  M.suppression = produit;
  M.edition = null;
  M.message = null;
  V.rafraichir();
};

C.handler_annulerSuppression = function () {
  M.suppression = null;
  V.rafraichir();
};

C.handler_confirmerSuppression = async function (id) {
  const nom = C.trouverProduit(id)?.nom ?? "";

  try {
    await ProduitData.supprimer(id);
    M.suppression = null;
    M.message = { type: "succes", texte: `Produit « ${nom} » supprimé.` };
    await C.chargerProduits();
  } catch (erreur) {
    // La confirmation reste ouverte : le message dit pourquoi la suppression est refusée.
    M.message = { type: "erreur", texte: erreur.message };
  }

  V.rafraichir();
};

/** L'en-tête admin émet « admin:deconnexion » sur toutes les pages /admin. */
C.handler_deconnexion = async function () {
  if (!V.racine?.isConnected) return;

  try {
    await AuthData.logout();
    M.message = { type: "info", texte: "Vous êtes déconnecté." };
  } catch (erreur) {
    M.message = { type: "erreur", texte: erreur.message };
  }

  M.acces = "non-connecte";
  definirAdminConnecte(false);
  M.produits = [];
  M.categories = [];
  M.edition = null;
  M.suppression = null;
  V.rafraichir();
  document.dispatchEvent(new Event("admin:deconnexion-terminee"));
};

document.addEventListener("admin:deconnexion", C.handler_deconnexion);

C.init = async function () {
  M.message = null;
  M.edition = null;
  M.suppression = null;
  await C.chargerDonnees();
  return V.init();
};

let V = {};

V.racine = null;

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
  let editionEnCours = M.edition !== null;

  let boutonCreer = pageFragment.querySelector('[data-action="creer"]');
  boutonCreer.hidden = !accesOk || editionEnCours;
  boutonCreer.addEventListener("click", C.handler_ouvrirCreation);
  pageFragment.querySelector('[data-zone="entete"]').hidden = editionEnCours;

  pageFragment.querySelector('[data-zone="acces"]').hidden = accesOk;

  pageFragment.querySelector('slot[name="message"]').replaceWith(MessageView.dom(M.message));

  pageFragment.querySelector('slot[name="formulaire"]').replaceWith(
    M.edition
      ? ProduitFormView.dom(M.edition, {
          categories: M.categories,
          surEnregistrer: C.handler_enregistrer,
          surAnnuler: C.handler_annulerFormulaire,
          surSupprimerImage: C.handler_supprimerImage,
        })
      : ""
  );

  pageFragment.querySelector('slot[name="suppression"]').replaceWith(
    M.suppression
      ? ConfirmationSuppressionProduitView.dom(
          { id: M.suppression.id, nom: M.suppression.nom },
          {
            surConfirmer: C.handler_confirmerSuppression,
            surFermer: C.handler_annulerSuppression,
          }
        )
      : ""
  );

  pageFragment.querySelector('slot[name="barre-outils"]').replaceWith(
    accesOk && !editionEnCours
      ? BarreOutilsView.dom({
          ...M,
          optionsTri: [
            { valeur: "nom", libelle: "Nom (A → Z)" },
            { valeur: "prix", libelle: "Prix (croissant)" },
            { valeur: "categorie", libelle: "Catégorie (A → Z)" },
            { valeur: "stock", libelle: "Stock (croissant)" },
            { valeur: "etat", libelle: "État (épuisé en premier)" },
          ],
        }, {
          surTri: C.handler_changerTri,
          surParPage: C.handler_changerParPage,
        })
      : ""
  );

  pageFragment.querySelector('slot[name="tableau"]').replaceWith(
    accesOk && !editionEnCours
      ? TableauProduitsView.dom(M.produits, {
          surModifier: C.handler_ouvrirModification,
          surSupprimer: C.handler_demanderSuppression,
        })
      : ""
  );

  pageFragment.querySelector('slot[name="pagination"]').replaceWith(
    accesOk && !editionEnCours ? PaginationView.dom(M, { surPage: C.handler_changerPage }) : ""
  );

  return pageFragment;
};

export function AdminProduitsPage() {
  return C.init();
}