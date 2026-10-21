---
trigger: glob
globs: back/**/*.php
---

# Architecture Backend PHP & API REST

- **Standards de code** :
  - Déclarer systématiquement `declare(strict_types=1);` dès la première ligne après `<?php`.
  - Respecter l'espace de noms `namespace App\...` correspondant à l'arborescence `back/src/`.
  - Pas de HTML : l'API produit exclusivement du JSON structuré via `App\Core\Response::json($donnees, $codeStatut)`.

- **Modèle (`back/src/Model/`)** :
  - Reçoit l'instance `PDO` par injection dans son constructeur.
  - Exécute les requêtes SQL et renvoie des tableaux associatifs (`fetchAll()`, `fetch()`).
  - Utilise obligatoirement des requêtes préparées (`$this->pdo->prepare(...)`) avec `bindValue(..., PDO::PARAM_...)` pour toute valeur provenant de l'extérieur.
  - Ne contient aucune logique métier ni décision HTTP.

- **Contrôleur (`back/src/Controller/`)** :
  - Reçoit les dépendances (modèles, configuration) dans son constructeur.
  - Chaque méthode d'action prend un argument `App\Core\Request $requete: void`.
  - **Validation & Listes Blanches** : Pour les colonnes de tri (`ORDER BY`) ou les filtres, définir une constante de classe `private const` contenant la liste blanche des valeurs autorisées. Ne jamais insérer de chaîne non validée dans une requête SQL.
  - **Gestion des cookies & session** :
    - Configurer les cookies avec `httponly => true`, `secure => true`, `samesite => 'Lax'`, et le chemin de l'application.
    - Toujours renvoyer dans la réponse JSON les réglages effectifs appliqués (tri, pagination, session) pour dispenser le frontend de lire des cookies `HttpOnly`.

- **Déclaration des routes** :
  - Ajouter la correspondance dans `back/src/routes.php` : `'METHOD /api/chemin' => [Controleur::class, 'methode']`.
  - Instancier le contrôleur dans le tableau `$controleurs` de `back/index.php`.
