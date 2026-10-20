---
name: ajouter-route-api
description: Ajoute un point d'accès à l'API PHP (modèle, contrôleur, routes.php) puis son appel depuis front/src/data/. À utiliser quand une page a besoin d'une nouvelle donnée du serveur.
---

# Ajouter une route à l'API

Exemple suivi tout au long : une route qui renvoie **un article** à partir de son identifiant, `GET /api/article?id=3`.

## Étape 1 : Écrire la requête (`back/src/Model/`)

Le modèle parle uniquement à la base de données. Il renvoie un tableau, ou `null` si rien n'est trouvé.

```php
public function trouverParId(int $id): ?array
{
    $requete = $this->pdo->prepare('SELECT id, titre FROM ARTICLE WHERE id = :id');
    $requete->bindValue(':id', $id, PDO::PARAM_INT);
    $requete->execute();

    return $requete->fetch() ?: null;
}
```

Règle : toujours `prepare()` et `bindValue()`. Ne jamais coller une variable dans la chaîne SQL.

## Étape 2 : Vérifier et répondre (`back/src/Controller/`)

Le contrôleur valide la donnée reçue, appelle le modèle, puis répond.

```php
public function detail(Request $requete): void
{
    $id = (int) ($requete->parametre('id') ?? 0);

    if ($id <= 0) {
        Response::json(['erreur' => 'Identifiant invalide.'], 400);
        return;
    }

    $article = $this->modele->trouverParId($id);

    if ($article === null) {
        Response::json(['erreur' => 'Article introuvable.'], 404);
        return;
    }

    Response::json($article);
}
```

Codes utilisés : `200` réussite, `400` donnée invalide, `404` élément absent.

## Étape 3 : Déclarer la route (`back/src/routes.php`)

```php
'GET /api/article' => [CatalogueController::class, 'detail'],
```

Si le contrôleur est nouveau, l'ajouter aussi au tableau `$controleurs` de `back/index.php`.

## Étape 4 : Appeler depuis le front (`front/src/data/`)

Ajouter la méthode au module de la ressource, ici `article.js` :

```javascript
import { getRequest } from "../lib/api-request.js";

let ArticleData = {};

ArticleData.fetchDetail = function (id) {
  return getRequest(`article?id=${encodeURIComponent(id)}`);
};

export { ArticleData };
```

Une page appelle `ArticleData`, jamais `fetch()` directement.

## Étape 5 : Vérifier

1. Ouvrir `/api/article?id=3` dans le navigateur : la réponse est du JSON.
2. Tester `/api/article?id=999` : la réponse est `404`.
3. Lancer `node .agents/skills/verifier-projet/scripts/check-projet.js .`