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
/** Délai avant l'enregistrement automatique, après la dernière frappe. */
const DELAI_AUTO_MS = 800;
let minuteurAuto = null;

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
    options: [],
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
  M.edition = { id: null, valeurs: C.valeursVides(), images: [], options: [] };
  M.suppression = null;
  M.message = null;
  V.rafraichir();
};

C.handler_ouvrirModification = async function (id) {
  const produit = C.trouverProduit(id);
  if (!produit) return;
  let options = [];
  try {
    options = await ProduitData.fetchAdminOptions(produit.id);
  } catch (erreur) {
    M.message = { type: "erreur", texte: `Impossible de charger les options : ${erreur.message}` };
  }
  M.edition = { id: produit.id, valeurs: C.valeursDepuis(produit), images: produit.images, options };
  M.suppression = null;
  M.message = null;
  V.rafraichir();
};

C.handler_annulerFormulaire = function () {
  clearTimeout(minuteurAuto);
  M.edition = null;
  V.rafraichir();
};

/**
 * Affiche un message sans reconstruire la page : le formulaire et tout ce qui
 * a été saisi restent en place.
 */
C.signaler = function (message) {
  M.message = message;
  const zone = V.racine?.querySelector('[data-zone="message-page"]');
  if (zone) zone.replaceChildren(MessageView.dom(message));
};

/**
 * À chaque modification de la saisie : on garde les valeurs dans M, puis on
 * programme un enregistrement automatique (en modification uniquement).
 */
C.handler_modifierSaisie = function (valeurs) {
  if (!M.edition) return;
  M.edition = { ...M.edition, valeurs };
  if (M.edition.id === null) return; // création : rien n'est envoyé avant « Enregistrer »
  clearTimeout(minuteurAuto);
  minuteurAuto = setTimeout(C.enregistrerAuto, DELAI_AUTO_MS);
};

/** Enregistre les champs du produit en arrière-plan. Une saisie incomplète attend. */
C.enregistrerAuto = async function () {
  const id = M.edition?.id;
  const valeurs = M.edition?.valeurs;
  if (!id || ProduitFormView.valider(valeurs)) return;

  try {
    await ProduitData.modifier(id, C.versApi(valeurs));
    C.signaler({ type: "info", texte: "Modifications enregistrées automatiquement." });
  } catch (erreur) {
    C.signaler({ type: "erreur", texte: erreur.message });
  }
};

/**
 * Enregistre le produit complet, puis ajoute les nouvelles images.
 * En cas d'erreur, seul le message change : la saisie reste à l'écran.
 */
