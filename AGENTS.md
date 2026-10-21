# AGENTS.md — SAÉ 3.01 | Click & Collect

Application de Click & Collect : catalogue, filtres, pagination, fiche produit, panier, authentification et administration. Tu es développeur full-stack sur ce projet.

## 1. Stack

| Domaine   | Ressource                              | Rôle                               |
|-----------|----------------------------------------|------------------------------------|
| Base      | MariaDB (InnoDB, utf8mb4)              | Données, schéma `sae301.sql`       |
| Back      | PHP 8+ (PDO, `strict_types`)           | API REST, JSON uniquement          |
| Front     | JavaScript ES modules (sans framework) | SPA : routeur, pages, composants   |
| Build     | Vite 8                                 | Dev, build, proxy vers l'API       |
| Style     | Tailwind CSS v4 (`@tailwindcss/vite`)  | Classes utilitaires, thème sombre  |
| Maquettes | Figma                                  | Wireframes et tokens de couleur    |

Règles détaillées : `.agents/rules/`. Procédures : `.agents/skills/`.

## 2. Arborescence

```
SAE-3.01-US-DEC-a/
├── sae301.sql          -> Schéma et données MariaDB
├── Base/               -> Dossier déployé sur le serveur
│   ├── .htaccess       -> /api/... vers back/index.php, le reste vers front/dist/
│   └── back/           -> API PHP (config/, index.php, src/)
└── front/              -> Sources Vite (front/dist/ est copié dans Base/)
    └── src/            -> main.js, global.css, icons.html, layouts/, pages/, ui/, data/, lib/, images/
```

## 3. Frontend

### A. Librairies (`front/src/lib/`)

- `router.js` : routes, layouts, navigation sans rechargement. Liens : `<a href="/admin" data-link>`, sans le chemin du projet.
- `api-request.js` : `getRequest`, `postRequest`, `ErreurApi` (porte le statut HTTP).
- `utils.js` : `genericRenderer` (remplace `{{cle}}` en échappant), `htmlToFragment`.
- `format.js` : mise en forme (`formaterDuree`, `formaterNote`, `teinteDepuisTexte`).
- `images.js` : `urlImage(chemin)` convertit un chemin de la base en adresse réelle. Jamais de chemin d'image en dur.
- `theme.js` : `basculerTheme()` pose `theme-dark` sur `<html>`, choix mémorisé en `localStorage`.

### B. Layouts (`front/src/layouts/`)

Enveloppe commune d'un groupe de pages : `template.html` (slots `header` et sans nom pour la page), `layout.js` (remplit `header`). Choisi par le plus long préfixe de `main.js`.

### C. Pages en MVC local (`pages/<nom>/page.js`)

- **M** : état de la page (données API, message, saisie en cours).
- **C** : traitements, appels à `data/`, gestionnaires `handler_<action>`. `C.init()` est appelé par le routeur.
- **V** : construit le `DocumentFragment` depuis `M`. `V.rafraichir()` reconstruit la page à chaque changement d'état.

### D. Composants (`ui/<nom>/`)

- `template.html` : HTML, classes Tailwind, marqueurs `{{cle}}` et `<slot name="…">`.
- `index.js` : expose `html(data)` et `dom(data, actions)`. Les actions sont des callbacks (`actions.surAjouterPanier(id)`).
- Un composant ne prend aucune décision métier et n'appelle jamais l'API.

### E. Tailwind CSS v4

- Classes écrites dynamiquement : `"text-" + couleur`, jamais `"text-red-700"`.
- Variables sémantiques (`bg-surface-default`, `text-text-primary`) définies dans `@theme` de `global.css`.
- Style dynamique : `@utility` dans `global.css`, ou dictionnaire d'états (`CLASSES_STATUT`).
- Thème sombre : préfixe `dark:`, activé par `theme-dark` sur `<html>`.

### F. Figma

- Wireframes (à consulter avant de coder une page ou un composant) : https://www.figma.com/design/LZ0Y4q1dDu0P1iOr59UFWb/SA%C3%89-3.01---Ana%C3%AFs-Ribatet?node-id=31-5663&p=f&t=HyP0LBW0U1f51a9k-0
- Les primitives `--color-palette-*` de `global.css` reprennent les tokens Figma. Une nouvelle couleur se crée dans Figma, puis s'ajoute à `@theme`.

## 4. Backend

### A. Couches

- **Core/** : `Response::json($donnees, $code)`, `Router`, `Database::connexion()` (PDO unique, mode exception).
- **Model/** : reçoit `PDO`, `prepare()` + `bindValue(..., PDO::PARAM_...)`, renvoie des tableaux associatifs.
- **Controller/** : valide, pose les cookies (`httponly`, `secure`, `samesite => 'Lax'`), gère la session, renvoie `Response::json()`.

### B. Sécurité et routes

- Tout `ORDER BY` ou filtre dynamique passe par une constante `private const` de liste blanche (`TRIS`, `PAR_PAGE_AUTORISES`). Aucune donnée utilisateur n'entre dans une chaîne SQL.
- Route : `'METHODE /api/chemin' => [Controleur::class, 'methode']` dans `routes.php`. Contrôleur : l'instancier dans `index.php`.
- Chaque fichier PHP commence par `declare(strict_types=1);`, puis respecte l'espace de noms `App\…`.

### C. Base de données (MariaDB)

Créée en important `sae301.sql` ; connexion dans `config/config.php`.

- Clés étrangères en `ON DELETE RESTRICT`. Les `DECIMAL` arrivent en texte : conversion dans `front/src/data/`.
- Conventions : InnoDB, utf8mb4, clés nommées (`uq_`, `idx_`, `fk_`). Skills : `creer-table-sql`, `modifier-table-sql`.

## 5. Commandes

- **Chemin du projet** : `BASE` dans `front/vite.config.js` et `'chemin'` dans `config.php` doivent être identiques (`/~ribatet1/SAE-3.01/Base/`).
- **Développement** : `cd front && npm install && npm run dev`. **Production** : `npm run build`, puis copier `front/dist/` dans `Base/`.
- **Contrôle** : `node .agents/skills/verifier-projet/scripts/check-projet.js .`