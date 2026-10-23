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
    // Options de personnalisation
    // -----------------------------------------------------------------------
    let zoneOptions = fragment.querySelector('[data-zone="options"]');
    let listeOptions = fragment.querySelector('[data-zone="options-liste"]');

    let lireChamp = (bloc, nom) => {
      const input = bloc.querySelector(`[name="${nom}"]`);
      return input ? input.value : "";
    };

    let construireBlocValeur = function (valeur) {
      let bloc = document.createElement("div");
      bloc.className = "flex flex-wrap gap-2 items-end";
      bloc.dataset.valeurId = valeur.id;

      let inputValeur = document.createElement("input");
      inputValeur.type = "text";
      inputValeur.name = "valeurValeur";
      inputValeur.value = valeur.valeur;
      inputValeur.placeholder = "Valeur (ex. Blanc)";
      inputValeur.className = "rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary";
      inputValeur.maxLength = 80;

      let inputPrix = document.createElement("input");
      inputPrix.type = "number";
      inputPrix.name = "valeurPrix";
      inputPrix.min = "0";
      inputPrix.max = "9999.99";
      inputPrix.step = "0.01";
      inputPrix.value = String(valeur.prixSupplement ?? 0);
      inputPrix.placeholder = "0,00";
      inputPrix.className = "h-9 w-24 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary";

      let inputOrdre = document.createElement("input");
      inputOrdre.type = "number";
      inputOrdre.name = "valeurOrdre";
      inputOrdre.min = "0";
      inputOrdre.max = "255";
      inputOrdre.value = String(valeur.ordre ?? 1);
      inputOrdre.className = "h-9 w-20 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary";

      let btnEnregistrer = document.createElement("button");
      btnEnregistrer.type = "button";
      btnEnregistrer.textContent = "Enregistrer";
      btnEnregistrer.className = "h-9 rounded-md text-12 text-text-secondary underline hover:text-text-primary";
      btnEnregistrer.addEventListener("click", () => {
        options.surModifierValeur?.(
          Number(bloc.dataset.valeurId),
          lireChamp(bloc, "valeurValeur"),
          lireChamp(bloc, "valeurPrix"),
          Number(lireChamp(bloc, "valeurOrdre") || 1)
        );
      });

      let btnSupprimer = document.createElement("button");
      btnSupprimer.type = "button";
      btnSupprimer.textContent = "Supprimer";
      btnSupprimer.className = "h-9 rounded-md text-12 text-red-700 underline hover:text-red-900 dark:text-red-400";
      btnSupprimer.addEventListener("click", () => {
        options.surSupprimerValeur?.(Number(bloc.dataset.valeurId));
      });

      let sauverValeur = () => options.surModifierValeur?.(
        Number(bloc.dataset.valeurId),
        lireChamp(bloc, "valeurValeur"),
        lireChamp(bloc, "valeurPrix"),
        Number(lireChamp(bloc, "valeurOrdre") || 1)
      );
      inputValeur.addEventListener("change", sauverValeur);
      inputPrix.addEventListener("change", sauverValeur);
      inputOrdre.addEventListener("change", sauverValeur);

      bloc.append(inputValeur, inputPrix, inputOrdre, btnEnregistrer, btnSupprimer);
      return bloc;
    };

    let construireBlocOption = function (option) {
      let bloc = document.createElement("div");
      bloc.className = "flex flex-col gap-3 rounded-md border p-3";
      bloc.dataset.optionId = option.id;

      let entete = document.createElement("div");
      entete.className = "flex flex-wrap gap-3 items-end";

      let inputNom = document.createElement("input");
      inputNom.type = "text";
      inputNom.name = "optionNom";
      inputNom.value = option.nom;
      inputNom.placeholder = "Nom de l'option";
      inputNom.className = "rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary";
      inputNom.maxLength = 80;

      let inputOrdre = document.createElement("input");
      inputOrdre.type = "number";
      inputOrdre.name = "optionOrdre";
      inputOrdre.min = "0";
      inputOrdre.max = "255";
      inputOrdre.value = String(option.ordre ?? 1);
      inputOrdre.className = "h-9 w-20 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary";

      let btnEnregistrerOption = document.createElement("button");
      btnEnregistrerOption.type = "button";
      btnEnregistrerOption.textContent = "Enregistrer";
      btnEnregistrerOption.className = "h-9 rounded-md text-12 text-text-secondary underline hover:text-text-primary";
      btnEnregistrerOption.addEventListener("click", () => {
        options.surModifierOption?.(
          Number(bloc.dataset.optionId),
          lireChamp(bloc, "optionNom"),
          Number(lireChamp(bloc, "optionOrdre") || 1)
        );
      });

      let btnSupprimerOption = document.createElement("button");
      btnSupprimerOption.type = "button";
      btnSupprimerOption.textContent = "Supprimer l'option";
      btnSupprimerOption.className = "h-9 rounded-md text-12 text-red-700 underline hover:text-red-900 dark:text-red-400";
      btnSupprimerOption.addEventListener("click", () => {
        options.surSupprimerOption?.(Number(bloc.dataset.optionId));
      });

      let sauverOption = () => options.surModifierOption?.(
        Number(bloc.dataset.optionId),
        lireChamp(bloc, "optionNom"),
        Number(lireChamp(bloc, "optionOrdre") || 1)
      );
      inputNom.addEventListener("change", sauverOption);
      inputOrdre.addEventListener("change", sauverOption);

      entete.append(inputNom, inputOrdre, btnEnregistrerOption, btnSupprimerOption);

      let listeValeurs = document.createElement("div");
      listeValeurs.className = "ml-4 flex flex-col gap-2";
      (option.valeurs || []).forEach((valeur) => {
        listeValeurs.appendChild(construireBlocValeur(valeur));
      });

      let ajoutValeur = document.createElement("div");
      ajoutValeur.className = "flex flex-wrap gap-2 items-end mt-2";
      let inputNouvelleValeur = document.createElement("input");
      inputNouvelleValeur.type = "text";
      inputNouvelleValeur.name = "nouvelleValeurValeur";
      inputNouvelleValeur.placeholder = "Nouvelle valeur";
      inputNouvelleValeur.className = "rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary";
      inputNouvelleValeur.maxLength = 80;

      let inputNouveauPrix = document.createElement("input");
      inputNouveauPrix.type = "number";
      inputNouveauPrix.name = "nouvelleValeurPrix";
      inputNouveauPrix.min = "0";
      inputNouveauPrix.max = "9999.99";
      inputNouveauPrix.step = "0.01";
      inputNouveauPrix.placeholder = "Supplément €";
      inputNouveauPrix.className = "h-9 w-28 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary";

      let inputNouvelOrdre = document.createElement("input");
      inputNouvelOrdre.type = "number";
      inputNouvelOrdre.name = "nouvelleValeurOrdre";
      inputNouvelOrdre.min = "0";
      inputNouvelOrdre.max = "255";
      inputNouvelOrdre.value = "1";
      inputNouvelOrdre.className = "h-9 w-20 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary";

      let btnAjouterValeur = document.createElement("button");
      btnAjouterValeur.type = "button";
      btnAjouterValeur.textContent = "Ajouter la valeur";
      btnAjouterValeur.className = "h-9 rounded-md text-12 text-text-secondary underline hover:text-text-primary";
      btnAjouterValeur.addEventListener("click", () => {
        options.surAjouterValeur?.(
          Number(bloc.dataset.optionId),
          inputNouvelleValeur.value,
          inputNouveauPrix.value,
          Number(inputNouvelOrdre.value || 1)
        );
      });

      ajoutValeur.append(inputNouvelleValeur, inputNouveauPrix, inputNouvelOrdre, btnAjouterValeur);

      bloc.append(entete, listeValeurs, ajoutValeur);
      return bloc;
    };

    let afficherOptions = function () {
      listeOptions.innerHTML = "";
      (edition.options || []).forEach((option) => {
        listeOptions.appendChild(construireBlocOption(option));
      });
    };

    afficherOptions();

    // Case « Activer les options » : affichage seulement, les options existantes ne sont pas supprimées.
    let caseActiver = fragment.querySelector('[data-zone="options-activer"]');
    let contenuOptions = fragment.querySelector('[data-zone="options-contenu"]');
    caseActiver.checked = edition.optionsActives !== false;
    contenuOptions.hidden = !caseActiver.checked;
    caseActiver.addEventListener("change", () => {
      contenuOptions.hidden = !caseActiver.checked;
      options.surBasculerOptions?.(caseActiver.checked);
    });

    // Création d'une option avec ses valeurs, saisies sous la forme « S, M, L ».
    fragment.querySelector('[data-action="ajouter-option"]').addEventListener("click", () => {
      let nom = fragment.querySelector('[name="nouvelleOptionNom"]');
      let valeurs = fragment.querySelector('[name="nouvelleOptionValeurs"]');
      options.surAjouterOption?.(nom.value, valeurs.value);
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