<?php

declare(strict_types=1);

namespace App\Model;

use PDO;

final class UtilisateurModel
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

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

    public function creer(string $login, string $motDePasseHash, string $role): void
    {
        $requetePreparee = $this->pdo->prepare(
            'INSERT INTO UTILISATEUR (login, mot_de_passe, role)
             VALUES (:login, :mot_de_passe, :role)'
        );

        $requetePreparee->bindValue(':login', $login, PDO::PARAM_STR);
        $requetePreparee->bindValue(':mot_de_passe', $motDePasseHash, PDO::PARAM_STR);
        $requetePreparee->bindValue(':role', $role, PDO::PARAM_STR);
        $requetePreparee->execute();
    }
}
