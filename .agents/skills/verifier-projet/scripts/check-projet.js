#!/usr/bin/env node
/**
 * Outil de vérification et de contrôle qualité du projet SAE301-Starter.
 *
 * Contrôles effectués :
 *   1. Synchronisation des chemins (BASE dans vite.config.js et chemin dans config.php)
 *   2. Respect de l'architecture MVC locale dans front/src/pages/
 *   3. Respect des contrats d'interface des composants dans front/src/ui/
 *   4. Détection de concaténations de classes Tailwind non compilables
 *   5. Standards PHP dans back/src/
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(process.argv[2] || '.');

let erreurs = 0;
let avertissements = 0;

function logErreur(message) {
  console.error(`\x1b[31m[ERREUR]\x1b[0m ${message}`);
  erreurs++;
}

function logAvertissement(message) {
  console.warn(`\x1b[33m[ATTENTION]\x1b[0m ${message}`);
  avertissements++;
}

function logSucces(message) {
  console.log(`\x1b[32m[OK]\x1b[0m ${message}`);
}

console.log(`=== Contrôle qualité du projet : ${rootDir} ===\n`);

// ---------------------------------------------------------------------------
// 1. Contrôle des chemins (BASE & chemin)
// ---------------------------------------------------------------------------
const viteConfigPath = path.join(rootDir, 'front', 'vite.config.js');
const phpConfigPath = path.join(rootDir, 'back', 'config', 'config.php');

if (fs.existsSync(viteConfigPath) && fs.existsSync(phpConfigPath)) {
  const viteContent = fs.readFileSync(viteConfigPath, 'utf8');
  const phpContent = fs.readFileSync(phpConfigPath, 'utf8');

  const matchVite = viteContent.match(/const\s+BASE\s*=\s*["']([^"']+)["']/);
  const matchPhp = phpContent.match(/['"]chemin['"]\s*=>\s*['"]([^'"]+)['"]/);

  const baseVite = matchVite ? matchVite[1] : null;
  const cheminPhp = matchPhp ? matchPhp[1] : null;

  if (!baseVite) {
    logErreur('front/vite.config.js : variable BASE introuvable.');
  } else if (!cheminPhp) {
    logErreur('back/config/config.php : clé "chemin" introuvable.');
  } else if (baseVite !== cheminPhp) {
    logAvertissement(`Désynchronisation des chemins :
      front/vite.config.js (BASE) : "${baseVite}"
      back/config/config.php (chemin) : "${cheminPhp}"
      Les deux valeurs doivent être identiques pour que cookies et proxy fonctionnent.`);
  } else if (baseVite.includes('votre_login')) {
    logAvertissement(`Le chemin "${baseVite}" contient encore le placeholder "votre_login". Pensez à le personnaliser avec votre login.`);
  } else {
    logSucces(`Chemins synchronisés : "${baseVite}"`);
  }
}

// ---------------------------------------------------------------------------
// 2. Contrôle des Pages (MVC local)
// ---------------------------------------------------------------------------
const pagesDir = path.join(rootDir, 'front', 'src', 'pages');
if (fs.existsSync(pagesDir)) {
  const pages = fs.readdirSync(pagesDir, { withFileTypes: true });

  for (const page of pages) {
    if (page.isDirectory()) {
      const pageFile = path.join(pagesDir, page.name, 'page.js');
      if (!fs.existsSync(pageFile)) {
        continue;
      }

      const content = fs.readFileSync(pageFile, 'utf8');

      // Vérifier les blocs M, C, V si la page est dynamique
      const hasM = /\blet\s+M\b|\bconst\s+M\b/.test(content);
      const hasC = /\blet\s+C\b|\bconst\s+C\b/.test(content);
      const hasV = /\blet\s+V\b|\bconst\s+V\b/.test(content);

      if (hasM || hasC || hasV) {
        if (!hasM || !hasC || !hasV) {
          logErreur(`Page front/src/pages/${page.name}/page.js : Structure MVC incomplète (M, C ou V manquant).`);
        } else {
          logSucces(`Page front/src/pages/${page.name} : Structure MVC locale (M, C, V) conforme.`);
        }
      }

      // Vérifier que la page exporte une fonction
      if (!/export\s+function\s+\w+/.test(content)) {
        logErreur(`Page front/src/pages/${page.name}/page.js : Aucune fonction de page exportée (ex: export function ${page.name}Page...).`);
      }

      // Vérifier pas de fetch direct dans la page
      if (/\bfetch\s*\(/.test(content)) {
        logAvertissement(`Page front/src/pages/${page.name}/page.js : Appel direct à fetch(). Privilégiez un module dans front/src/data/.`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Contrôle des Composants UI
// ---------------------------------------------------------------------------
const uiDir = path.join(rootDir, 'front', 'src', 'ui');
if (fs.existsSync(uiDir)) {
  const components = fs.readdirSync(uiDir, { withFileTypes: true });

  for (const comp of components) {
    if (comp.isDirectory()) {
      const compDir = path.join(uiDir, comp.name);
      const indexFile = path.join(compDir, 'index.js');
      const templateFile = path.join(compDir, 'template.html');

      if (!fs.existsSync(templateFile)) {
        logAvertissement(`Composant front/src/ui/${comp.name} : template.html manquant.`);
      }

      if (!fs.existsSync(indexFile)) {
        logErreur(`Composant front/src/ui/${comp.name} : index.js manquant.`);
      } else {
        const content = fs.readFileSync(indexFile, 'utf8');

        // Pas d'appel API dans un composant UI
        if (/getRequest|postRequest|\bfetch\s*\(/.test(content)) {
          logErreur(`Composant front/src/ui/${comp.name}/index.js : Effectue des appels réseau directs. Un composant ne doit recevoir que des données via ses paramètres.`);
        }

        // Doit exposer dom() ou html()
        if (!/\bdom\s*:\s*function|\bhtml\s*:\s*function|\bdom\(|\bhtml\(/.test(content)) {
          logAvertissement(`Composant front/src/ui/${comp.name}/index.js : N'expose ni méthode html() ni dom().`);
        } else {
          logSucces(`Composant front/src/ui/${comp.name} : Conforme.`);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Détection de concaténations Tailwind CSS problématiques
// ---------------------------------------------------------------------------
function scanTailwindClasses(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && file.name !== 'node_modules' && file.name !== 'dist') {
      scanTailwindClasses(fullPath);
    } else if (file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.html'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const concatMatch = content.match(/["'](?:bg|text|border|p|m|gap|rounded)-["']\s*\+/);
      if (concatMatch) {
        logAvertissement(`${path.relative(rootDir, fullPath)} : Concaténation de classe Tailwind détectée ("${concatMatch[0]}..."). Utilisez plutôt des variables CSS (style="--var:...") ou un dictionnaire d'états.`);
      }
    }
  }
}

const frontSrc = path.join(rootDir, 'front', 'src');
if (fs.existsSync(frontSrc)) {
  scanTailwindClasses(frontSrc);
}

// ---------------------------------------------------------------------------
// 5. Contrôle du Backend PHP
// ---------------------------------------------------------------------------
const backDir = path.join(rootDir, 'back', 'src');
if (fs.existsSync(backDir)) {
  function scanPhp(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        scanPhp(fullPath);
      } else if (file.isFile() && file.name.endsWith('.php')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (!content.includes('declare(strict_types=1);')) {
          logAvertissement(`${path.relative(rootDir, fullPath)} : "declare(strict_types=1);" manquant.`);
        }
      }
    }
  }
  scanPhp(backDir);
}

console.log(`\n=== Bilan : ${erreurs} erreur(s), ${avertissements} avertissement(s) ===\n`);
process.exit(erreurs > 0 ? 1 : 0);
