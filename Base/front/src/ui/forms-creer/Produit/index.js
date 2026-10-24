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
    if (Array.isArray(v.images)) {
      for (const fichier of v.images) {
        if (!(fichier instanceof File) || fichier.size === 0) continue;
        if (!TYPES_IMAGE_AUTORISES.includes(fichier.type)) {
          return "Le format de l'image doit être AVIF, JPG/JPEG, PNG ou WebP.";
        }
        if (fichier.size > IMAGE_OCTETS_MAX) {
          return "L'image « " + fichier.name + " » est trop lourde : 5 Mo maximum.";
        }
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
    let fichiersSelectionnesZone = fragment.querySelector('[data-zone="fichiers-selectionnes"]');
    let valeurs = edition.valeurs ?? {};
    let fichiersSelectionnes = Array.isArray(valeurs.images) ? [...valeurs.images] : [];

    let tailleKo = function (fichier) {
      return Math.max(1, Math.ceil(fichier.size / 1024)) + " Ko";
    };

    let retirerFichier = function (index) {
      fichiersSelectionnes.splice(index, 1);
      afficherFichiers();
    };

    let afficherFichiers = function () {
      fichiersSelectionnesZone.innerHTML = "";

      if (fichiersSelectionnes.length === 0) {
        fichiersSelectionnesZone.classList.add("hidden");
        fichiersSelectionnesZone.classList.remove("flex");
        return;
      }

      fichiersSelectionnes.forEach((fichier, index) => {
        let erreur = ProduitFormView.valider({
          nom: "ok",
          categorieId: "ok",
          prix: "0",
          prixUnitaire: "",
          stock: "0",
          seuilAlerte: "0",
          images: [fichier],
        });

        let item = document.createElement("div");
        item.className = "flex items-center justify-between gap-3 rounded-md border p-2 " + (erreur ? "border-status-danger-indicator bg-status-danger-subtle" : "border-border-default bg-surface-default");

        let infos = document.createElement("div");
        infos.className = "flex min-w-0 flex-col";
        let nom = document.createElement("span");
        nom.className = "truncate text-14 font-medium text-text-primary";
        nom.textContent = fichier.name;
        let taille = document.createElement("span");
        taille.className = "text-12 text-text-secondary";
        taille.textContent = tailleKo(fichier);
        infos.append(nom, taille);

        if (erreur) {
          let messageErreur = document.createElement("span");
          messageErreur.className = "text-12 text-status-danger-text";
          messageErreur.textContent = erreur;
          item.append(infos, messageErreur);
        } else {
          let bouton = document.createElement("button");
          bouton.type = "button";
          bouton.textContent = "Retirer";
          bouton.className = "shrink-0 rounded-md px-3 py-2 text-14 text-text-secondary hover:bg-surface-subtle";
          bouton.addEventListener("click", () => retirerFichier(index));
          item.append(infos, bouton);
        }

        fichiersSelectionnesZone.appendChild(item);
      });

      fichiersSelectionnesZone.classList.remove("hidden");
      fichiersSelectionnesZone.classList.add("flex");
    };

    inputImage.addEventListener("change", () => {
      for (const fichier of inputImage.files) {
        fichiersSelectionnes.push(fichier);
      }
      inputImage.value = "";
      afficherFichiers();
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
      for (const fichier of ev.dataTransfer.files) {
        fichiersSelectionnes.push(fichier);
      }
      afficherFichiers();
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
        options.surSupprimerImage?.(image.id, ProduitFormView.lireSaisie(formulaire, fichiersSelectionnes));
      });

      item.append(img, bouton);
      liste.appendChild(item);
    });

    // -----------------------------------------------------------------------
    // Options : types et valeurs du catalogue commun, cochés pour ce produit
    // -----------------------------------------------------------------------
    let caseActiver = fragment.querySelector('[data-zone="options-activer"]');
    let contenuOptions = fragment.querySelector('[data-zone="options-contenu"]');
    let listeTypes = fragment.querySelector('[data-zone="types-liste"]');
    let catalogue = options.catalogue ?? [];
    let typesActifs = new Set((edition.typesActifs ?? []).map(Number));
    let valeursChoisies = new Set((edition.valeursChoisies ?? []).map(Number));

    caseActiver.checked = edition.optionsActives !== false;
    contenuOptions.hidden = !caseActiver.checked;
    caseActiver.addEventListener("change", () => {
      contenuOptions.hidden = !caseActiver.checked;
      options.surBasculerOptions?.(caseActiver.checked);
    });

    const CLASSE_CHAMP = "h-9 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary";
    const CLASSE_LIEN = "h-9 rounded-md text-12 text-text-secondary underline hover:text-text-primary";

    let bouton = function (texte, classe, action) {
      let b = document.createElement("button");
      b.type = "button";
      b.textContent = texte;
      b.className = classe;
      b.addEventListener("click", action);
      return b;
    };

    let construireType = function (type) {
      let bloc = document.createElement("div");
      bloc.className = "flex flex-col gap-2 rounded-md border p-3 border-border-default";

      let libelle = document.createElement("label");
      libelle.className = "flex items-center gap-2 text-14 font-medium text-text-primary";
      let caseType = document.createElement("input");
      caseType.type = "checkbox";
      caseType.className = "size-4";
      caseType.checked = typesActifs.has(type.id);
      let nomType = document.createElement("span");
      nomType.textContent = type.nom;
      libelle.append(caseType, nomType);

      let contenu = document.createElement("div");
      contenu.className = "ml-6 flex flex-col gap-2";
      contenu.hidden = !caseType.checked;
      caseType.addEventListener("change", () => {
        contenu.hidden = !caseType.checked;
        options.surBasculerType?.(type.id, caseType.checked);
      });

      (type.valeurs ?? []).forEach((valeur) => {
        let ligne = document.createElement("div");
        ligne.className = "flex flex-wrap items-center gap-3";

        let caseValeur = document.createElement("input");
        caseValeur.type = "checkbox";
        caseValeur.className = "size-4";
        caseValeur.checked = valeursChoisies.has(valeur.id);
        caseValeur.addEventListener("change", () => options.surBasculerValeur?.(valeur.id, caseValeur.checked));

        let texte = document.createElement("span");
        texte.className = "text-14 text-text-primary";
        texte.textContent = valeur.valeur;

        ligne.append(caseValeur, texte, bouton("Supprimer du catalogue", "text-12 text-red-700 underline hover:text-red-900 dark:text-red-400", () => options.surSupprimerValeurCatalogue?.(valeur.id)));
        contenu.appendChild(ligne);
      });

      let ajout = document.createElement("div");
      ajout.className = "mt-1 flex flex-wrap items-end gap-2";
      let champ = document.createElement("input");
      champ.type = "text";
      champ.maxLength = 80;
      champ.placeholder = "Nouvelle valeur (ex. Vert)";
      champ.className = CLASSE_CHAMP;
      ajout.append(champ, bouton("Ajouter la valeur", CLASSE_LIEN, () => options.surAjouterValeurCatalogue?.(type.id, champ.value)));
      contenu.appendChild(ajout);

      bloc.append(libelle, contenu);
      return bloc;
    };

    catalogue.forEach((type) => listeTypes.appendChild(construireType(type)));

    let champNouveauType = fragment.querySelector('[name="nouveauType"]');
    fragment.querySelector('[data-action="creer-type"]').addEventListener("click", () => {
      options.surCreerType?.(champNouveauType.value);
    });

    // Chaque frappe est remontée à la page (enregistrement automatique).
    formulaire.addEventListener("input", () => {
      options.surModification?.(ProduitFormView.lireSaisie(formulaire, fichiersSelectionnes));
    });

    formulaire.addEventListener("submit", (ev) => {
      ev.preventDefault();
      let v = ProduitFormView.lireSaisie(formulaire, fichiersSelectionnes);
      let erreur = ProduitFormView.valider(v);
      message.textContent = erreur || "";
      message.classList.toggle("hidden", !erreur);
      if (!erreur && options.surEnregistrer) options.surEnregistrer(v);
    });

    fragment.querySelector('[data-action="annuler"]').addEventListener("click", () => options.surAnnuler?.());
    return fragment;
  },

  /** Lit la saisie sous forme d'objet. Les fichiers image y figurent s'ils sont choisis. */
  lireSaisie: function (formulaire, images = []) {
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
      images: images,
    };
  },
};

export { ProduitFormView };