# SAÉ 3.01 — Site Action Click & Collect

Application de Click & Collect : catalogue de produits, navigation par catégories, fiche produit, panier, authentification et administration. Projet de la SAÉ 3.01.

## Stack

| Domaine | Technologie |
|---|---|
| Base de données | MariaDB (InnoDB, utf8mb4), schéma `Base/sql/sae301.sql` |
| Back-end | PHP 8+ (PDO, `strict_types`), API REST en JSON uniquement |
| Front-end | JavaScript ES modules, sans framework : routeur, pages, composants |
| Build | Vite 8 |
| Style | Tailwind CSS v4, thème clair et sombre |
| Tests | Playwright |
| Maquettes | Figma |

## Arborescence

```
.agents/                 règles et skills pour l'assistant de développement
AGENTS.md                conventions du projet
README.md                ce fichier
Base/                    dossier déployé sur le serveur
├── .htaccess            /api/… vers back/index.php, le reste vers front/dist/
├── sql/
│   ├── sae301.sql       schéma et données
│   └── migrations/      modifications successives du schéma (datées)
├── back/
│   ├── config/config.php
│   ├── index.php        point d'entrée de l'API
│   └── src/
│       ├── Core/        Request, Response, Router, Database
│       ├── Controller/  un contrôleur par ressource
│       ├── Model/       requêtes SQL (PDO)
│       └── routes.php   table des routes de l'API
└── front/
    ├── vite.config.js   BASE : chemin du projet
    ├── playwright.config.js
    ├── src/
    │   ├── main.js      déclaration des routes et des layouts
    │   ├── layouts/     structures de page
    │   ├── pages/       une page par route (page.js + template.html)
    │   ├── ui/          composants réutilisables
    │   ├── data/        appels à l'API, un module par ressource
    │   └── lib/         routeur, requêtes, utilitaires, panier, thème
    └── tests/           tests Playwright, un fichier par user story
```

## Installation

1. Importer `Base/sql/sae301.sql` dans la base MariaDB.
2. Renseigner les identifiants de la base dans `Base/back/config/config.php`.
3. Donner le même chemin à `BASE` dans `Base/front/vite.config.js` et à `'chemin'` dans `config.php` (par exemple `/~votre_login/SAE-3.01/Base/`). Les deux valeurs doivent être identiques, sinon les cookies et le proxy ne fonctionnent pas.
4. Installer les dépendances du front :

```bash
cd Base/front
npm install
```

## Commandes

Depuis `Base/front/` :

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement Vite, avec relais vers l'API |
| `npm run build` | Construit `dist/` pour le déploiement |
| `npm test` | Lance toute la suite Playwright |
| `npm run test:dec-a` | Lance les tests de la story DEC-a (idem `dec-b`, `dec-c`, `gof-b`) |
| `npm run test:report` | Ouvre le dernier rapport Playwright |

Pour une autre story, lancer directement `npx playwright test tests/<fichier>.spec.js`.

## Tests

Chaque user story a son fichier dans `Base/front/tests/`, nommé d'après son code (`dec-a-categories.spec.js`). Il décrit la story, puis contient un test par critère d'acceptation (« CA — … ») et par point du Definition of Done (« DoD — … »). La méthode est décrite dans `.agents/skills/ecrire-tests-playwright/SKILL.md`.

Les tests comparent l'écran à la réponse de l'API. Les comptes de test sont définis dans `Base/front/tests/constantes.js`. L'adresse testée est lue dans `constantes.js` ; la variable `SAE301_BASE_URL` permet de la remplacer, par exemple pour tester le site déployé.

## Déploiement

1. Dans `Base/front/`, exécuter `npm run build`.
2. Copier le contenu de `Base/` sur l'espace web : `.htaccess`, `back/` et `front/dist/`.
3. Vérifier que `front/dist/index.html` répond à toutes les adresses non-API, pour que le routeur du front gère les pages.

## Routes

Front (`main.js`) :

| Adresse | Page |
|---|---|
| `/` | Catalogue |
| `/categorie/:slug` | Catalogue filtré par catégorie |
| `/produit/:slug` | Fiche produit |
| `/admin` | Administration |
| `/admin/categories` | Gestion des catégories |
| `*` | Page 404 |

API (`back/src/routes.php`) :

| Méthode et chemin | Effet |
|---|---|
| `GET /api/produits` | Liste des produits |
| `GET /api/produits/:slug` | Détail d'un produit |
| `GET /api/categories` | Liste des catégories, avec le nombre de produits |
| `POST /api/login` | Connexion |
| `POST /api/logout` | Déconnexion |
| `GET /api/admin/categories` | Catégories, réservé à l'administrateur |
| `GET /api/admin/stats` | Statistiques, réservé à l'administrateur |

## Conventions

Les conventions complètes sont dans `AGENTS.md`. À retenir : chaque page suit le découpage M (état), C (traitements), V (affichage) ; un composant ne prend aucune décision et n'appelle jamais l'API ; les données passent par `front/src/data/` ; les requêtes SQL n'acceptent aucune donnée utilisateur dans les tris ou les filtres dynamiques, qui passent par des listes blanches.

## Maquettes

Les wireframes Figma sont à consulter avant de coder une page : lien dans `AGENTS.md`, section Figma.