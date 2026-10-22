/**
 * Images du catalogue.
 *
 * La base de données ne connaît que des chemins relatifs au dossier
 * src/images/, par exemple « habitat/serviette-verte.avif ».
 *
 * Or Vite ne copie pas tout src/ dans le build : il ne garde que les fichiers
 * qu'il voit « importés », et leur ajoute une empreinte dans le nom
 * (serviette-verte-a1b2c3.avif). Un chemin écrit en dur dans un <img> serait
 * donc faux une fois le site compilé.
 *
 * import.meta.glob demande à Vite d'importer d'un coup toutes les images :
 * il renvoie un objet { chemin du fichier source -> adresse finale }.
 * urlImage() fait la traduction « chemin de la base -> adresse utilisable ».
 */
const IMAGES = import.meta.glob("../images/**/*.{avif,png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

/**
 * @param {string|null|undefined} chemin Chemin relatif venant de la base.
 * @returns {string} Adresse de l'image, ou "" si elle est inconnue.
 */
export function urlImage(chemin) {
  if (!chemin) return "";
  // Image téléversée (GOF-a) : elle vit dans uploads/, à côté de l'application.
  if (chemin.startsWith("uploads/")) return import.meta.env.BASE_URL + chemin;
  return IMAGES[`../images/${chemin}`] ?? "";
}
