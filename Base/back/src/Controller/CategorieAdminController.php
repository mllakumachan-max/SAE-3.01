<?php

declare(strict_types=1);

namespace App\Controller;

use App\Core\Request;
use App\Core\Response;
use App\Model\CategorieModel;

/**
 * Gestion des catégories par l'administrateur (création, modification, suppression).
 *
 * Toutes les actions exigent une session d'administrateur. Ce contrôleur porte
 * les règles métier : validation des données, unicité, règle de suppression.
 * Le modèle se contente d'exécuter les requêtes.
 */
final class CategorieAdminController
{
    private const TRIS = [
        'nom'          => 'CATEGORIE.libelle ASC',
        'produits_asc' => 'nb_produits ASC',
        'produits_desc'=> 'nb_produits DESC',
    ];

    private const PAR_PAGE_AUTORISES = [12, 24, 48];

    private const LIBELLE_MAX     = 100;
    private const DESCRIPTION_MAX = 500;

    /** Le modèle qui interroge la base, fourni à la construction. */
    private CategorieModel $categories;

    public function __construct(CategorieModel $categories)
    {
        $this->categories = $categories;
    }

    // GET /api/admin/categories
    public function index(Request $requete): void
    {
        $this->exigerAdmin();

        $tri = $requete->parametre('tri') ?? 'nom';
        $tri = array_key_exists($tri, self::TRIS) ? $tri : 'nom';

        $parPageBrut = $requete->parametre('parPage');
        if ($parPageBrut === null) {
            Response::json(['categories' => $this->categories->listerToutes(self::TRIS[$tri])]);
            return;
        }

        $parPage = (int) $parPageBrut;
        $parPage = in_array($parPage, self::PAR_PAGE_AUTORISES, true) ? $parPage : 12;
        $total = $this->categories->compterToutes();
        $pagesTotal = max(1, (int) ceil($total / $parPage));
        $page = (int) ($requete->parametre('page', '1') ?? '1');
        $page = max(1, min($page, $pagesTotal));

        Response::json([
            'categories' => $this->categories->listerToutes(
                self::TRIS[$tri],
                $parPage,
                ($page - 1) * $parPage
            ),
            'tri' => $tri,
            'parPage' => $parPage,
            'page' => $page,
            'pagesTotal' => $pagesTotal,
            'total' => $total,
        ]);
    }

    // POST /api/admin/categories  — corps : { libelle, description }
    public function creer(Request $requete): void
    {
        $this->exigerAdmin();

        $donnees = $this->valider($requete->corps());
        $slug    = $this->genererSlug($donnees['libelle']);

        if ($slug === '') {
            Response::erreur('Le nom doit contenir au moins une lettre ou un chiffre.', 400);
        }

        if ($this->categories->libelleExiste($donnees['libelle']) || $this->categories->slugExiste($slug)) {
            Response::erreur('Une catégorie porte déjà ce nom.', 409);
        }

        $id = $this->categories->creer($donnees['libelle'], $slug, $donnees['description']);

        Response::json(['categorie' => $this->categories->trouverParId($id)], 201);
    }

    // PUT /api/admin/categories/:id  — corps : { libelle, description }
    public function modifier(Request $requete): void
    {
        $this->exigerAdmin();

        $id = $this->identifiant($requete);
        $this->exigerExistante($id);

        $donnees = $this->valider($requete->corps());

        if ($this->categories->libelleExiste($donnees['libelle'], $id)) {
            Response::erreur('Une autre catégorie porte déjà ce nom.', 409);
        }

        $this->categories->modifier($id, $donnees['libelle'], $donnees['description']);

        Response::json(['categorie' => $this->categories->trouverParId($id)]);
    }

    // DELETE /api/admin/categories/:id  — corps : { cible_id } si la catégorie a des produits
    public function supprimer(Request $requete): void
    {
        $this->exigerAdmin();

        $id = $this->identifiant($requete);
        $this->exigerExistante($id);

        // Règle 1 : une catégorie qui a des sous-catégories ne se supprime pas.
        if ($this->categories->compterEnfants($id) > 0) {
            Response::erreur("Cette catégorie contient des sous-catégories : supprimez-les d'abord.", 409);
        }

        // Règle 2 : ses produits doivent être réaffectés à une autre catégorie.
        $nbProduits = $this->categories->compterProduits($id);
        $cibleId    = null;

        if ($nbProduits > 0) {
            $brut    = $requete->corps()['cible_id'] ?? null;
            $cibleId = is_numeric($brut) ? (int) $brut : null;

            if ($cibleId === null || $cibleId === $id) {
                Response::erreur('Choisissez une autre catégorie pour réaffecter ses produits.', 400);
            }

            $this->exigerExistante($cibleId);
        }

        $this->categories->supprimer($id, $cibleId);

        Response::json(['supprimee' => true, 'produits_reaffectes' => $nbProduits]);
    }

    /**
     * Contrôle la saisie et renvoie les valeurs nettoyées. Arrête la requête
     * avec une erreur 400 si la saisie est incohérente.
     *
     * @return array{libelle: string, description: ?string}
     */
    private function valider(array $corps): array
    {
        $libelle     = $corps['libelle'] ?? '';
        $description = $corps['description'] ?? '';

        if (!is_string($libelle) || !is_string($description)) {
            Response::erreur('Données invalides.', 400);
        }

        $libelle     = trim($libelle);
        $description = trim($description);

        if ($libelle === '') {
            Response::erreur('Le nom de la catégorie est obligatoire.', 400);
        }

        if (self::longueur($libelle) > self::LIBELLE_MAX) {
            Response::erreur('Le nom ne doit pas dépasser ' . self::LIBELLE_MAX . ' caractères.', 400);
        }

        if (self::longueur($description) > self::DESCRIPTION_MAX) {
            Response::erreur('La description ne doit pas dépasser ' . self::DESCRIPTION_MAX . ' caractères.', 400);
        }

        return [
            'libelle'     => $libelle,
            'description' => $description === '' ? null : $description,
        ];
    }

    /**
     * Nombre de caractères d'une chaîne UTF-8 (une lettre accentuée compte pour 1).
     * Écrit sans l'extension mbstring, qui n'est pas garantie sur le serveur.
     */
    private static function longueur(string $texte): int
    {
        return (int) preg_match_all('/./us', $texte);
    }

    /**
     * Slug d'URL à partir du libellé : « Décoration » devient « decoration ».
     */
    private function genererSlug(string $libelle): string
    {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $libelle);
        $base  = $ascii === false ? $libelle : $ascii;
        $slug  = strtolower((string) preg_replace('/[^A-Za-z0-9]+/', '-', $base));

        return trim($slug, '-');
    }

    /** Lit l'identifiant de l'URL. Refuse tout ce qui n'est pas un entier positif. */
    private function identifiant(Request $requete): int
    {
        $brut = $requete->parametreUrl('id') ?? '';

        if (!ctype_digit($brut) || (int) $brut <= 0) {
            Response::erreur('Identifiant invalide.', 400);
        }

        return (int) $brut;
    }

    private function exigerExistante(int $id): void
    {
        if ($this->categories->trouverParId($id) === null) {
            Response::erreur('Catégorie introuvable.', 404);
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