C.handler_enregistrer = async function (valeurs) {
  clearTimeout(minuteurAuto);
  M.edition = { ...M.edition, valeurs };

  const erreurSaisie = ProduitFormView.valider(valeurs);
  if (erreurSaisie) return C.signaler({ type: "erreur", texte: erreurSaisie });

  let produitSauve = false;
  try {
    const donnees = C.versApi(valeurs);
    const produit =
      M.edition.id === null
        ? await ProduitData.creer(donnees)
        : await ProduitData.modifier(M.edition.id, donnees);

    M.edition = { ...M.edition, id: produit.id };
    produitSauve = true;

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

    M.edition = null;
    await C.chargerProduits();
    M.message = { type: "succes", texte: `Produit « ${produit.nom} » enregistré.` };
    V.rafraichir(); // ferme le formulaire
  } catch (erreur) {
    if (!produitSauve) return C.signaler({ type: "erreur", texte: erreur.message });

    // Le produit est enregistré mais une image a échoué : on recharge les images.
    await C.chargerProduits().catch(() => {});
    const produit = C.trouverProduit(M.edition.id);
    M.edition = { ...M.edition, images: produit ? produit.images : M.edition.images };
    M.message = { type: "erreur", texte: erreur.message };
    V.rafraichir();
  }
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

/** Affiche ou masque la zone des options, sans rien supprimer. */
C.handler_basculerOptions = function (actif) {
  if (!M.edition) return;
  M.edition = { ...M.edition, optionsActives: actif };
};

/**
 * Crée une option et ses valeurs (« S, M, L ») pour le produit en cours.
 * En cas d'erreur, seul le message change : les champs gardent leur saisie.
 */
C.handler_ajouterOption = async function (nomSaisi, valeursSaisies) {
  if (!M.edition?.id) return;

  const nom = nomSaisi.trim();
  const valeurs = valeursSaisies.split(",").map((v) => v.trim()).filter((v) => v !== "");
  if (nom === "") return C.signaler({ type: "erreur", texte: "Donnez un nom à l'option, par exemple Taille." });
  if (valeurs.length === 0) return C.signaler({ type: "erreur", texte: "Indiquez au moins une valeur, séparées par des virgules." });

  try {
    const idsAvant = new Set(M.edition.options.map((o) => o.id));
    let options = await ProduitData.creerOption(M.edition.id, { nom, ordre: M.edition.options.length + 1 });
    const nouvelle = options.find((o) => !idsAvant.has(o.id));

    for (const [index, valeur] of valeurs.entries()) {
      options = await ProduitData.ajouterValeur(nouvelle.id, { valeur, prix_supplement: 0, ordre: index + 1 });
    }

    M.edition = { ...M.edition, options };
  } catch (erreur) {
    return C.signaler({ type: "erreur", texte: erreur.message });
  }

  M.message = null;
  V.rafraichir(); // le formulaire repart vide, la nouvelle option apparaît dans la liste
};

/** Ajoute une valeur à une option du produit en cours d'édition. */
C.handler_ajouterValeur = async function (optionId, valeur, prixSupplement, ordre) {
  if (!M.edition?.id) return;
  try {
    M.edition.options = await ProduitData.ajouterValeur(optionId, {
      valeur,
      prix_supplement: prixSupplement,
      ordre,
    });
    M.message = null;
  } catch (erreur) {
    return C.signaler({ type: "erreur", texte: erreur.message });
  }
  V.rafraichir();
};

/** Modifie une option du produit en cours d'édition. */
C.handler_modifierOption = async function (id, nom, ordre) {
  if (!M.edition?.id) return;
  try {
    M.edition.options = await ProduitData.modifierOption(id, { nom, ordre });
    M.message = null;
  } catch (erreur) {
    return C.signaler({ type: "erreur", texte: erreur.message });
  }
  V.rafraichir();
};

/** Supprime une option (et ses valeurs) du produit en cours d'édition. */
C.handler_supprimerOption = async function (id) {
  if (!M.edition?.id) return;
  try {
    M.edition.options = await ProduitData.supprimerOption(id);
    M.message = null;
  } catch (erreur) {
    return C.signaler({ type: "erreur", texte: erreur.message });
  }
  V.rafraichir();
};

/** Modifie une valeur d'option du produit en cours d'édition. */
C.handler_modifierValeur = async function (id, valeur, prixSupplement, ordre) {
  if (!M.edition?.id) return;
  try {
    M.edition.options = await ProduitData.modifierValeur(id, {
      valeur,
      prix_supplement: prixSupplement,
      ordre,
    });
    M.message = null;
  } catch (erreur) {
    return C.signaler({ type: "erreur", texte: erreur.message });
  }
  V.rafraichir();
};

/** Supprime une valeur d'option du produit en cours d'édition. */
C.handler_supprimerValeur = async function (id) {
  if (!M.edition?.id) return;
  try {
    M.edition.options = await ProduitData.supprimerValeur(id);
    M.message = null;
  } catch (erreur) {
    return C.signaler({ type: "erreur", texte: erreur.message });
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
          surModification: C.handler_modifierSaisie,
          surAnnuler: C.handler_annulerFormulaire,
          surSupprimerImage: C.handler_supprimerImage,
          surAjouterOption: C.handler_ajouterOption,
          surBasculerOptions: C.handler_basculerOptions,
          surAjouterValeur: C.handler_ajouterValeur,
          surModifierOption: C.handler_modifierOption,
          surSupprimerOption: C.handler_supprimerOption,
          surModifierValeur: C.handler_modifierValeur,
          surSupprimerValeur: C.handler_supprimerValeur,
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