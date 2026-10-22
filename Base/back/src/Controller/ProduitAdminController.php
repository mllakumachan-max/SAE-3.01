<?php

declare(strict_types=1);

namespace App\Controller;

use App\Core\Request;
use App\Core\Response;
use App\Model\CategorieModel;
use App\Model\ProduitModel;
use GdImage;

/**
 * Gestion des produits par l'administrateur (GOF-a) : création, modification,
 * suppression, et images (téléversement et redimensionnement).
 *
 * Toutes les actions exigent une session d'administrateur. Ce contrôleur porte
 * les règles de saisie ; le modèle se contente d'exécuter les requêtes.
 */
final class ProduitAdminController
{
    private const TRIS = [
        'nom'       => 'PRODUIT.nom ASC',
        'prix'      => 'PRODUIT.prix ASC',
        'categorie' => 'CATEGORIE.libelle ASC',
        'stock'     => 'PRODUIT.stock ASC',
        'etat'      => 'CASE WHEN PRODUIT.stock <= 0 THEN 0 WHEN PRODUIT.stock <= PRODUIT.seuil_alerte THEN 1 ELSE 2 END ASC',
    ];

    private const PAR_PAGE_AUTORISES = [12, 24, 48];

    private const NOM_MAX         = 160;
    private const REFERENCE_MAX   = 20;
    private const MARQUE_MAX      = 80;
    private const FORMAT_MAX      = 120;
    private const DESCRIPTION_MAX = 2000;
    private const BADGE_MAX       = 40;
    private const UNITE_MAX       = 10;
    private const PRIX_MAX        = 9999.99;
    private const STOCK_MAX       = 65535;
    private const SEUIL_MAX       = 255;

    private const IMAGES_PAR_PRODUIT = 10;
    private const IMAGE_OCTETS_MAX   = 5242880; // 5 Mo
    private const IMAGE_COTE_MAX     = 1200;    // côté le plus long, en pixels
    private const DOSSIER_IMAGES     = 'uploads/produits'; // relatif à Base/

    /** Le modèle qui interroge la base, fourni à la construction. */
    private ProduitModel $produits;

    /** Le modèle des catégories, pour vérifier la catégorie choisie. */
    private CategorieModel $categories;

    public function __construct(ProduitModel $produits, CategorieModel $categories)
    {
        $this->produits   = $produits;
        $this->categories = $categories;
    }

    // GET /api/admin/produits
    public function index(Request $requete): void
    {
        $this->exigerAdmin();

        $tri = $requete->parametre('tri') ?? 'nom';
        $parPage = (int) ($requete->parametre('parPage') ?? 12);
        $tri = array_key_exists($tri, self::TRIS) ? $tri : 'nom';
        $parPage = in_array($parPage, self::PAR_PAGE_AUTORISES, true) ? $parPage : 12;

        $total = $this->produits->compter();
        $pagesTotal = max(1, (int) ceil($total / $parPage));
        $page = (int) ($requete->parametre('page', '1') ?? '1');
        $page = max(1, min($page, $pagesTotal));

        Response::json([
            'produits' => $this->produits->listerAdmin(self::TRIS[$tri], $parPage, ($page - 1) * $parPage),
            'tri' => $tri,
            'parPage' => $parPage,
            'page' => $page,
            'pagesTotal' => $pagesTotal,
            'total' => $total,
        ]);
    }

    // POST /api/admin/produits  — corps : champs du produit (voir valider())
    public function creer(Request $requete): void
    {
        $this->exigerAdmin();

        $donnees = $this->valider($requete->corps());

        if ($donnees['reference'] !== null && $this->produits->referenceExiste($donnees['reference'])) {
            Response::erreur('Un produit porte déjà cette référence.', 409);
        }

        $donnees['reference'] ??= $this->referenceLibre();
        $donnees['slug']        = $this->slugLibre($donnees['nom']);

        $id = $this->produits->creer($donnees);

        Response::json(['produit' => $this->produits->trouverAdminParId($id)], 201);
    }

    // PUT /api/admin/produits/:id  — corps : champs du produit (voir valider())
    public function modifier(Request $requete): void
    {
        $this->exigerAdmin();

        $id = $this->identifiant($requete, 'id');
        $this->exigerExistant($id);

        $donnees  = $this->valider($requete->corps());
        $actuel   = $this->produits->trouverAdminParId($id);
        $donnees['reference'] ??= $actuel['reference'];

        if ($this->produits->referenceExiste($donnees['reference'], $id)) {
            Response::erreur('Un autre produit porte déjà cette référence.', 409);
        }

        $this->produits->modifier($id, $donnees);

        Response::json(['produit' => $this->produits->trouverAdminParId($id)]);
    }

