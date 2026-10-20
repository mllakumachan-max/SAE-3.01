# SAÉ 3.01 | Intégrer/développer des interfaces au sein d’un SI — Click & Collect

Tu es un développeur Full-stack. L'objectif de la SAÉ 3.01 est de concevoir et développer une application web de **Click & Collect** (catalogue de produits/articles, filtres et pagination, consultation détaillée d'un produit, panier client, authentification/session et espace d'administration).

Le projet s'appuie sur une **API REST en PHP (3 couches)**, une **base MariaDB* et une **application frontend SPA (Single Page Application)** modulaire propulsée par **Vite** et **Tailwind CSS v4**.

---

## Architecture Générale

```
SAÉ 3.01/
├── sql/sae301.sql       -> Schéma MySQL et données initiales (InnoDB, utf8mb4)
├── base
│   ├── .htaccess            -> Route /api/... vers back/index.php, le reste vers front/dist/
│   └── back/                -> API PHP REST (ne renvoie STRICTEMENT que du JSON)
│       ├── config/config.php-> Configuration BDD et chemin du projet (cookies)
│       ├── src/
│       │   ├── Core/        -> Request, Response, Router, Database
│       │   ├── Controller/  -> Contrôleurs (validation, listes blanches, cookies)
│       │   ├── Model/       -> Modèles PDO (requêtes préparées, typage)
│       │   └── routes.php   -> Déclaration des routes HTTP -> [Contrôleur, méthode]
│       └── index.php        -> Point d'entrée unique, autoloader, session
└── front/               -> Sources du front (Vite + Tailwind CSS v4)
    ├── vite.config.js   -> Configuration BASE et proxy de développement vers l'API
    └── src/
        ├── main.js      -> Point d'entrée, déclaration des layouts et routes
        ├── global.css   -> Tailwind CSS v4, thème sombre, utilitaires CSS
        ├── icons.html   -> Sprite svg, icônes présentes sur le site web
        ├── layouts/     -> Layouts structurels (RootLayout avec <slot>)
        ├── pages/       -> Pages complètes avec architecture MVC LOCAL (M, C, V)
        ├── ui/          -> Composants réutilisables (template.html?raw + index.js)
        ├── data/        -> Couche d'accès à l'API (fetch, getRequest, postRequest)
        ├── images/      -> Images du site rassemblées
        └── lib/         -> router.js, api-request.js, utils.js, format.js, theme.js
```

---

## 1. Frontend : Organisation et Conventions
Utilisation des wireframes et variables Figma pour concevoir l'interface du site : https://www.figma.com/design/LZ0Y4q1dDu0P1iOr59UFWb/SA%C3%89-3.01---Ana%C3%AFs-Ribatet?node-id=31-5663&p=f&t=HyP0LBW0U1f51a9k-0

### A. Pages et MVC Local (`front/src/pages/<nom>/page.js`)
Chaque page dynamique est un module indépendant respectant le découpage **M / C / V local** :
- **`M` (Modèle local)** : Contient l'état réactif de la page (données de l'API, message d'alerte, valeurs de formulaire en cours de saisie).
- **`C` (Contrôleur local)** : Contient la logique d'action, les appels asynchrones à la couche `data/`, et les gestionnaires d'événements (`handler_<action>`). `C.init()` est la fonction d'initialisation appelée par le routeur.
- **`V` (Vue locale)** : Construit le `DocumentFragment` de la page à partir du modèle `M`.
  - Reconstruit intégralement la page lors d'un changement d'état via `V.rafraichir()`.
  - Remplace les `<slot name="...">` du template de page par les fragments des composants `ui/`.
- **Export** : Chaque page exporte une fonction d'entrée (ex: `export function CataloguePage() { return C.init(); }`).

