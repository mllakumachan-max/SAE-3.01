<?php

declare(strict_types=1);

use App\Controller\AuthController;
use App\Controller\CategorieAdminController;
use App\Controller\CategorieController;
use App\Controller\CatalogueController;
use App\Controller\PanierController;
use App\Controller\ProduitAdminController;
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
    // GET
    'GET  /api/produits'            => [CatalogueController::class, 'index'],
    'GET  /api/produits/:slug'      => [ProduitController::class,  'detail'],
    'GET  /api/categories'          => [CategorieController::class, 'index'],
    'GET  /api/admin/categories'    => [CategorieAdminController::class,     'index'],
    'GET  /api/admin/produits'      => [ProduitAdminController::class, 'index'],
    'GET  /api/admin/stats'         => [StatsController::class,     'index'],

    // POST
    'POST /api/login'                       => [AuthController::class,      'login'],
    'POST /api/logout'                      => [AuthController::class,      'logout'],
    'POST /api/panier/verifier-stock'       => [PanierController::class,    'verifierStock'],
    'POST /api/admin/categories'            => [CategorieAdminController::class,     'creer'],
    'POST /api/admin/produits'              => [ProduitAdminController::class, 'creer'],
    'POST /api/admin/produits/:id/images'   => [ProduitAdminController::class, 'ajouterImage'],

    // PUT
    'PUT  /api/admin/categories/:id'    => [CategorieAdminController::class, 'modifier'],
    'PUT  /api/admin/produits/:id'      => [ProduitAdminController::class, 'modifier'],

    // Options de personnalisation d'un produit
    'GET  /api/admin/produits/:id/options'   => [ProduitAdminController::class, 'options'],
    'POST /api/admin/produits/:id/options'   => [ProduitAdminController::class, 'creerOption'],
    'PUT  /api/admin/produits/options/:id'   => [ProduitAdminController::class, 'modifierOption'],
    'DELETE /api/admin/produits/options/:id' => [ProduitAdminController::class, 'supprimerOption'],
    'POST /api/admin/produits/options/:id/valeurs' => [ProduitAdminController::class, 'ajouterValeur'],
    'PUT  /api/admin/produits/valeurs/:id'   => [ProduitAdminController::class, 'modifierValeur'],
    'DELETE /api/admin/produits/valeurs/:id' => [ProduitAdminController::class, 'supprimerValeur'],

    // DELETE
    'DELETE /api/admin/categories/:id'                  => [CategorieAdminController::class, 'supprimer'],
    'DELETE /api/admin/produits/:id'                    => [ProduitAdminController::class, 'supprimer'],
    'DELETE /api/admin/produits/:id/images/:imageId'    => [ProduitAdminController::class, 'supprimerImage'],

];