    // DELETE /api/admin/produits/:id
    public function supprimer(Request $requete): void
    {
        $this->exigerAdmin();

        $id = $this->identifiant($requete, 'id');
        $this->exigerExistant($id);

        foreach ($this->produits->supprimer($id) as $chemin) {
            $this->supprimerFichier($chemin);
        }

        Response::json(['supprimee' => true]);
    }

    // POST /api/admin/produits/:id/images — corps : { image (data URL), texte_alternatif }
    public function ajouterImage(Request $requete): void
    {
        $this->exigerAdmin();

        $id = $this->identifiant($requete, 'id');
        $this->exigerExistant($id);

        if ($this->produits->compterImages($id) >= self::IMAGES_PAR_PRODUIT) {
            Response::erreur('Un produit ne peut pas avoir plus de ' . self::IMAGES_PAR_PRODUIT . ' images.', 409);
        }

        $corps  = $requete->corps();
        $source = $this->decoderImage($corps['image'] ?? null);
        $texte  = $this->texte($corps, 'texte_alternatif', 160, 'Le texte alternatif');
        $chemin = $this->enregistrerImage($source, $id);

        $imageId = $this->produits->ajouterImage(
            $id,
            $chemin,
            $texte,
            $this->produits->compterImages($id) + 1
        );

        Response::json([
            'image' => ['id' => $imageId, 'chemin' => $chemin, 'texte_alternatif' => $texte],
        ], 201);
    }

    // DELETE /api/admin/produits/:id/images/:imageId
    public function supprimerImage(Request $requete): void
    {
        $this->exigerAdmin();

        $id      = $this->identifiant($requete, 'id');
        $imageId = $this->identifiant($requete, 'imageId');
        $image   = $this->produits->trouverImage($imageId);

        if ($image === null || $image['produit_id'] !== $id) {
            Response::erreur('Image introuvable.', 404);
        }

        $this->produits->supprimerImage($imageId);
        $this->supprimerFichier($image['chemin']);

        Response::json(['supprimee' => true]);
    }

    /**
     * Contrôle la saisie et renvoie les valeurs prêtes pour le modèle.
     * Arrête la requête avec une erreur 400 si la saisie est incohérente.
     *
     * Champs : nom (obligatoire), reference (facultative, générée si vide),
     * categorie_id (obligatoire), marque, format, description, prix (obligatoire),
     * prix_unitaire, unite_prix, badge, stock (obligatoire), seuil_alerte (obligatoire).
     *
     * @return array<string, mixed>
     */
    private function valider(array $corps): array
    {
        $nom = $this->texte($corps, 'nom', self::NOM_MAX, 'Le nom du produit');

        if ($nom === null) {
            Response::erreur('Le nom du produit est obligatoire.', 400);
        }

        $categorieId = $this->entier($corps['categorie_id'] ?? null, 'La catégorie', 255);

        if ($categorieId === 0 || $this->categories->trouverParId($categorieId) === null) {
            Response::erreur('Choisissez une catégorie existante.', 400);
        }

        $reference = $this->texte($corps, 'reference', self::REFERENCE_MAX, 'La référence');

        if ($reference !== null && preg_match('/^[A-Za-z0-9-]+$/', $reference) !== 1) {
            Response::erreur('La référence ne peut contenir que des lettres, des chiffres et des tirets.', 400);
        }

        return [
            'nom'           => $nom,
            'reference'     => $reference,
            'categorie_id'  => $categorieId,
            'marque'        => $this->texte($corps, 'marque', self::MARQUE_MAX, 'La marque'),
            'format'        => $this->texte($corps, 'format', self::FORMAT_MAX, 'Le format'),
            'description'   => $this->texte($corps, 'description', self::DESCRIPTION_MAX, 'La description'),
            'prix'          => $this->montant($corps['prix'] ?? null, 'Le prix', true),
            'prix_unitaire' => $this->montant($corps['prix_unitaire'] ?? null, 'Le prix unitaire', false),
            'unite_prix'    => $this->texte($corps, 'unite_prix', self::UNITE_MAX, "L'unité de prix"),
            'badge'         => $this->texte($corps, 'badge', self::BADGE_MAX, 'Le badge'),
            'stock'         => $this->entier($corps['stock'] ?? null, 'Le stock', self::STOCK_MAX),
            'seuil_alerte'  => $this->entier($corps['seuil_alerte'] ?? null, 'Le seuil d\'alerte', self::SEUIL_MAX),
        ];
    }

