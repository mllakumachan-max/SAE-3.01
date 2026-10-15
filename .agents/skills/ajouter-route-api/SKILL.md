---
name: ajouter-route-api
description: Ajoute une route à l'API PHP (Modèle, Contrôleur, routes.php) et son point d'accès côté frontend (front/src/data/).
---

# Ajouter une route à l'API PHP

Ce skill décrit les étapes pour exposer et consommer un nouveau point de terminaison d'API REST.

## 1. Couche Données / Modèle (`back/src/Model/`)

Ajouter la méthode dans le modèle approprié (ex: `ProduitModel.php` ou `FilmModel.php`) :

```php
public function trouverParId(int $id): ?array
{
    $requete = $this->pdo->prepare(
        'SELECT id, titre, annee, note_moyenne, duree_minutes 
           FROM film 
          WHERE id = :id'
    );
    $requete->bindValue(':id', $id, PDO::PARAM_INT);
    $requete->execute();

    $resultat = $requete->fetch();
    return $resultat ?: null;
}
```

## 2. Couche Contrôleur (`back/src/Controller/`)

Ajouter l'action dans le contrôleur avec validation stricte :

```php
public function detail(Request $requete): void
{
    $id = (int) ($requete->parametre('id') ?? 0);

    if ($id <= 0) {
        Response::json(['erreur' => 'Identifiant de produit invalide.'], 400);
        return;
    }

    $element = $this->modele->trouverParId($id);

    if ($element === null) {
        Response::json(['erreur' => 'Produit non trouvé.'], 404);
        return;
    }

    Response::json($element);
}
```

## 3. Déclaration de la Route (`back/src/routes.php`)

Ajouter l'association méthode HTTP + chemin vers le contrôleur :

```php
return [
    'GET /api/films'      => [CatalogueController::class, 'index'],
    'GET /api/film'       => [CatalogueController::class, 'detail'],
    // ...
];
```
*(Si un nouveau contrôleur a été créé, veiller à l'instancier dans le tableau `$controleurs` de `back/index.php`).*

## 4. Consommation côté Frontend (`front/src/data/`)

Dans le module correspondant (ex: `front/src/data/produit.js`) :

```javascript
import { getRequest } from "../lib/api-request.js";

let ProduitData = {};

ProduitData.fetchDetail = async function (id) {
  return getRequest(`film?id=${encodeURIComponent(id)}`);
};

export { ProduitData };
```
