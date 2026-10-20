<?php

declare(strict_types=1);

namespace App\Controller;

use App\Core\Request;
use App\Core\Response;
use App\Model\ProduitModel;

/**
 * Fiche d'un produit.
 *
 * Le produit est désigné par son slug, celui qui figure dans l'adresse
 * publique : /produit/couette-sans-housse-easy. L'API expose donc la même
 * forme : GET /api/produits/couette-sans-housse-easy.
 */
final class ProduitController
{
    /** Le modèle qui interroge la base, fourni à la construction. */
    private ProduitModel $produits;

    public function __construct(ProduitModel $produits)
    {
        $this->produits = $produits;
    }

    /**
     * Un produit et sa galerie d'images.
     *
     * GET /api/produits/:slug
     */
    public function detail(Request $requete): void
    {
        $slug = $requete->parametreUrl('slug');

        // Le slug vient de l'URL : c'est une donnée extérieure, on la contrôle
        // avant de l'envoyer à la base.
        if ($slug === null || $slug === '') {
            Response::erreur('Aucun produit demandé.', 400);
            return;
        }

        if (preg_match('/^[a-z0-9-]{1,160}$/', $slug) !== 1) {
            Response::erreur('Adresse de produit invalide.', 400);
            return;
        }

        $produit = $this->produits->trouverParSlug($slug);

        if ($produit === null) {
            Response::erreur('Produit introuvable : ' . $slug, 404);
            return;
        }

        Response::json([
            'produit' => $produit,
            'galerie' => $this->produits->galerie($produit['id']),
        ]);
    }
}