    /**
     * Texte facultatif : espaces retirés, null si vide. Refuse un texte trop long.
     */
    private function texte(array $corps, string $cle, int $max, string $libelle): ?string
    {
        $brut = $corps[$cle] ?? null;

        if ($brut === null) {
            return null;
        }

        if (!is_string($brut)) {
            Response::erreur('Données invalides.', 400);
        }

        $texte = trim($brut);

        if ($texte === '') {
            return null;
        }

        if (self::longueur($texte) > $max) {
            Response::erreur($libelle . ' ne doit pas dépasser ' . $max . ' caractères.', 400);
        }

        return $texte;
    }

    /**
     * Montant en euros, normalisé sur deux décimales (« 12,5 » devient « 12.50 »).
     * Renvoie null si le montant est facultatif et absent.
     */
    private function montant(mixed $brut, string $libelle, bool $obligatoire): ?string
    {
        if ($brut === null || $brut === '') {
            if ($obligatoire) {
                Response::erreur($libelle . ' est obligatoire.', 400);
            }

            return null;
        }

        $texte = (is_string($brut) || is_numeric($brut)) ? str_replace(',', '.', (string) $brut) : '';

        if (preg_match('/^\d{1,4}(\.\d{1,2})?$/', $texte) !== 1 || (float) $texte > self::PRIX_MAX) {
            Response::erreur($libelle . ' doit être un nombre positif, par exemple 12,95.', 400);
        }

        return number_format((float) $texte, 2, '.', '');
    }

    /**
     * Entier positif ou nul, borné par $max.
     */
    private function entier(mixed $brut, string $libelle, int $max): int
    {
        $valeur = null;

        if (is_int($brut)) {
            $valeur = $brut;
        } elseif (is_string($brut) && ctype_digit($brut)) {
            $valeur = (int) $brut;
        }

        if ($valeur === null || $valeur < 0 || $valeur > $max) {
            Response::erreur($libelle . ' doit être un nombre entier entre 0 et ' . $max . '.', 400);
        }

        return $valeur;
    }

    /**
    * Décode une image envoyée en data URL (AVIF, JPEG, PNG ou WebP) et la rend
     * utilisable par GD. Refuse tout ce qui n'est pas une image valide.
     */
    private function decoderImage(mixed $brut): GdImage
    {
        if (!is_string($brut) || preg_match('#^data:image/(avif|jpeg|png|webp);base64,([A-Za-z0-9+/=\s]+)$#', $brut, $morceaux) !== 1) {
            Response::erreur('Image invalide : formats acceptés AVIF, JPG/JPEG, PNG ou WebP.', 400);
        }

        $octets = base64_decode(preg_replace('/\s+/', '', $morceaux[2]) ?? '', true);

        if ($octets === false || $octets === '') {
            Response::erreur('Image illisible.', 400);
        }

        if (strlen($octets) > self::IMAGE_OCTETS_MAX) {
            Response::erreur('Image trop lourde : 5 Mo maximum.', 400);
        }

        $infos = getimagesizefromstring($octets);

        $typesAutorises = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP];

        if (defined('IMAGETYPE_AVIF')) {
            $typesAutorises[] = IMAGETYPE_AVIF;
        }

        if ($infos === false || !in_array($infos[2], $typesAutorises, true)) {
            Response::erreur('Image invalide : formats acceptés AVIF, JPG/JPEG, PNG ou WebP.', 400);
        }

        $source = imagecreatefromstring($octets);

        if ($source === false) {
            Response::erreur('Image illisible.', 400);
        }

