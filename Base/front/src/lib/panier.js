/**
 * Panier du visiteur.
 *
 * Le panier est conservé dans le localStorage du navigateur : il survit aux
 * rechargements et à la fermeture de l'onglet, et il n demande aucune session
 * côté serveur.
 *
 * Le module ne dessine rien : il tient l'état, et prévient les composants
 * ([[majCompteurPanier]]) qui veulent le refléter.
 */

import { postRequest } from "./api-request.js";

const CLE_PANIER = "sae301:panier";

/** Les callbacks prévenu à chaque changement du panier. */
const abonnes = new Set();

/**
 * Envoie la liste des articles du panier à l'API pour vérifier que les
 * quantités demandées ne dépassent pas le stock actuel en base de données.
 *
 * Le panier vivant dans le localStorage, le serveur ne le connaît pas : c'est
 * le front qui lui transmet les lignes à contrôler.
 *
 * @param {Array<{id: number|string, quantite: number}>} lignes
 * @returns {Promise<{valide: boolean, lignes: Array<{id, nom, stock, quantiteDemandee, quantiteMax, estValide, message}>, messages: Array<string>}>}
 */
export async function verifierStock(lignes) {
  const reponse = await postRequest("panier/verifier-stock", { lignes });

  return {
    valide: reponse.valide === true,
    lignes: reponse.lignes ?? [],
    messages: (reponse.lignes ?? [])
      .filter((ligne) => ligne.message)
      .map((ligne) => ligne.message),
  };
}

/**
 * Lit le panier. Un localStorage inaccessible (navigation privée, quota
 * dépassé) ne doit pas casser la page : on renvoie alors un panier vide.
 *
 * @returns {Array<{id: number|string, slug: string, nom: string, prix: number, quantite: number, src: string}>}
 */
export function lignesPanier() {
  try {
    const brut = window.localStorage.getItem(CLE_PANIER);

    if (!brut) return [];

    const lignes = JSON.parse(brut);

    return Array.isArray(lignes) ? lignes : [];
  } catch (erreur) {
    return [];
  }
}

/**
 * Écrit le panier et prévient les abonnés.
 */
export function ecrire(lignes) {
  try {
    window.localStorage.setItem(CLE_PANIER, JSON.stringify(lignes));
  } catch (erreur) {
    // Le panier ne sera pas conservé, mais la page continue de fonctionner.
  }

  majCompteurPanier();

  for (let abonne of abonnes) {
    abonne(lignes);
  }
}

/**
 * Nombre d'articles dans le panier (les quantités sont comptées).
 */
export function nombreArticles() {
  return lignesPanier().reduce((total, ligne) => total + (Number(ligne.quantite) || 0), 0);
}

/**
 * Total du panier, en euros.
 */
export function totalPanier() {
  return lignesPanier().reduce(
    (total, ligne) => total + (Number(ligne.prix) || 0) * (Number(ligne.quantite) || 0),
    0
  );
}

/**
 * Ajoute un produit au panier. Un produit déjà présent voit sa quantité
 * augmentée plutôt que d'être dupliqué.
 *
 * @param {{id: number|string, slug?: string, nom?: string, prix?: number|string, src?: string}} produit
 * @param {number} quantite
 * @returns {Array} Le panier après l'ajout.
 */
export function ajouterAuPanier(produit, quantite = 1) {
  const lignes = lignesPanier();
  const quantiteDemandee = Math.max(1, Math.floor(Number(quantite) || 1));
  const id = produit?.id;

  if (id === undefined || id === null) return lignes;

  const existante = lignes.find((ligne) => String(ligne.id) === String(id));

  if (existante) {
    existante.quantite = (Number(existante.quantite) || 0) + quantiteDemandee;
  } else {
    lignes.push({
      id,
      slug: produit.slug ?? "",
      nom: produit.nom ?? "",
      prix: Number(produit.prix) || 0,
      quantite: quantiteDemandee,
      src: produit.src ?? "",
    });
  }

  ecrire(lignes);

  return lignes;
}

/**
 * Change la quantité d'une ligne. Une quantité nulle ou négative retire la
 * ligne du panier.
 *
 * @param {number|string} id
 * @param {number} quantite
 */
export function modifierQuantite(id, quantite) {
  const lignes = lignesPanier();
  const ligne = lignes.find((entree) => String(entree.id) === String(id));

  if (!ligne) return lignes;

  const nouvelle = Math.floor(Number(quantite) || 0);

  if (nouvelle <= 0) {
    ecrire(lignes.filter((entree) => String(entree.id) !== String(id)));
    return lignesPanier();
  }

  ligne.quantite = nouvelle;
  ecrire(lignes);

  return lignes;
}

/**
 * Retire une ligne du panier.
 *
 * @param {number|string} id
 */
export function retirerDuPanier(id) {
  const lignes = lignesPanier().filter((ligne) => String(ligne.id) !== String(id));

  ecrire(lignes);

  return lignes;
}

/**
 * Vide le panier.
 */
export function viderPanier() {
  ecrire([]);
}

/**
 * S'abonner aux changements du panier.
 *
 * @param {(lignes: Array) => void} callback
 * @returns {() => void} La fonction à appeler pour se désabonner.
 */
export function surChangementPanier(callback) {
  abonnes.add(callback);

  return () => abonnes.delete(callback);
}

/**
 * Met à jour les compteurs de panier présents dans la page.
 *
 * L'en-tête affiche le nombre d'articles : le composant est reconstruit à
 * chaque navigation, et cette fonction le rafraîchit entre deux navigations.
 */
export function majCompteurPanier() {
  const nombre = nombreArticles();

  for (let compteur of document.querySelectorAll('[data-role="compteur-panier"]')) {
    compteur.textContent = String(nombre);
  }
}
