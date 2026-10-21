<?php

declare(strict_types=1);

namespace App\Model;

use PDO;

/**
 * Accès aux données du catalogue.
 *
 * Cette couche ne contient aucune règle métier et ne décide de rien :
 * elle exécute les requêtes qu'on lui demande et renvoie des tableaux.
 */
final class ProduitModel
{
    /** Connexion à la base, fournie à la construction. */
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Nombre de produits du catalogue avec un filtre par catégorie.
     */
    public function compter(?int $categorieId = null): int
    {
        if ($categorieId === null) {
            return (int) $this->pdo->query('SELECT COUNT(*) FROM PRODUIT')->fetchColumn();
        }

        $requetePreparee = $this->pdo->prepare(
            'SELECT COUNT(*) FROM PRODUIT WHERE PRODUIT.categorie_id = :categorie'
        );
        $requetePreparee->bindValue(':categorie', $categorieId, PDO::PARAM_INT);
        $requetePreparee->execute();

        return (int) $requetePreparee->fetchColumn();
    }

    /**
     * Une page du catalogue.
     *
     * @param string $ordre  Fragment SQL de tri, par exemple « PRODUIT.nom ASC ».
     *                       ATTENTION : ce fragment est inséré tel quel dans la
     *                       requête. Il ne doit JAMAIS provenir directement de
     *                       l'utilisateur — voir la liste blanche du contrôleur.
     * @param int    $limite Nombre de produits à renvoyer.
     * @param int    $decalage Nombre de produits à sauter (pagination).
     * @param int|null $categorieId Filtre par catégorie, ou null pour tout le catalogue.
     */
    public function lister(string $ordre, int $limite, int $decalage, ?int $categorieId = null): array
    {
        $filtre = $categorieId === null ? '' : 'WHERE PRODUIT.categorie_id = :categorie';

        $sql = "SELECT PRODUIT.id,
                       PRODUIT.reference,
                       PRODUIT.slug,
                       PRODUIT.nom,
                       PRODUIT.marque,
                       PRODUIT.format,
                       PRODUIT.prix,
                       PRODUIT.prix_unitaire,
                       PRODUIT.unite_prix,
                       PRODUIT.badge,
                       CATEGORIE.libelle AS categorie,
                         sous_cat.libelle AS sous_categorie,
                       GALERIE.chemin AS src,
                       GALERIE.texte_alternatif AS alt
                  FROM PRODUIT
            INNER JOIN CATEGORIE ON CATEGORIE.id = PRODUIT.categorie_id
                 LEFT JOIN CATEGORIE AS sous_cat ON sous_cat.id = PRODUIT.sous_categorie_id
             LEFT JOIN GALERIE ON GALERIE.id = (
                 SELECT g.id
                   FROM GALERIE g
                  WHERE g.produit_id = PRODUIT.id
                  ORDER BY g.ordre ASC
                  LIMIT 1
             )
                                 {$filtre}
              ORDER BY {$ordre}, PRODUIT.id
                 LIMIT :limite OFFSET :decalage";

        $requetePreparee = $this->pdo->prepare($sql);

        // Les valeurs, elles, sont bien liées : c'est le rôle des paramètres.
        $requetePreparee->bindValue(':limite',   $limite,   PDO::PARAM_INT);
        $requetePreparee->bindValue(':decalage', $decalage, PDO::PARAM_INT);

        if ($categorieId !== null) {
            $requetePreparee->bindValue(':categorie', $categorieId, PDO::PARAM_INT);
        }

        $requetePreparee->execute();

        return $requetePreparee->fetchAll();
    }