        return $source;
    }

    /**
     * Redimensionne l'image (côté le plus long : IMAGE_COTE_MAX), l'enregistre en
     * JPEG et renvoie son chemin relatif à Base/, tel qu'il est stocké en base.
     * Réencoder l'image la débarrasse de tout contenu indésirable.
     */
    private function enregistrerImage(GdImage $source, int $produitId): string
    {
        $largeur = imagesx($source);
        $hauteur = imagesy($source);

        // min(1.0, …) : une image déjà petite n'est jamais agrandie.
        $echelle         = min(1.0, self::IMAGE_COTE_MAX / max($largeur, $hauteur));
        $nouvelleLargeur = max(1, (int) round($largeur * $echelle));
        $nouvelleHauteur = max(1, (int) round($hauteur * $echelle));

        // Le JPEG n'a pas de transparence : fond blanc derrière les PNG transparents.
        $cible = imagecreatetruecolor($nouvelleLargeur, $nouvelleHauteur);
        imagefill($cible, 0, 0, imagecolorallocate($cible, 255, 255, 255));
        imagealphablending($cible, true);
        imagecopyresampled($cible, $source, 0, 0, 0, 0, $nouvelleLargeur, $nouvelleHauteur, $largeur, $hauteur);

        $nomFichier = 'produit-' . $produitId . '-' . bin2hex(random_bytes(6)) . '.jpg';

        if (!imagejpeg($cible, $this->dossierImages() . '/' . $nomFichier, 85)) {
            Response::erreur("Enregistrement de l'image impossible.", 500);
        }

        return self::DOSSIER_IMAGES . '/' . $nomFichier;
    }

    /** Dossier des images téléversées, créé au besoin. */
    private function dossierImages(): string
    {
        // __DIR__ vaut back/src/Controller : trois niveaux plus haut, c'est Base/.
        $dossier = dirname(__DIR__, 3) . '/' . self::DOSSIER_IMAGES;

        if (!is_dir($dossier) && !mkdir($dossier, 0755, true) && !is_dir($dossier)) {
            Response::erreur("Dossier d'images inaccessible.", 500);
        }

        return $dossier;
    }

    /**
     * Efface un fichier téléversé. Une image du dépôt (src/images) n'est jamais touchée.
     */
    private function supprimerFichier(string $chemin): void
    {
        if (!str_starts_with($chemin, self::DOSSIER_IMAGES . '/') || str_contains($chemin, '..')) {
            return;
        }

        $fichier = dirname(__DIR__, 3) . '/' . $chemin;

        if (is_file($fichier)) {
            unlink($fichier);
        }
    }

    /** Référence à 7 chiffres, libre en base. */
    private function referenceLibre(): string
    {
        for ($essai = 0; $essai < 20; $essai++) {
            $reference = (string) random_int(1000000, 9999999);

            if (!$this->produits->referenceExiste($reference)) {
                return $reference;
            }
        }

        Response::erreur('Impossible de générer une référence. Saisissez-la manuellement.', 500);
    }

    /**
     * Slug d'URL à partir du nom, rendu unique : « Lampe » puis « lampe-2 ».
     */
    private function slugLibre(string $nom): string
    {
        $base = substr($this->genererSlug($nom), 0, 140);

        if ($base === '') {
            $base = 'produit';
        }

        $slug = $base;
        $n    = 2;

        while ($this->produits->slugExiste($slug)) {
            $slug = $base . '-' . $n;
            $n++;
        }

        return $slug;
    }

    /** « Lampe de travail » devient « lampe-de-travail ». */
    private function genererSlug(string $nom): string
    {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $nom);
        $base  = $ascii === false ? $nom : $ascii;
        $slug  = strtolower((string) preg_replace('/[^A-Za-z0-9]+/', '-', $base));

        return trim($slug, '-');
    }

    /** Nombre de caractères d'une chaîne UTF-8 (sans l'extension mbstring). */
    private static function longueur(string $texte): int
    {
        return (int) preg_match_all('/./us', $texte);
    }

    /** Lit un identifiant dans l'URL. Refuse tout ce qui n'est pas un entier positif. */
    private function identifiant(Request $requete, string $cle): int
    {
        $brut = $requete->parametreUrl($cle) ?? '';

        if (!ctype_digit($brut) || (int) $brut <= 0) {
            Response::erreur('Identifiant invalide.', 400);
        }

        return (int) $brut;
    }

    private function exigerExistant(int $id): void
    {
        if ($this->produits->trouverAdminParId($id) === null) {
            Response::erreur('Produit introuvable.', 404);
        }
    }

    private function exigerAdmin(): void
    {
        // La session est déjà ouverte par index.php.
        if (!isset($_SESSION['utilisateur'])) {
            Response::erreur("Vous n'êtes pas connecté.", 401);
        }

        if (($_SESSION['role'] ?? '') !== 'admin') {
            Response::erreur('Accès réservé aux administrateurs.', 403);
        }
    }
}