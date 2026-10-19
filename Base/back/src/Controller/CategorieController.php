<?php

declare(strict_types=1);

namespace App\Controller;

use App\Core\Request;
use App\Core\Response;
use App\Model\CategorieModel;

/**
 * Liste des catégories racines, pour la navigation du client.
 */
final class CategorieController
{
    /** Le modèle qui interroge la base, fourni à la construction. */
    private CategorieModel $categories;

    public function __construct(CategorieModel $categories)
    {
        $this->categories = $categories;
    }

    public function index(Request $requete): void
    {
        Response::json([
            'categories' => $this->categories->listerRacines(),
        ]);
    }
}
