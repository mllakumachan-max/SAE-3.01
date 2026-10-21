<?php

declare(strict_types=1);

namespace App\Model;

use PDO;

/**
 * Accès aux données des catégories.
 *
 * Cette couche ne contient aucune règle métier et ne décide de rien :
 * elle exécute les requêtes qu'on lui demande et renvoie des tableaux.
 */
final class CategorieModel
{
    /** Connexion à la base, fournie à la construction. */
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Catégories racines (sans parent), avec leur nombre de produits.
     *
     * LEFT JOIN : une catégorie sans produit apparaît tout de même, avec 0.
     */
    public function listerRacines(): array
    {
        $sql = 'SELECT CATEGORIE.id,
                       CATEGORIE.libelle,
                       CATEGORIE.slug,
                       COUNT(PRODUIT.id) AS nb_produits
                  FROM CATEGORIE
             LEFT JOIN PRODUIT ON PRODUIT.categorie_id = CATEGORIE.id
                 WHERE CATEGORIE.parent_id IS NULL
              GROUP BY CATEGORIE.id, CATEGORIE.libelle, CATEGORIE.slug
              ORDER BY CATEGORIE.id ASC';

        $lignes = $this->pdo->query($sql)->fetchAll();

        // MySQL renvoie les nombres sous forme de chaînes : on les convertit
        // pour que le JSON contienne bien des nombres.
        return array_map(
            static fn (array $ligne): array => [
                'id'          => (int) $ligne['id'],
                'libelle'     => $ligne['libelle'],
                'slug'        => $ligne['slug'],
                'nb_produits' => (int) $ligne['nb_produits'],
            ],
            $lignes
        );
    }

    /**
     * Trouve une catégorie racine par son slug.
     */
    public function trouverRacineParSlug(string $slug): ?array
    {
        $sql = $this->pdo->prepare(
            'SELECT id, libelle, slug
            FROM CATEGORIE
            WHERE slug = :slug AND parent_id IS NULL'
        );
        $sql->bindValue(':slug', $slug, PDO::PARAM_STR);
        $sql->execute();

        $ligne = $sql->fetch();

        if ($ligne === false) {
            return null;
        }

        return [
            'id'      => (int) $ligne['id'],
            'libelle' => $ligne['libelle'],
            'slug'    => $ligne['slug'],
        ];
    }
}
