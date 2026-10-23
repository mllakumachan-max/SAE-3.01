<?php

declare(strict_types=1);

namespace App\Controller;

use App\Core\Request;
use App\Core\Response;
use App\Model\UtilisateurModel;
use PDOException;

final class AuthController
{
    private UtilisateurModel $utilisateurs;

    public function __construct(UtilisateurModel $utilisateurs)
    {
        $this->utilisateurs = $utilisateurs;
    }

    public function login(Request $requete): void
    {
        $corps = $requete->corps();
        $login = (string) ($corps['login'] ?? '');
        $mdp   = (string) ($corps['mdp']   ?? '');

        $compte = $this->utilisateurs->trouverParLogin($login);

        if ($compte === null || !password_verify($mdp, (string) $compte['mot_de_passe'])) {
            Response::erreur('Identifiants invalides', 401);
        }

        session_regenerate_id(true);

        $_SESSION['utilisateur'] = $compte['login'];
        $_SESSION['role']        = $compte['role'];

        Response::json(['connecte' => true, 'role' => $compte['role']]);
    }

    public function register(Request $requete): void
    {
        $corps = $requete->corps();
        $login = trim((string) ($corps['login'] ?? ''));
        $mdp   = (string) ($corps['mdp'] ?? '');
        $mdpConfirmation = (string) ($corps['mdp_confirmation'] ?? ($corps['mdpConfirmation'] ?? ''));

        if ($login === '' || !filter_var($login, FILTER_VALIDATE_EMAIL)) {
            Response::erreur('Adresse email invalide', 422);
        }
        if (strlen($mdp) < 8) {
            Response::erreur('Le mot de passe doit comporter au moins 8 caractères', 422);
        }
        if ($mdp !== $mdpConfirmation) {
            Response::erreur('Les mots de passe ne correspondent pas', 422);
        }

        if ($this->utilisateurs->trouverParLogin($login) !== null) {
            Response::erreur('Un compte existe déjà avec cet email', 409);
        }

        $hash = password_hash($mdp, PASSWORD_BCRYPT);

        try {
            $this->utilisateurs->creer($login, $hash, 'user');
        } catch (PDOException $e) {
            Response::erreur('Impossible de créer le compte', 500);
        }

        session_regenerate_id(true);
        $_SESSION['utilisateur'] = $login;
        $_SESSION['role']        = 'user';

        Response::json(['connecte' => true, 'role' => 'user'], 201);
    }

    public function logout(): void
    {
        $_SESSION = [];

        setcookie(session_name(), '', [
            'expires' => time() - 3600,
            'path'    => session_get_cookie_params()['path'],
        ]);

        session_destroy();

        Response::json(['connecte' => false]);
    }
}
