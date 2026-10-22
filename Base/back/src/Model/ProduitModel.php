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

    // -----------------------------------------------------------------------
    // Gestion des produits par l'administrateur
    // -----------------------------------------------------------------------

    /** Colonnes écrites par le back-office (le slug est fixé à la création). */
    private const COLONNES_ECRITURE = [
        'reference', 'nom', 'marque', 'format', 'description', 'prix',
        'prix_unitaire', 'unite_prix', 'badge', 'stock', 'seuil_alerte', 'categorie_id',
    ];

    /** Colonnes lues par le back-office. */
    private const COLONNES_ADMIN = 'PRODUIT.id, PRODUIT.reference, PRODUIT.slug, PRODUIT.nom,
            PRODUIT.marque, PRODUIT.format, PRODUIT.description, PRODUIT.prix,
            PRODUIT.prix_unitaire, PRODUIT.unite_prix, PRODUIT.badge,
            PRODUIT.stock, PRODUIT.seuil_alerte, PRODUIT.categorie_id,
            CATEGORIE.libelle AS categorie';

    /**
     * Tous les produits, avec leur catégorie et leurs images.
     *
     * @return list<array<string, mixed>>
     */
    public function listerAdmin(): array
    {
        $sql = 'SELECT ' . self::COLONNES_ADMIN . '
                  FROM PRODUIT
            INNER JOIN CATEGORIE ON CATEGORIE.id = PRODUIT.categorie_id
              ORDER BY PRODUIT.id ASC';

        $images = $this->imagesParProduit();

        return array_map(
            fn (array $ligne): array => $this->formaterAdmin($ligne, $images[(int) $ligne['id']] ?? []),
            $this->pdo->query($sql)->fetchAll()
        );
    }

    /** Un produit du back-office, ou null s'il n'existe pas. */
    public function trouverAdminParId(int $id): ?array
    {
        $requete = $this->pdo->prepare(
            'SELECT ' . self::COLONNES_ADMIN . '
               FROM PRODUIT
         INNER JOIN CATEGORIE ON CATEGORIE.id = PRODUIT.categorie_id
              WHERE PRODUIT.id = :id'
        );
        $requete->bindValue(':id', $id, PDO::PARAM_INT);
        $requete->execute();

        $ligne = $requete->fetch();

        if ($ligne === false) {
            return null;
        }

        return $this->formaterAdmin($ligne, $this->imagesParProduit($id)[$id] ?? []);
    }

    /** La référence est-elle déjà prise par un autre produit ? */
    public function referenceExiste(string $reference, ?int $ignorerId = null): bool
    {
        $requete = $this->pdo->prepare(
            'SELECT COUNT(*) FROM PRODUIT WHERE reference = :reference AND id <> :ignorer'
        );
        $requete->bindValue(':reference', $reference, PDO::PARAM_STR);
        $requete->bindValue(':ignorer', $ignorerId ?? 0, PDO::PARAM_INT);
        $requete->execute();

        return (int) $requete->fetchColumn() > 0;
    }

    /** Le slug est-il déjà utilisé par un autre produit ? */
    public function slugExiste(string $slug, ?int $ignorerId = null): bool
    {
        $requete = $this->pdo->prepare(
            'SELECT COUNT(*) FROM PRODUIT WHERE slug = :slug AND id <> :ignorer'
        );
        $requete->bindValue(':slug', $slug, PDO::PARAM_STR);
        $requete->bindValue(':ignorer', $ignorerId ?? 0, PDO::PARAM_INT);
        $requete->execute();

        return (int) $requete->fetchColumn() > 0;
    }

    /**
     * Crée un produit. Renvoie son identifiant.
     *
     * @param array<string, mixed> $donnees Valeurs validées par le contrôleur.
     */
    public function creer(array $donnees): int
    {
        $requete = $this->pdo->prepare(
            'INSERT INTO PRODUIT
                (reference, slug, nom, marque, format, description, prix, prix_unitaire,
                 unite_prix, badge, stock, seuil_alerte, categorie_id)
             VALUES
                (:reference, :slug, :nom, :marque, :format, :description, :prix, :prix_unitaire,
                 :unite_prix, :badge, :stock, :seuil_alerte, :categorie_id)'
        );
        $this->lier($requete, $donnees, [...self::COLONNES_ECRITURE, 'slug']);
        $requete->execute();

        return (int) $this->pdo->lastInsertId();
    }

    /**
     * Modifie un produit. Le slug n'est pas modifié : il entre dans l'adresse publique.
     *
     * @param array<string, mixed> $donnees Valeurs validées par le contrôleur.
     */
    public function modifier(int $id, array $donnees): void
    {
        $requete = $this->pdo->prepare(
            'UPDATE PRODUIT SET
                reference = :reference, nom = :nom, marque = :marque, format = :format,
                description = :description, prix = :prix, prix_unitaire = :prix_unitaire,
                unite_prix = :unite_prix, badge = :badge, stock = :stock,
                seuil_alerte = :seuil_alerte, categorie_id = :categorie_id
              WHERE id = :id'
        );
        $this->lier($requete, $donnees, self::COLONNES_ECRITURE);
        $requete->bindValue(':id', $id, PDO::PARAM_INT);
        $requete->execute();
    }

    /**
     * Supprime un produit et sa galerie dans une seule transaction.
     *
     * Renvoie les chemins des images supprimées, pour que le contrôleur
     * efface les fichiers correspondants.
     *
     * @return list<string>
     */
    public function supprimer(int $id): array
    {
        $this->pdo->beginTransaction();

        try {
            $chemins = array_column($this->imagesParProduit($id)[$id] ?? [], 'chemin');

            $requete = $this->pdo->prepare('DELETE FROM GALERIE WHERE produit_id = :id');
            $requete->bindValue(':id', $id, PDO::PARAM_INT);
            $requete->execute();

            $requete = $this->pdo->prepare('DELETE FROM PRODUIT WHERE id = :id');
            $requete->bindValue(':id', $id, PDO::PARAM_INT);
            $requete->execute();

            $this->pdo->commit();

            return $chemins;
        } catch (\Throwable $erreur) {
            $this->pdo->rollBack();
            throw $erreur;
        }
    }

    /** Nombre d'images de la galerie d'un produit. */
    public function compterImages(int $produitId): int
    {
        $requete = $this->pdo->prepare('SELECT COUNT(*) FROM GALERIE WHERE produit_id = :produit');
        $requete->bindValue(':produit', $produitId, PDO::PARAM_INT);
        $requete->execute();

        return (int) $requete->fetchColumn();
    }

    /** Ajoute une image à la galerie. Renvoie son identifiant. */
    public function ajouterImage(int $produitId, string $chemin, ?string $texteAlternatif, int $ordre): int
    {
        $requete = $this->pdo->prepare(
            'INSERT INTO GALERIE (chemin, produit_id, ordre, texte_alternatif)
             VALUES (:chemin, :produit, :ordre, :alternatif)'
        );
        $requete->bindValue(':chemin', $chemin, PDO::PARAM_STR);
        $requete->bindValue(':produit', $produitId, PDO::PARAM_INT);
        $requete->bindValue(':ordre', $ordre, PDO::PARAM_INT);
        $requete->bindValue(':alternatif', $texteAlternatif, $texteAlternatif === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $requete->execute();

        return (int) $this->pdo->lastInsertId();
    }

    /** Une image de galerie par son identifiant, ou null. */
    public function trouverImage(int $imageId): ?array
    {
        $requete = $this->pdo->prepare('SELECT id, produit_id, chemin FROM GALERIE WHERE id = :id');
        $requete->bindValue(':id', $imageId, PDO::PARAM_INT);
        $requete->execute();

        $ligne = $requete->fetch();

        if ($ligne === false) {
            return null;
        }

        return [
            'id'         => (int) $ligne['id'],
            'produit_id' => (int) $ligne['produit_id'],
            'chemin'     => $ligne['chemin'],
        ];
    }

    /** Supprime une image de la galerie (le fichier est effacé par le contrôleur). */
    public function supprimerImage(int $imageId): void
    {
        $requete = $this->pdo->prepare('DELETE FROM GALERIE WHERE id = :id');
        $requete->bindValue(':id', $imageId, PDO::PARAM_INT);
        $requete->execute();
    }

    /**
     * Images de la galerie, groupées par identifiant de produit.
     *
     * @return array<int, list<array{id: int, chemin: string, texte_alternatif: ?string}>>
     */
    private function imagesParProduit(?int $produitId = null): array
    {
        $sql = 'SELECT id, produit_id, chemin, texte_alternatif FROM GALERIE';

        if ($produitId !== null) {
            $sql .= ' WHERE produit_id = :produit';
        }

        $sql .= ' ORDER BY ordre ASC, id ASC';

        $requete = $this->pdo->prepare($sql);

        if ($produitId !== null) {
            $requete->bindValue(':produit', $produitId, PDO::PARAM_INT);
        }

        $requete->execute();

        $groupes = [];

        foreach ($requete->fetchAll() as $image) {
            $groupes[(int) $image['produit_id']][] = [
                'id'               => (int) $image['id'],
                'chemin'           => $image['chemin'],
                'texte_alternatif' => $image['texte_alternatif'],
            ];
        }

        return $groupes;
    }

    /** Convertit une ligne du back-office : nombres en entiers, images incluses. */
    private function formaterAdmin(array $ligne, array $images): array
    {
        return [
            'id'            => (int) $ligne['id'],
            'reference'     => $ligne['reference'],
            'slug'          => $ligne['slug'],
            'nom'           => $ligne['nom'],
            'marque'        => $ligne['marque'],
            'format'        => $ligne['format'],
            'description'   => $ligne['description'],
            // Les DECIMAL restent en texte, comme dans le reste de l'API.
            'prix'          => $ligne['prix'],
            'prix_unitaire' => $ligne['prix_unitaire'],
            'unite_prix'    => $ligne['unite_prix'],
            'badge'         => $ligne['badge'],
            'stock'         => (int) $ligne['stock'],
            'seuil_alerte'  => (int) $ligne['seuil_alerte'],
            'categorie_id'  => (int) $ligne['categorie_id'],
            'categorie'     => $ligne['categorie'],
            'images'        => $images,
        ];
    }

    /**
     * Lie les valeurs demandées. PDO exige que chaque paramètre de la requête
     * soit lié ; $cles doit donc correspondre exactement aux colonnes de la requête.
     *
     * @param array<string, mixed> $donnees
     * @param list<string>         $cles
     */
    private function lier(\PDOStatement $requete, array $donnees, array $cles): void
    {
        foreach ($cles as $cle) {
            $valeur = $donnees[$cle] ?? null;

            $type = match (true) {
                $valeur === null => PDO::PARAM_NULL,
                is_int($valeur)  => PDO::PARAM_INT,
                default          => PDO::PARAM_STR,
            };

            $requete->bindValue(':' . $cle, $valeur, $type);
        }
    }
}