### B. Composants d'Interface (`front/src/ui/<nom>/`)
Chaque composant se compose de :
- `template.html` : Structure HTML avec classes Tailwind. Contient des marqueurs `{{cle}}` pour le texte et des `<slot name="...">` pour les sous-composants.
- `index.js` :
  - Importe le template brut : `import template from "./template.html?raw";`.
  - `html(data)` : Produit la chaîne HTML via `genericRenderer(template, data)` (les valeurs sont automatiquement échappées).
  - `dom(data, actions)` : Convertit le HTML en `DocumentFragment` (via `htmlToFragment`), branche les écouteurs d'événements (`addEventListener`), et appelle les callbacks reçues dans `actions` (ex: `actions.surAjouterPanier(id)`).
  - **Règle absolue** : Les composants ne décident d'aucune règle métier et n'appellent jamais l'API directement.

### C. Utilisation Dynamique de Tailwind CSS v4
Toujours utiliser des variables sémantiques.

Pour gérer du **style dynamique** avec des variables :
1. **Variables CSS dynamiques** :
   Injecter la variable dans le HTML via `class="text- + variable; "` :
   ```html
   <div class="bg-accent text-white p-4">
   ```
2. **Utilitaires CSS personnalisés dans `front/src/global.css`** :
   Déclarer des `@utility` exploitant des variables CSS :
   ```css
   @utility badge-dynamique {
     background-color: var(--badge-bg, var(--color-zinc-100));
     color: var(--badge-text, var(--color-zinc-800));
   }
   ```
3. **Dictionnaire de correspondance (pour un ensemble défini d'états)** :
   Mapper les états ou variantes vers des classes complètes :
   ```javascript
   const CLASSES_STATUT = {
     disponible: "bg-emerald-100 text-emerald-800 border-emerald-300",
     rupture: "bg-rose-100 text-rose-800 border-rose-300",
     precommande: "bg-amber-100 text-amber-800 border-amber-300",
   };
   ```
4. **Thème sombre** :
   Géré par la classe `.theme-dark` posée sur `<html>`. Utiliser systématiquement le modificateur `dark:...` (ex: `bg-white dark:bg-zinc-950`).

---

## 2. Backend : Organisation et Sécurité (`back/`)

1. **3 Couches Strictes** :
  - `Core/` : Moteur de requêtes, réponses JSON, routeur et connexion PDO.
  - `Model/` : Reçoit `PDO`, prépare les requêtes avec `bindValue(..., PDO::PARAM_...)`, retourne des tableaux associatifs sans HTML.
  - `Controller/` : Reçoit `Request`, valide les paramètres, applique les cookies (`HttpOnly`, `SameSite=Lax`, `Secure`), gère la session, et renvoie la réponse via `Response::json($data, $code)`.
2. **Protection SQL et Listes Blanches** :
  - Toute clause de tri dynamique (`ORDER BY`) doit obligatoirement être validée par une liste blanche stricte définie dans une constante `private const` du contrôleur.
  - Aucune variable utilisateur n'est directement injectée dans une chaîne SQL.
3. **Table des Routes** :
  - Toute nouvelle route API est enregistrée dans `back/src/routes.php`.
  - Tout contrôleur nécessaire doit être instancié dans `back/index.php`.
4. **Table SQL** :
  - Toute nouvelle table ajoutée dans `sae301.sql`

---

## 3. Synchronisation & Commandes de Développement

- **Chemin du projet** :
  - `front/vite.config.js` -> `const BASE = "/~votre_login/Base/";`
  - `back/config/config.php` -> `'chemin' => '/~votre_login/Base/',`
  Ces deux valeurs doivent TOUJOURS correspondre au dossier de déploiement réel.
- **Lancer le serveur de développement Front** :
  ```bash
  cd front
  npm run dev
  ```
- **Compiler pour la production** :
  ```bash
  cd front
  npm run build
  ```
- **Contrôler la qualité et cohérence du projet** :
  ```bash
  node .agents/skills/verifier-projet/scripts/check-projet.js .
  ```