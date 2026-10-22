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

    /**
     * Toutes les catégories (racines et sous-catégories), pour le back-office.
     */
    public function listerToutes(
        string $ordre = 'CATEGORIE.id ASC',
        ?int $limite = null,
        int $decalage = 0
    ): array
    {
        $sql = 'SELECT CATEGORIE.id,
                       CATEGORIE.libelle,
                       CATEGORIE.slug,
                       CATEGORIE.description,
                       CATEGORIE.parent_id,
                       COUNT(PRODUIT.id) AS nb_produits
                  FROM CATEGORIE
             LEFT JOIN PRODUIT ON PRODUIT.categorie_id = CATEGORIE.id
              GROUP BY CATEGORIE.id, CATEGORIE.libelle, CATEGORIE.slug,
                       CATEGORIE.description, CATEGORIE.parent_id
              ORDER BY ' . $ordre . ', CATEGORIE.id ASC';

        if ($limite !== null) {
            $sql .= ' LIMIT :limite OFFSET :decalage';
        }

        $requete = $this->pdo->prepare($sql);

        if ($limite !== null) {
            $requete->bindValue(':limite', $limite, PDO::PARAM_INT);
            $requete->bindValue(':decalage', $decalage, PDO::PARAM_INT);
        }

        return array_map(
            fn (array $ligne): array => $this->formater($ligne),
            $requete->execute() ? $requete->fetchAll() : []
        );
    }

    /** Nombre total de catégories, racines et sous-catégories. */
    public function compterToutes(): int
    {
        return (int) $this->pdo->query('SELECT COUNT(*) FROM CATEGORIE')->fetchColumn();
    }

    /**
     * Une catégorie par son identifiant, ou null si elle n'existe pas.
     */
    public function trouverParId(int $id): ?array
    {
        $requete = $this->pdo->prepare(
            'SELECT CATEGORIE.id,
                    CATEGORIE.libelle,
                    CATEGORIE.slug,
                    CATEGORIE.description,
                    CATEGORIE.parent_id,
                    (SELECT COUNT(*) FROM PRODUIT WHERE PRODUIT.categorie_id = CATEGORIE.id) AS nb_produits
               FROM CATEGORIE
              WHERE CATEGORIE.id = :id'
        );
        $requete->bindValue(':id', $id, PDO::PARAM_INT);
        $requete->execute();

        $ligne = $requete->fetch();

        return $ligne === false ? null : $this->formater($ligne);
    }

    /** Un slug est-il déjà utilisé ? */
    public function slugExiste(string $slug): bool
    {
        $requete = $this->pdo->prepare('SELECT COUNT(*) FROM CATEGORIE WHERE slug = :slug');
        $requete->bindValue(':slug', $slug, PDO::PARAM_STR);
        $requete->execute();

        return (int) $requete->fetchColumn() > 0;
    }

    /**
     * Un libellé est-il déjà utilisé par une autre catégorie ?
     * La collation utf8mb4_unicode_ci ignore la casse et les accents.
     */
    public function libelleExiste(string $libelle, ?int $ignorerId = null): bool
    {
        $requete = $this->pdo->prepare(
            'SELECT COUNT(*) FROM CATEGORIE WHERE libelle = :libelle AND id <> :ignorer'
        );
        $requete->bindValue(':libelle', $libelle, PDO::PARAM_STR);
        $requete->bindValue(':ignorer', $ignorerId ?? 0, PDO::PARAM_INT);
        $requete->execute();

        return (int) $requete->fetchColumn() > 0;
    }

    /**
     * Crée une catégorie racine. Renvoie son identifiant.
     */
    public function creer(string $libelle, string $slug, ?string $description): int
    {
        $requete = $this->pdo->prepare(
            'INSERT INTO CATEGORIE (libelle, slug, description)
             VALUES (:libelle, :slug, :description)'
        );
        $requete->bindValue(':libelle', $libelle, PDO::PARAM_STR);
        $requete->bindValue(':slug', $slug, PDO::PARAM_STR);
        $requete->bindValue(':description', $description, $description === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $requete->execute();

        return (int) $this->pdo->lastInsertId();
    }

    /**
     * Modifie le libellé et la description. Le slug reste inchangé : il entre
     * dans l'adresse /categorie/:slug, qu'un changement casserait.
     */
    public function modifier(int $id, string $libelle, ?string $description): void
    {
        $requete = $this->pdo->prepare(
            'UPDATE CATEGORIE SET libelle = :libelle, description = :description WHERE id = :id'
        );
        $requete->bindValue(':libelle', $libelle, PDO::PARAM_STR);
        $requete->bindValue(':description', $description, $description === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $requete->bindValue(':id', $id, PDO::PARAM_INT);
        $requete->execute();
    }

    /** Nombre de sous-catégories directes. */
    public function compterEnfants(int $id): int
    {
        $requete = $this->pdo->prepare('SELECT COUNT(*) FROM CATEGORIE WHERE parent_id = :id');
        $requete->bindValue(':id', $id, PDO::PARAM_INT);
        $requete->execute();

        return (int) $requete->fetchColumn();
    }

    /** Nombre de produits rattachés à la catégorie. */
    public function compterProduits(int $id): int
    {
        $requete = $this->pdo->prepare('SELECT COUNT(*) FROM PRODUIT WHERE categorie_id = :id');
        $requete->bindValue(':id', $id, PDO::PARAM_INT);
        $requete->execute();

        return (int) $requete->fetchColumn();
    }

    /**
     * Supprime une catégorie dans une seule transaction.
     *
     * Si $cibleId n'est pas null, les produits de la catégorie lui sont
     * réaffectés. Les produits qui la citaient en sous-catégorie perdent cette
     * référence. Les règles (blocage, choix de la cible) sont décidées par le
     * contrôleur : ici, on exécute.
     */
    public function supprimer(int $id, ?int $cibleId): void
    {
        $this->pdo->beginTransaction();

        try {
            if ($cibleId !== null) {
                $requete = $this->pdo->prepare(
                    'UPDATE PRODUIT SET categorie_id = :cible WHERE categorie_id = :id'
                );
                $requete->bindValue(':cible', $cibleId, PDO::PARAM_INT);
                $requete->bindValue(':id', $id, PDO::PARAM_INT);
                $requete->execute();
            }

            $requete = $this->pdo->prepare(
                'UPDATE PRODUIT SET sous_categorie_id = NULL WHERE sous_categorie_id = :id'
            );
            $requete->bindValue(':id', $id, PDO::PARAM_INT);
            $requete->execute();

            $requete = $this->pdo->prepare('DELETE FROM CATEGORIE WHERE id = :id');
            $requete->bindValue(':id', $id, PDO::PARAM_INT);
            $requete->execute();

            $this->pdo->commit();
        } catch (Throwable $erreur) {
            $this->pdo->rollBack();
            throw $erreur;
        }
    }

    /**
     * Convertit une ligne de la base : identifiants en entiers, pas en chaînes.
     */
    private function formater(array $ligne): array
    {
        $formatee = [
            'id'          => (int) $ligne['id'],
            'libelle'     => $ligne['libelle'],
            'slug'        => $ligne['slug'],
            'description' => $ligne['description'],
            'parent_id'   => $ligne['parent_id'] === null ? null : (int) $ligne['parent_id'],
        ];

        if (array_key_exists('nb_produits', $ligne)) {
            $formatee['nb_produits'] = (int) $ligne['nb_produits'];
        }

        return $formatee;
    }
}
