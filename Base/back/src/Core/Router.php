<?php

declare(strict_types=1);

namespace App\Core;

use RuntimeException;

/**
 * Associe une requête entrante au contrôleur chargé de la traiter.
 *
 * Les routes sont déclarées dans back/src/routes.php sous la forme :
 *     'GET /api/films' => [CatalogueController::class, 'index']
 */
final class Router
{
    /** Table des routes, telle que déclarée dans routes.php. */
    private array $routes;

    /** Instances de contrôleurs, indexées par nom de classe. */
    private array $controleurs;

    /**
     * @param array<string, array{0:string, 1:string}> $routes
     * @param array<string, object>                    $controleurs
     */
    public function __construct(array $routes, array $controleurs)
    {
        $this->routes      = $routes;
        $this->controleurs = $controleurs;
    }

    public function traiter(Request $requete): void
    {
        foreach ($this->routes as $declaration => $cible) {
            $declaration = self::normaliser($declaration);

            [$methodeHttp, $cheminRoute] = self::separer($declaration);

            // Une route sans paramètre se compare directement : c'est le cas
            // le plus fréquent, et le plus rapide.
            if (!str_contains($cheminRoute, ':')) {
                if ($methodeHttp !== $requete->methode() || $cheminRoute !== $requete->chemin()) {
                    continue;
                }
            } else {
                // Une route avec paramètre se compare à un motif : la route
                // « /api/produits/:slug » correspond à la requête
                // « /api/produits/couette-sans-housse-easy ».
                if ($methodeHttp !== $requete->methode()) {
                    continue;
                }

                $parametres = self::extraire($cheminRoute, $requete->chemin());

                if ($parametres === null) {
                    continue;
                }

                $requete->definirParametresUrl($parametres);
            }

            // $cible est le tableau déclaré dans routes.php :
            // à l'indice 0 le nom de la classe, à l'indice 1 celui de la méthode.
            $classe  = $cible[0];
            $methode = $cible[1];

            $controleur = $this->controleurs[$classe] ?? null;

            if ($controleur === null) {
                throw new RuntimeException(
                    "Le contrôleur {$classe} n'est pas enregistré dans back/index.php."
                );
            }

            // Le nom de la méthode est dans une variable, et PHP appelle la
            // méthode qui porte ce nom. Si $methode vaut 'index', la ligne
            // ci-dessous revient exactement à écrire $controleur->index($requete).
            // C'est ce qui permet à un routeur de fonctionner sans connaître à
            // l'avance les contrôleurs qu'il servira.
            $controleur->$methode($requete);
            return;
        }

        Response::erreur('Route inconnue : ' . $requete->signature(), 404);
    }

    /**
     * « GET   /api/films » et « GET /api/films » désignent la même route :
     * on réduit les espaces multiples pour permettre un alignement lisible
     * dans le fichier de déclaration.
     */
    private static function normaliser(string $declaration): string
    {
        return preg_replace('/\s+/', ' ', trim($declaration)) ?? $declaration;
    }

    /**
     * Sépare la déclaration en méthode et chemin : « GET /api/films ».
     *
     * @return array{0:string, 1:string}
     */
    private static function separer(string $declaration): array
    {
        $espaces = explode(' ', $declaration, 2);

        return [$espaces[0], $espaces[1] ?? '/'];
    }

    /**
     * Compare un chemin de route à un chemin demandé, et renvoie les
     * paramètres nommés trouvés.
     *
     * Le chemin de route « /api/produits/:slug » est d'abord traduit en
     * expression régulière : chaque « :nom » devient un groupe nommé qui
     * accepte tout sauf une barre oblique. Le nom du groupe est le nom du
     * paramètre.
     *
     * @return array<string, string>|null Les paramètres, ou null si le chemin
     *                                    ne correspond pas.
     */
    private static function extraire(string $modele, string $chemin): ?array
    {
        $motif = preg_quote($modele, '#');

        // preg_quote a échappé les deux-points : on rétablit les marqueurs
        // de paramètre, puis on les remplace par un groupe nommé.
        $motif = str_replace('\\:', ':', $motif);

        $motif = preg_replace_callback(
            '/:([A-Za-z0-9_]+)/',
            static fn (array $correspondances): string => '(?P<' . $correspondances[1] . '>[^/]+)',
            $motif
        ) ?? $motif;

        if (preg_match('#^' . $motif . '$#', $chemin, $trouvailles) !== 1) {
            return null;
        }

        $parametres = [];

        foreach ($trouvailles as $nom => $valeur) {
            if (is_string($nom)) {
                // L'URL est décodée : « %C3%A9 » redevient « é ».
                $parametres[$nom] = rawurldecode($valeur);
            }
        }

        return $parametres;
    }
}
