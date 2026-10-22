import { genericRenderer, htmlToFragment } from "../../../lib/utils.js";
import template from "./template.html?raw";

const IMAGE_OCTETS_MAX = 5 * 1024 * 1024;
const TYPES_IMAGE_AUTORISES = ["image/avif", "image/jpeg", "image/png", "image/webp"];

/**
 * Formulaire de création ou de modification d'un produit (GOF-a).
 *
 * Le composant recueille la saisie, la contrôle pour répondre vite, et la remet
 * à la page, qui décide de l'enregistrement. L'API reste la référence.
 *
 * edition : { id, valeurs, images }. Sans id, le formulaire est en création.
 *   valeurs : champs du formulaire (nom, categorieId, prix, stock…).
 *   images  : [{ id, src, alt }] déjà présentes sur le produit.
 */
let ProduitFormView = {
  html: function (edition = {}) {
    return genericRenderer(template, {
      titre: edition.id ? "Modifier le produit" : "Nouveau produit",
    });
  },

  /** Message d'erreur en français, ou null si la saisie est correcte. */
  valider: function (v) {
    if (!v.nom.trim()) return "Le nom du produit est obligatoire.";
    if (v.nom.trim().length > 160) return "Le nom ne doit pas dépasser 160 caractères.";
    if (!v.categorieId) return "Choisissez une catégorie.";
    if (v.prix === "" || Number(v.prix) < 0 || Number(v.prix) > 9999.99) {
      return "Le prix doit être un nombre positif, par exemple 12,95.";
    }
    if (v.prixUnitaire !== "" && (Number(v.prixUnitaire) < 0 || Number(v.prixUnitaire) > 9999.99)) {
      return "Le prix unitaire doit être un nombre positif.";
    }
    if (!Number.isInteger(Number(v.stock)) || Number(v.stock) < 0) {
      return "Le stock doit être un nombre entier positif ou nul.";
    }
    if (!Number.isInteger(Number(v.seuilAlerte)) || Number(v.seuilAlerte) < 0) {
      return "Le seuil d'alerte doit être un nombre entier positif ou nul.";
    }
    if (v.image instanceof File && v.image.size > 0) {
      if (!TYPES_IMAGE_AUTORISES.includes(v.image.type)) {
        return "Le format de l'image doit être AVIF, JPG/JPEG, PNG ou WebP.";
      }
      if (v.image.size > IMAGE_OCTETS_MAX) {
        return "L'image est trop lourde : 5 Mo maximum.";
      }
    }
    return null;
  },

  /**
   * @param {object} edition  { id, valeurs, images }
   * @param {{categories?: Array<{id, nom}>, surEnregistrer?: (v) => void,
   *          surAnnuler?: () => void, surSupprimerImage?: (imageId, valeurs) => void}} options
   * @returns {DocumentFragment}
   */
  dom: function (edition = {}, options = {}) {
    let fragment = htmlToFragment(ProduitFormView.html(edition));
    let formulaire = fragment.querySelector("form");
    let message = fragment.querySelector('[data-zone="message"]');
    let select = fragment.querySelector('[data-zone="categories"]');
    let inputImage = fragment.querySelector('[data-zone="fichier-image"]');
    let zoneDepot = fragment.querySelector('[data-zone="depot-image"]');
    let fichierSelectionne = fragment.querySelector('[data-zone="fichier-selectionne"]');
    let nomFichier = fragment.querySelector('[data-zone="nom-fichier"]');
    let tailleFichier = fragment.querySelector('[data-zone="taille-fichier"]');
    let valeurs = edition.valeurs ?? {};

    let afficherFichier = function (fichier) {
      let erreur = ProduitFormView.valider({
        nom: "ok",
        categorieId: "ok",
        prix: "0",
        prixUnitaire: "",
        stock: "0",
        seuilAlerte: "0",
        image: fichier,
      });

      if (erreur) {
        inputImage.value = "";
        fichierSelectionne.classList.add("hidden");
        fichierSelectionne.classList.remove("flex");
        message.textContent = erreur;
        message.classList.remove("hidden");
        return;
      }

      message.textContent = "";
      message.classList.add("hidden");
      nomFichier.textContent = fichier.name;
      tailleFichier.textContent = `${Math.max(1, Math.ceil(fichier.size / 1024))} Ko`;
      fichierSelectionne.classList.remove("hidden");
      fichierSelectionne.classList.add("flex");
    };

    inputImage.addEventListener("change", () => {
      if (inputImage.files[0]) afficherFichier(inputImage.files[0]);
    });

    ["dragenter", "dragover"].forEach((type) => {
      zoneDepot.addEventListener(type, (ev) => {
        ev.preventDefault();
        zoneDepot.classList.add("border-border-strong", "bg-surface-info");
      });
    });

    ["dragleave", "drop"].forEach((type) => {
      zoneDepot.addEventListener(type, (ev) => {
        ev.preventDefault();
        zoneDepot.classList.remove("border-border-strong", "bg-surface-info");
      });
    });

    zoneDepot.addEventListener("drop", (ev) => {
      let fichier = ev.dataTransfer.files[0];
      if (!fichier) return;

      let transfert = new DataTransfer();
      transfert.items.add(fichier);
      inputImage.files = transfert.files;
      afficherFichier(fichier);
    });

    fragment.querySelector('[data-action="retirer-image"]').addEventListener("click", () => {
      inputImage.value = "";
      fichierSelectionne.classList.add("hidden");
      fichierSelectionne.classList.remove("flex");
    });

    // Valeurs posées par propriété, jamais par HTML : aucune saisie n'est interprétée.
    let champs = formulaire.elements;
    champs.nom.value = valeurs.nom ?? "";
    champs.reference.value = valeurs.reference ?? "";
    champs.marque.value = valeurs.marque ?? "";
    champs.format.value = valeurs.format ?? "";
    champs.badge.value = valeurs.badge ?? "";
    champs.description.value = valeurs.description ?? "";
    champs.prix.value = valeurs.prix ?? "";
    champs.prixUnitaire.value = valeurs.prixUnitaire ?? "";
    champs.unitePrix.value = valeurs.unitePrix ?? "";
    champs.stock.value = valeurs.stock ?? 0;
    champs.seuilAlerte.value = valeurs.seuilAlerte ?? 5;

    (options.categories || []).forEach((c) => {
      let opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.nom;
      opt.selected = String(c.id) === String(valeurs.categorieId ?? "");
      select.appendChild(opt);
    });

    // Images déjà présentes : chaque vignette a son bouton de suppression.
    let liste = fragment.querySelector('[data-zone="images"]');
    let aucuneImage = fragment.querySelector('[data-zone="images-vide"]');
    let images = edition.images ?? [];

    if (images.length > 0) {
      aucuneImage.remove();
    }

    images.forEach((image) => {
      let item = document.createElement("li");
      item.className = "flex flex-col items-start gap-2";

      let img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt;
      img.className = "h-24 w-24 rounded-md border object-cover border-border-default";

      let bouton = document.createElement("button");
      bouton.type = "button";
      bouton.textContent = "Supprimer l'image";
      bouton.className = "text-12 text-red-700 underline hover:text-red-900 dark:text-red-400";
      bouton.addEventListener("click", () => {
        options.surSupprimerImage?.(image.id, ProduitFormView.lireSaisie(formulaire));
      });

      item.append(img, bouton);
      liste.appendChild(item);
    });

    formulaire.addEventListener("submit", (ev) => {
      ev.preventDefault();
      let v = ProduitFormView.lireSaisie(formulaire);
      let erreur = ProduitFormView.valider(v);
      message.textContent = erreur || "";
      message.classList.toggle("hidden", !erreur);
      if (!erreur && options.surEnregistrer) options.surEnregistrer(v);
    });

    fragment.querySelector('[data-action="annuler"]').addEventListener("click", () => options.surAnnuler?.());
    return fragment;
  },

  /** Lit la saisie sous forme d'objet. Le fichier image y figure s'il est choisi. */
  lireSaisie: function (formulaire) {
    let v = Object.fromEntries(new FormData(formulaire));
    return {
      nom: String(v.nom ?? ""),
      reference: String(v.reference ?? ""),
      categorieId: String(v.categorieId ?? ""),
      marque: String(v.marque ?? ""),
      format: String(v.format ?? ""),
      badge: String(v.badge ?? ""),
      description: String(v.description ?? ""),
      prix: String(v.prix ?? ""),
      prixUnitaire: String(v.prixUnitaire ?? ""),
      unitePrix: String(v.unitePrix ?? ""),
      stock: String(v.stock ?? ""),
      seuilAlerte: String(v.seuilAlerte ?? ""),
      image: v.image,
    };
  },
};

export { ProduitFormView };