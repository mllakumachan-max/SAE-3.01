<?php

declare(strict_types=1);

namespace App\Controller;

use App\Core\Request;
use App\Core\Response;
use App\Model\ProduitModel;

/**
 * Vérification de la disponibilité des articles d'un panier.
 *
 * Le panier est conservé côté client (localStorage) : le serveur ne le connaît
 * pas. Le front envoie donc la liste des articles souhaités, et le serveur
 * répond, pour chacun, si la quantité demandée est compatible avec le stock
 * actuel en base de données.
 */
final class PanierController
{
    private ProduitModel $produits;

    public function __construct(ProduitModel $produits)
    {
        $this->produits = $produits;
    }

    /**
     * Vérifie le stock d'une liste d'articles de panier.
     *
     * POST /api/panier/verifier-stock
     *
     * Corps attendu : { lignes: [{ id: int, quantite: int }] }
     *
     * Réponse : { valide: bool, lignes: [{ id, nom, stock, quantiteDemandee,
     *     quantiteMax, estValide, message }] }
     *
     * quantiteMax est la quantité maximale autorisée pour ce produit dans le
     * panier (égale au stock, ou 0 si le produit est épuisé/introuvable).
     */
    public function verifierStock(Request $requete): void
    {
        $corps = $requete->corps();
        $lignes = $corps['lignes'] ?? [];

        if (!is_array($lignes)) {
            Response::erreur('Le panier doit être une liste de lignes.', 400);
            return;
        }

        $resultats = [];
        $toutValide = true;

        foreach ($lignes as $ligne) {
            $id = (int) ($ligne['id'] ?? 0);
            $quantite = max(0, (int) ($ligne['quantite'] ?? 0));

            if ($id <= 0) {
                $resultats[] = [
                    'id'              => null,
                    'stock'           => null,
                    'quantiteDemandee' => $quantite,
                    'quantiteMax'     => 0,
                    'estValide'       => false,
                    'message'         => 'Produit invalide.',
                ];
                $toutValide = false;
                continue;
            }

            $produit = $this->produits->trouverParId($id);

            if ($produit === null) {
                $resultats[] = [
                    'id'              => $id,
                    'stock'           => null,
                    'quantiteDemandee' => $quantite,
                    'quantiteMax'     => 0,
                    'estValide'       => false,
                    'message'         => 'Produit introuvable.',
                ];
                $toutValide = false;
                continue;
            }

            $stock = (int) $produit['stock'];
            $estValide = $stock > 0 && $quantite <= $stock;

            if (!$estValide) {
                $toutValide = false;
            }

            if ($stock <= 0) {
                $message = 'Ce produit est épuisé.';
            } elseif ($quantite > $stock) {
                $message = 'Quantité limitée au stock disponible (' . $stock . ' maximum).';
            } else {
                $message = null;
            }

            $resultats[] = [
                'id'              => $id,
                'nom'             => $produit['nom'],
                'stock'           => $stock,
                'quantiteDemandee' => $quantite,
                'quantiteMax'     => $stock,
                'estValide'       => $estValide,
                'message'         => $message,
            ];
        }

        Response::json([
            'valide'  => $toutValide && $resultats !== [],
            'lignes'  => $resultats,
        ]);
    }
}
