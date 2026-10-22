<?php

declare(strict_types=1);

namespace App\Model;

use PDO;

/**
 * Accès aux données des comptes utilisateurs.
 *
 * Cette couche ne contient aucune règle métier et ne décide de rien :
 * elle exécute les requêtes qu'on lui demande et renvoie des tableaux
 * associatifs.
 */
final class UtilisateurModel
{
    /** Connexion à la base, fournie à la construction. */
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * Un compte, cherché par son identifiant.
     *
     * Le mot de passe n'est pas renvoyé tel quel : seule son empreinte est
     * utilisée, et la comparaison se fait par password_verify.
     *
     * @return array<string, mixed>|null Le compte, ou null s'il n'existe pas.
     */
    public function trouverParLogin(string $login): ?array
    {
        $requetePreparee = $this->pdo->prepare(
            'SELECT id, login, mot_de_passe, role
               FROM UTILISATEUR
              WHERE login = :login'
        );

        $requetePreparee->bindValue(':login', $login, PDO::PARAM_STR);
        $requetePreparee->execute();

        $ligne = $requetePreparee->fetch();

        if ($ligne === false) {
            return null;
        }

        return [
            'id'           => (int) $ligne['id'],
            'login'        => $ligne['login'],
            'mot_de_passe' => $ligne['mot_de_passe'],
            'role'         => $ligne['role'],
        ];
    }
}
