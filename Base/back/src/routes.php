<?php

declare(strict_types=1);

use App\Controller\AuthController;
use App\Controller\CategorieAdminController;
use App\Controller\CategorieController;
use App\Controller\CatalogueController;
use App\Controller\ProduitController;
use App\Controller\StatsController;

/**
 * Table des routes de l'API.
 *
 * Clé    : méthode HTTP et chemin, séparés par un ou plusieurs espaces.
 * Valeur : [classe du contrôleur, méthode à appeler].
 *
 * Un chemin peut contenir un paramètre, écrit « :nom » : la route
 * « GET /api/produits/:slug » répond à « /api/produits/couette-sans-housse-easy »
 * et place « couette-sans-housse-easy » dans $requete->parametreUrl('slug').
 *
 * Toute instance de contrôleur utilisée ici doit également être enregistrée
 * dans back/index.php.
 */

return [
    'GET  /api/produits'    => [CatalogueController::class, 'index'],
    'GET  /api/produits/:slug' => [ProduitController::class,  'detail'],
    'GET  /api/categories'  => [CategorieController::class, 'index'],
    'POST /api/login'       => [AuthController::class,      'login'],
    'POST /api/logout'      => [AuthController::class,      'logout'],
    'GET  /api/admin/categories' => [CategorieAdminController::class,     'index'],
    'GET  /api/admin/stats' => [StatsController::class,     'index'],
];
