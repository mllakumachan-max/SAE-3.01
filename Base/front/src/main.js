import { Router } from "./lib/router.js";
import { RootLayout } from "./layouts/root/layout.js";
import { CataloguePage } from "./pages/catalogue/page.js";
import { ProduitPage } from "./pages/produit/page.js";
import { AdminPage } from "./pages/admin/page.js";
import { AdminCategoriesPage } from "./pages/admin-categories/page.js";
import { AdminProduitsPage } from "./pages/admin-produits/page.js";
// import { PanierPage } from "./pages/panier/page.js";
import { The404Page } from "./pages/404/page.js";
import icons from "./icons.html?raw";

// Les icônes sont des <symbol> déclarés une seule fois dans icons.html. Un
// <use href="#icon-sun"> ne les trouve que s'ils sont dans la page : on les y
// place donc avant tout affichage.
document.body.insertAdjacentHTML("afterbegin", icons);

// base : chemin du projet sur le serveur (BASE dans vite.config.js).
const router = new Router("app", { base: import.meta.env.BASE_URL });

router.addLayout("/", RootLayout);

router.addRoute("/", CataloguePage);
router.addRoute("/categorie/:slug", CataloguePage);
router.addRoute("/produit/:slug", ProduitPage);
// router.addRoute("/panier", PanierPage);

router.addRoute("/admin", AdminPage);
router.addRoute("/admin/categories", AdminCategoriesPage);
router.addRoute("/admin/produits", AdminProduitsPage);
// En dernier : toute adresse qui ne correspond à aucune route.
router.addRoute("*", The404Page);

document.addEventListener("admin:deconnexion-terminee", () => router.navigate("/admin"));
document.addEventListener("admin:session-change", (event) => {
	const connecte = event.detail === true;
	document.querySelectorAll('[data-zone="navigation-authentifie"]').forEach((zone) => {
		zone.hidden = !connecte;
	});
	document.querySelectorAll('[data-action="deconnexion"]').forEach((bouton) => {
		bouton.hidden = !connecte;
	});
});

// Démarrer le routeur
router.start();
