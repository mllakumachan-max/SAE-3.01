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
     * Statistiques globales du catalogue, pour la zone d'administration.
     */
    /*
    public function statistiques(): array
    {
        $global = $this->pdo->query(
            'SELECT COUNT(*)           AS total,
                    AVG(note_moyenne)  AS note_moyenne,
                    AVG(duree_minutes) AS duree_moyenne
               FROM PRODUIT'
        )->fetch();

        $parGenre = $this->pdo->query(
            'SELECT GENRE.libelle AS genre,
                    COUNT(*)      AS nombre
               FROM PRODUIT
         INNER JOIN GENRE ON GENRE.id = PRODUIT.genre_id
           GROUP BY GENRE.libelle
           ORDER BY nombre DESC, GENRE.libelle ASC'
        )->fetchAll();

        // MySQL renvoie les nombres sous forme de chaînes. On les convertit
        // ligne par ligne, pour que le JSON contienne bien des nombres.
        $genres = [];

        foreach ($parGenre as $ligne) {
            $genres[] = [
                'genre'  => $ligne['genre'],
                'nombre' => (int) $ligne['nombre'],
            ];
        }

        return [
            'total'        => (int) $global['total'],
            'noteMoyenne'  => round((float) $global['note_moyenne'], 1),
            'dureeMoyenne' => (int) round((float) $global['duree_moyenne']),
            'parGenre'     => $genres,
        ];
    }*/
}