    /**
     * Un produit, cherché par son slug, avec ses catégories.
     *
     * Le slug est l'adresse publique du produit : c'est lui que l'URL
     * « /api/produits/couette-sans-housse-easy » désigne. Il est unique en
     * base (uq_produit_slug), donc une seule ligne peut correspondre.
     *
     * La catégorie est la catégorie racine (celle qui porte les produits dans
     * le catalogue) et la sous-catégorie celle qui les range dans un rayon
     * plus précis. Le nom de la colonne « categorie_id » est réutilisé pour la
     * catégorie racine : la jointure se fait donc sur une table aliasée.
     *
     * @return array<string, mixed>|null Le produit, ou null s'il n'existe pas.
     */
    public function trouverParSlug(string $slug): ?array
    {
        $sql = 'SELECT PRODUIT.id,
                       PRODUIT.reference,
                       PRODUIT.slug,
                       PRODUIT.nom,
                       PRODUIT.marque,
                       PRODUIT.format,
                       PRODUIT.description,
                       PRODUIT.prix,
                       PRODUIT.prix_unitaire,
                       PRODUIT.unite_prix,
                       PRODUIT.badge,
                       categorie.id       AS categorie_id,
                       categorie.libelle AS categorie,
                       categorie.slug    AS categorie_slug,
                       sous_cat.libelle  AS sous_categorie,
                       sous_cat.slug     AS sous_categorie_slug
                  FROM PRODUIT
             INNER JOIN CATEGORIE AS categorie ON categorie.id = PRODUIT.categorie_id
             LEFT  JOIN CATEGORIE AS sous_cat  ON sous_cat.id = PRODUIT.sous_categorie_id
                 WHERE PRODUIT.slug = :slug';

        $requetePreparee = $this->pdo->prepare($sql);
        $requetePreparee->bindValue(':slug', $slug, PDO::PARAM_STR);
        $requetePreparee->execute();

        $ligne = $requetePreparee->fetch();

        if ($ligne === false) {
            return null;
        }

        return [
            'id'                => (int) $ligne['id'],
            'reference'         => $ligne['reference'],
            'slug'              => $ligne['slug'],
            'nom'               => $ligne['nom'],
            'marque'            => $ligne['marque'],
            'format'            => $ligne['format'],
            'description'       => $ligne['description'],
            // Les DECIMAL arrivent en texte : c'est le front qui les convertit
            // en nombre, comme il le fait pour le catalogue.
            'prix'              => $ligne['prix'],
            'prix_unitaire'     => $ligne['prix_unitaire'],
            'unite_prix'        => $ligne['unite_prix'],
            'badge'             => $ligne['badge'],
            'categorie'         => [
                'id'      => (int) $ligne['categorie_id'],
                'libelle' => $ligne['categorie'],
                'slug'    => $ligne['categorie_slug'],
            ],
            'sous_categorie'    => $ligne['sous_categorie'] === null
                ? null
                : [
                    'libelle' => $ligne['sous_categorie'],
                    'slug'    => $ligne['sous_categorie_slug'],
                ],
        ];
    }

    /**
     * Les images d'un produit, dans l'ordre d'affichage.
     */
    public function galerie(int $produitId): array
    {
        $requetePreparee = $this->pdo->prepare(
            'SELECT chemin, texte_alternatif
               FROM GALERIE
              WHERE produit_id = :produit
           ORDER BY ordre ASC, id ASC'
        );
        $requetePreparee->bindValue(':produit', $produitId, PDO::PARAM_INT);
        $requetePreparee->execute();

        return array_map(
            static fn (array $ligne): array => [
                'chemin'           => $ligne['chemin'],
                'texte_alternatif' => $ligne['texte_alternatif'],
            ],
            $requetePreparee->fetchAll()
        );
    }

    /**
     * Statistiques globales du catalogue, pour la zone d'administration.
     */
    public function statistiques(): array
    {
        $global = $this->pdo->query(
            'SELECT COUNT(*) AS total,
                    AVG(prix) AS prix_moyen,
                    MIN(prix) AS prix_minimum,
                    MAX(prix) AS prix_maximum
               FROM PRODUIT'
        )->fetch();

        $parCategorie = $this->pdo->query(
            'SELECT CATEGORIE.libelle AS categorie,
                    COUNT(*)          AS nombre
               FROM PRODUIT
         INNER JOIN CATEGORIE ON CATEGORIE.id = PRODUIT.categorie_id
           GROUP BY CATEGORIE.id, CATEGORIE.libelle
           ORDER BY nombre DESC, CATEGORIE.libelle ASC'
        )->fetchAll();

        // MySQL renvoie les nombres sous forme de chaînes. On les convertit
        // ligne par ligne, pour que le JSON contienne bien des nombres.
        $categories = [];

        foreach ($parCategorie as $ligne) {
            $categories[] = [
                'categorie' => $ligne['categorie'],
                'nombre'    => (int) $ligne['nombre'],
            ];
        }

        return [
            'totalProduits' => (int) $global['total'],
            'prixMoyen'     => round((float) ($global['prix_moyen'] ?? 0), 2),
            'prixMinimum'   => round((float) ($global['prix_minimum'] ?? 0), 2),
            'prixMaximum'   => round((float) ($global['prix_maximum'] ?? 0), 2),
            'parCategorie'  => $categories,
        ];
    }
}
