(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(e,t={}){this.root=document.getElementById(e),this.routes=[],this.layouts={},this.base=(t.base??`/`).replace(/\/$/,``),this.navigation=0,this.currentPath=null,window.addEventListener(`popstate`,()=>this.handleRoute()),document.addEventListener(`click`,e=>{let t=e.target.closest(`a[data-link]`);t!==null&&(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),this.navigate(this.routePath(t.pathname))))})}addLayout(e,t){return this.layouts[e]=t,this}findLayout(e){let t=null,n=0;for(let[r,i]of Object.entries(this.layouts))e.startsWith(r)&&r.length>n&&(t=i,n=r.length);return t}addRoute(e,t,n={}){return this.routes.push({path:e,regex:this.pathToRegex(e),keys:this.extractParams(e),handler:t,useLayout:n.useLayout!==!1}),this}pathToRegex(e){if(e===`*`)return/.*/;let t=e.replace(/\//g,`\\/`).replace(/:(\w+)/g,`([^\\/]+)`).replace(/\*/g,`.*`);return RegExp(`^`+t+`$`)}extractParams(e){let t=[];for(let n of e.matchAll(/:(\w+)/g))t.push(n[1]);return t}getParams(e,t){let n=t.match(e.regex);if(!n)return{};let r={};return e.keys.forEach((e,t)=>{r[e]=decodeURIComponent(n[t+1])}),r}routePath(e){return e===this.base?`/`:e.startsWith(this.base+`/`)?e.slice(this.base.length):e}url(e){return this.base+e}navigate(e){window.history.pushState(null,``,this.url(e)),this.handleRoute()}async handleRoute(){let e=++this.navigation,t=this.currentPath,n=this.routePath(window.location.pathname);this.currentPath=n,t&&t.startsWith(`/admin`)&&!n.startsWith(`/admin`)&&document.dispatchEvent(new Event(`admin:quitter`));let r=this.routes.find(e=>e.regex.test(n));if(!r)return;let i=await r.handler(this.getParams(r,n));e===this.navigation&&this.renderContent(i,r,n)}renderContent(e,t,n){let r=e;if(!(r instanceof DocumentFragment)){let e=document.createElement(`template`);e.innerHTML=r,r=e.content}let i=t.useLayout?this.findLayout(n):null;if(i){let e=i(n);e.querySelector(`slot:not([name])`).replaceWith(r),r=e}this.root.replaceChildren(r),this.updateLinks(n),window.scrollTo(0,0)}updateLinks(e){for(let t of this.root.querySelectorAll(`a[data-link]`)){let n=this.routePath(t.pathname);t.setAttribute(`href`,this.url(n)),n===e?t.setAttribute(`aria-current`,`page`):t.removeAttribute(`aria-current`)}}start(){this.handleRoute()}};function t(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}var n=function(e,n){let r=e;for(let e in n)r=r.replaceAll(`{{${e}}}`,()=>t(n[e]));return r};function r(e){let t=document.createElement(`template`);return t.innerHTML=e.trim(),t.content}var i=!1;function a(e){i=e,document.dispatchEvent(new CustomEvent(`admin:session-change`,{detail:e}))}function o(){return i}var s=`/~ribatet1/SAE-3.01/Base/api/`,c=class extends Error{constructor(e,t){super(e),this.name=`ErreurApi`,this.statut=t}},l=async function(e,t){let n=await fetch(s+e,t),r=null;try{r=await n.json()}catch{throw new c(`Réponse illisible du serveur.`,n.status)}if(!n.ok)throw new c(r?.erreur??`Erreur ${n.status}`,n.status);return r},u=function(e,t,n){return l(e,{method:t,headers:{Accept:`application/json`,"Content-Type":`application/json`},body:JSON.stringify(n)})},d=function(e){return l(e,{method:`GET`,headers:{Accept:`application/json`}})},f=function(e,t={}){return l(e,{method:`POST`,headers:{Accept:`application/json`,"Content-Type":`application/json`},body:JSON.stringify(t)})},p=function(e,t={}){return u(e,`PUT`,t)},m=function(e,t={}){return u(e,`DELETE`,t)},h=`sae301:panier`,ee=new Set;async function g(e){let t=await f(`panier/verifier-stock`,{lignes:e});return{valide:t.valide===!0,lignes:t.lignes??[],messages:(t.lignes??[]).filter(e=>e.message).map(e=>e.message)}}function _(){try{let e=window.localStorage.getItem(h);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}}function v(e){try{window.localStorage.setItem(h,JSON.stringify(e))}catch{}b();for(let t of ee)t(e)}function y(){return _().reduce((e,t)=>e+(Number(t.quantite)||0),0)}function te(e,t=1){let n=_(),r=Math.max(1,Math.floor(Number(t)||1)),i=e?.id;if(i==null)return n;let a=n.find(e=>String(e.id)===String(i));return a?a.quantite=(Number(a.quantite)||0)+r:n.push({id:i,slug:e.slug??``,nom:e.nom??``,prix:Number(e.prix)||0,quantite:r,src:e.src??``}),v(n),n}function ne(e,t){let n=_(),r=n.find(t=>String(t.id)===String(e));if(!r)return n;let i=Math.floor(Number(t)||0);return i<=0?(v(n.filter(t=>String(t.id)!==String(e))),_()):(r.quantite=i,v(n),n)}function re(e){let t=_().filter(t=>String(t.id)!==String(e));return v(t),t}function ie(){v([])}function b(){let e=y();for(let t of document.querySelectorAll(`[data-role="compteur-panier"]`))t.textContent=String(e)}function ae(){let e=document.documentElement.classList.toggle(`theme-dark`);try{localStorage.setItem(`theme`,e?`sombre`:`clair`)}catch{}}function x(e){return{id:e.id,nom:e.libelle,description:e.description??``,nbProduits:e.nb_produits??0}}var S={fetchAll:async function(){let e=await d(`categories`);return Array.isArray(e)?e:e.categories??[]},fetchAdminListe:async function(e=`nom`){return(await d(`admin/categories?tri=${encodeURIComponent(e)}`)).categories.map(x)},fetchAdminPage:async function(e,t,n){let r=await d(`admin/categories?page=${e}&tri=${encodeURIComponent(t)}&parPage=${n}`);return{...r,categories:r.categories.map(x)}},creer:async function(e){return x((await f(`admin/categories`,e)).categorie)},modifier:async function(e,t){return x((await p(`admin/categories/${encodeURIComponent(e)}`,t)).categorie)},supprimer:async function(e,t=null){let n=t===null?{}:{cible_id:Number(t)};return m(`admin/categories/${encodeURIComponent(e)}`,n)}},oe=`<header class="sticky top-0 z-10 border-b bg-surface-default shadow-xs border-border-default c-header-client">\r
  <!-- Ligne principale : Logo, Recherche, Actions utilisateur -->\r
  <figure class="flex flex-col mx-auto max-w-6xl items-center justify-center w-full gap-5 px-6 py-3.5">\r
    <div class="flex w-full justify-between items-center">\r
      <!-- Actions à gauche -->\r
      <a href="/" data-link class="flex items-center gap-2">\r
        <img src="{{logo-src}}" alt="Logo de l'application" class="h-5 w-auto" />\r
        <span class="hidden text-12 font-medium text-text-secondary sm:inline">Click & Collect</span>\r
      </a>\r
\r
      <!-- Actions à droite : Thème, Compte, Panier -->\r
      <div class="flex items-center gap-3">\r
        <button type="button" data-action="theme" aria-label="Changer de thème" class="flex h-9 items-center justify-center rounded-md border px-3 text-12 font-medium text-text-secondary transition-colors hover:bg-surface-subtle border-border-default">\r
          <svg class="h-4 w-4 shrink-0" aria-hidden="true">\r
            <use href="{{icon-theme}}" />\r
          </svg>\r
        </button>\r
\r
        <a href="/compte" data-link class="flex h-9 items-center gap-1.5 rounded-md border px-3 text-12 font-medium text-text-secondary transition-colors hover:bg-surface-subtle border-border-default">\r
          <svg class="h-4 w-4 shrink-0" aria-hidden="true">\r
            <use href="#icon-user-circle" />\r
          </svg>\r
          <span>Mon compte</span>\r
        </a>\r
\r
        <!-- Bouton Panier avec compteur d'articles (CMD-b) -->\r
        <a href="/panier" data-link class="relative flex h-9 items-center gap-2 rounded-md bg-action-primary-background px-3.5 text-12 font-semibold text-action-primary-text transition-opacity hover:opacity-90">\r
          <svg class="h-4 w-4 shrink-0" aria-hidden="true">\r
            <use href="#icon-shopping-bag" />\r
          </svg>\r
          <span>Panier</span>\r
          <span data-role="compteur-panier" class="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-info px-1 text-12 font-bold text-text-link">\r
            {{nbArticles}}\r
          </span>\r
        </a>\r
      </div>\r
    </div>\r
    <!-- Barre de catégories (DEC-a) -->\r
    <figcaption class="w-full border-t bg-surface-subtle px-6 py-2 border-border-default">\r
      <nav class="flex w-full items-center gap-6 overflow-x-auto text-14">\r
        <a href="/" data-link class="font-medium text-text-primary hover:text-text-link aria-[current=page]:text-text-link">\r
          Tous les produits\r
        </a>\r
        <slot name="categories"></slot>\r
      </nav>\r
    </figcaption>\r
\r
  </figure>\r
</header>`,se=`<a href="{{lien}}" data-link class="inline-flex items-center gap-1.5 whitespace-nowrap text-text-secondary transition-colors hover:text-text-primary aria-[current=page]:font-semibold aria-[current=page]:text-text-link c-header-client--alternate">
  <span>{{nom}}</span>
  <span class="rounded-full bg-surface-subtle px-1.5 py-0.5 text-12 font-normal text-text-secondary">{{nb-produits}}</span>
</a>`,ce=`/~ribatet1/SAE-3.01/Base/assets/logo-Cjz4wVmC.webp`,C={html:function(e={}){let t=document.documentElement.classList.contains(`theme-dark`)?`#icon-sun`:`#icon-moon`;return n(oe,{nbArticles:e.nbArticles??e.totalArticles??0,"icon-theme":t,"logo-src":ce})},dom:function(e={},t={}){let n=r(C.html(e)),i=n.querySelector(`slot[name="categories"]`);i&&(Array.isArray(e.categories)&&e.categories.length>0?i.replaceWith(...e.categories.map(C.creerLienCategorie)):C.chargerCategories(i));let a=n.querySelector(`[data-action="theme"]`);return a&&a.addEventListener(`click`,()=>{ae();let e=document.documentElement.classList.contains(`theme-dark`),n=a.querySelector(`use`);n&&n.setAttribute(`href`,e?`#icon-sun`:`#icon-moon`),t.surChangerTheme&&t.surChangerTheme()}),n},creerLienCategorie:function(e){let t=`/categorie/${encodeURIComponent(e.slug)}`,i=`/~ribatet1/SAE-3.01/Base/`.replace(/\/$/,``),a=e.lien||`${i}${t}`,o=r(n(se,{nom:e.nom||e.libelle||``,lien:a,"nb-produits":e.nb_produits??e.nbProduits??0})),s=o.firstElementChild;return window.location.pathname===a&&s.setAttribute(`aria-current`,`page`),o},chargerCategories:async function(e){try{let t=await S.fetchAll();if(!e.isConnected)return;let n=t.map(C.creerLienCategorie);e.replaceWith(...n)}catch{e?.isConnected&&e.remove()}}},le=`<header class="sticky top-0 z-10 border-b border-border-default bg-surface-default/95 backdrop-blur-xs c-header-admin">\r
  <figure class="flex flex-col mx-auto max-w-6xl items-center justify-between gap-6 px-6 py-3">\r
    <div class="flex w-full justify-between items-center gap-3">\r
      <a href="/admin" data-link class="flex items-center gap-2 text-14 font-bold tracking-tight text-text-primary">\r
        <img src="{{logo-src}}" alt="Logo de l'application" class="h-5 w-auto" />\r
        <span class="text-text-link">Administration</span>\r
      </a>\r
\r
      <div class="flex justify-center items-center gap-2">\r
        <a href="/" data-link class="text-12 text-text-link transition-colors hover:text-text-primary text-text-secondary">\r
          Voir le site ↗\r
        </a>\r
\r
        <button type="button" data-action="theme" aria-label="Changer de thème" class="flex h-9 items-center justify-center rounded-md border px-3 text-12 font-medium text-text-secondary transition-colors hover:bg-surface-subtle border-border-default">\r
          <svg class="h-4 w-4 shrink-0" aria-hidden="true">\r
            <use href="{{icon-theme}}" />\r
          </svg>\r
        </button>\r
\r
        <button type="button" data-action="deconnexion" class="h-8 rounded-md border px-3 text-12 font-medium text-text-secondary transition-colors hover:bg-surface-subtle border-border-default">\r
          Se déconnecter\r
        </button>\r
      </div>\r
    </div>\r
\r
    <figcaption data-zone="navigation-authentifie" class="w-full border-t bg-surface-subtle px-6 py-2 border-border-default">\r
      <!-- Le routeur pose aria-current="page" sur le lien de la page affichée. -->\r
      <nav class="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto text-14">\r
        <a href="/admin" data-link class="font-medium text-text-primary hover:text-text-link aria-[current=page]:text-text-link">\r
          Tableau de bord\r
        </a>\r
        <slot name="navigation"></slot>\r
      </nav>\r
    </figcaption>\r
  </figure>\r
</header>`,ue=`<a href="{{lien}}" data-link class="inline-flex items-center gap-1.5 whitespace-nowrap text-text-secondary transition-colors hover:text-text-primary aria-[current=page]:font-semibold aria-[current=page]:text-text-link c-header-admin--alternate">\r
  {{nom}}\r
</a>`,de=[{lien:`/admin/produits`,nom:`Produits`},{lien:`/admin/categories`,nom:`Catégories`},{lien:`/admin/commandes`,nom:`Commandes`}],fe={html:function(){return n(le,{"icon-theme":document.documentElement.classList.contains(`theme-dark`)?`#icon-sun`:`#icon-moon`,"logo-src":ce})},dom:function(e={}){let t=r(fe.html()),i=t.querySelector(`[data-zone="navigation-authentifie"]`);i&&(i.hidden=!e.adminConnecte);let a=t.querySelector(`[data-action="deconnexion"]`);a&&(a.hidden=!e.adminConnecte);let o=t.querySelector(`slot[name="navigation"]`);if(o){let e=de.map(e=>r(n(ue,e)));o.replaceWith(...e)}let s=t.querySelector(`[data-action="theme"]`);return s&&s.addEventListener(`click`,()=>{ae();let e=document.documentElement.classList.contains(`theme-dark`),t=s.querySelector(`use`);t&&t.setAttribute(`href`,e?`#icon-sun`:`#icon-moon`)}),a&&e.surDeconnexion&&a.addEventListener(`click`,()=>e.surDeconnexion()),t}},pe=`<div class="min-h-screen">
  <slot name="header"></slot>
  <main>
    <!-- Le slot sans nom reçoit la page affichée (voir lib/router.js). -->
    <slot></slot>
  </main>
</div>
`;function me(e=`/`){let t=r(pe),n=e===`/admin`||e.startsWith(`/admin/`),i=n?fe:C,a=n?{adminConnecte:o(),surDeconnexion:()=>document.dispatchEvent(new Event(`admin:deconnexion`))}:{},s=n?{}:{nbArticles:y()};return t.querySelector(`slot[name="header"]`).replaceWith(i.dom(s,a)),t}var he=Object.assign({"../images/bricolage/boite-outils-keter-fermer.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-fermer-BCeyoHet.avif`,"../images/bricolage/boite-outils-keter-ouvert.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-ouvert-DHPzhAIY.avif`,"../images/bricolage/boite-outils-keter-seul.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-seul-DBg7fsyY.avif`,"../images/bricolage/boite-outils-keter.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-DQbvFGvG.avif`,"../images/bricolage/lampe-travail-sans-fil-werckmann-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-sans-fil-werckmann-boite-KL58At6W.avif`,"../images/bricolage/lampe-travail-sans-fil-werckmann-detail.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-sans-fil-werckmann-detail-j_KN6pop.avif`,"../images/bricolage/lampe-travail-sans-fil-werckmann.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-sans-fil-werckmann-DBIycGbc.avif`,"../images/bricolage/lampe-travail-trepier-werckmann-allumee.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-trepier-werckmann-allumee-CQBA4dBf.avif`,"../images/bricolage/lampe-travail-trepier-werckmann-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-trepier-werckmann-boite-B1U6B7m2.avif`,"../images/bricolage/lampe-travail-trepier-werckmann.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-trepier-werckmann-CBQTY0FS.avif`,"../images/bricolage/multiprise-pro-max-triple-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/multiprise-pro-max-triple-boite-DfDB75hT.avif`,"../images/bricolage/multiprise-pro-max-triple-detail.avif":`/~ribatet1/SAE-3.01/Base/assets/multiprise-pro-max-triple-detail-CHIPEjeb.avif`,"../images/bricolage/multiprise-pro-max-triple.avif":`/~ribatet1/SAE-3.01/Base/assets/multiprise-pro-max-triple-BPa04KDQ.avif`,"../images/habitat/boule-lumineuse-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/boule-lumineuse-boite-BzG9_fWl.avif`,"../images/habitat/boule-lumineuse-cable.png":`/~ribatet1/SAE-3.01/Base/assets/boule-lumineuse-cable-BdbxzmYB.png`,"../images/habitat/boule-lumineuse.avif":`/~ribatet1/SAE-3.01/Base/assets/boule-lumineuse-BKdLDzjB.avif`,"../images/habitat/couette-sans-housse-beige-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-beige-zoom-DLIJrnxN.avif`,"../images/habitat/couette-sans-housse-beige.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-beige-DyE4rrQ7.avif`,"../images/habitat/couette-sans-housse-blanche-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-blanche-zoom-Dczs4QaA.avif`,"../images/habitat/couette-sans-housse-blanche.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-blanche-COoqT0Df.avif`,"../images/habitat/couette-sans-housse-noire-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-noire-zoom-BFKrSxbj.avif`,"../images/habitat/couette-sans-housse-noire.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-noire-B9E-IJVb.avif`,"../images/habitat/couette-sans-housse-sac.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-sac-DJnKY3JV.avif`,"../images/habitat/oreiller-mousse-memoire-forme-dessus.avif":`/~ribatet1/SAE-3.01/Base/assets/oreiller-mousse-memoire-forme-dessus-CmAwF7Ow.avif`,"../images/habitat/oreiller-mousse-memoire-forme-sachet.avif":`/~ribatet1/SAE-3.01/Base/assets/oreiller-mousse-memoire-forme-sachet-DCLiQeTC.avif`,"../images/habitat/oreiller-mousse-memoire-forme.avif":`/~ribatet1/SAE-3.01/Base/assets/oreiller-mousse-memoire-forme-XNN87-XU.avif`,"../images/habitat/rideaux-velours-beige-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-beige-boite-2F0lCa7v.avif`,"../images/habitat/rideaux-velours-beige-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-beige-zoom-DAMrAkI9.avif`,"../images/habitat/rideaux-velours-beige.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-beige-rkMrkhe8.avif`,"../images/habitat/rideaux-velours-rose-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-rose-boite-DT8x0SOi.avif`,"../images/habitat/rideaux-velours-rose-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-rose-zoom-T7Ny8J_8.avif`,"../images/habitat/rideaux-velours-rose.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-rose-CNkcMHz3.avif`,"../images/habitat/serviette-cuivre-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-cuivre-zoom-3iPaP7EM.avif`,"../images/habitat/serviette-cuivre.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-cuivre-D8Yz88Ej.avif`,"../images/habitat/serviette-invite-noire-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-noire-zoom-Bv1AaHhL.avif`,"../images/habitat/serviette-invite-noire.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-noire-CQYcjFoo.avif`,"../images/habitat/serviette-invite-orange-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-orange-zoom-CYD4M7Vk.avif`,"../images/habitat/serviette-invite-orange.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-orange-BW_j71D4.avif`,"../images/habitat/serviette-invite-verte-longueur.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-verte-longueur-CYmtp2-i.avif`,"../images/habitat/serviette-invite-verte-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-verte-zoom-D8bN77Xs.avif`,"../images/habitat/serviette-invite-verte.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-verte-H380OaA4.avif`,"../images/habitat/serviette-noire-longueur.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-noire-longueur-CcaH3Jku.avif`,"../images/habitat/serviette-noire.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-noire-CmooFf5M.avif`,"../images/habitat/serviette-verte.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-verte-Cjt8Z8eK.avif`,"../images/habitat/taies-oreiller-hotel-royal-blanc.avif":`data:image/avif;base64,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`,"../images/habitat/taies-oreiller-hotel-royal-bleu-seul.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-bleu-seul-DCGqeneR.avif`,"../images/habitat/taies-oreiller-hotel-royal-bleu-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-bleu-zoom-C92Wi9t5.avif`,"../images/habitat/taies-oreiller-hotel-royal-bleu.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-bleu-NfJ5o17X.avif`,"../images/habitat/taies-oreiller-hotel-royal-rose-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-rose-boite-Cwgi5e-a.avif`,"../images/habitat/taies-oreiller-hotel-royal-rose.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-rose-C9WZUMDM.avif`,"../images/hobby/crayons-aquarelle-van-bleiswijck-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/crayons-aquarelle-van-bleiswijck-boite-Do2k5YTH.avif`,"../images/hobby/crayons-aquarelle-van-bleiswijck-complet.avif":`/~ribatet1/SAE-3.01/Base/assets/crayons-aquarelle-van-bleiswijck-complet-DQMZByHG.avif`,"../images/hobby/crayons-aquarelle-van-bleiswijck.avif":`/~ribatet1/SAE-3.01/Base/assets/crayons-aquarelle-van-bleiswijck-CKdSf73d.avif`,"../images/hobby/paillettes-blanc-a-rose.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-blanc-a-rose-ByHqHq3F.avif`,"../images/hobby/paillettes-fushia-a-bleu.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-fushia-a-bleu-CKJFBOmJ.avif`,"../images/hobby/paillettes-rose-a-orange.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-rose-a-orange-BChwCw1E.avif`,"../images/hobby/paillettes-sac.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-sac-H030CzW4.avif`,"../images/hobby/peinture-acrylique-van-bleiswijck-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/peinture-acrylique-van-bleiswijck-boite-fbr9r4GC.avif`,"../images/hobby/peinture-acrylique-van-bleiswijck.avif":`/~ribatet1/SAE-3.01/Base/assets/peinture-acrylique-van-bleiswijck-DA9rPbSx.avif`,"../images/hobby/pinceaux-van-bleiswijck-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/pinceaux-van-bleiswijck-boite-CW3Tcveo.avif`,"../images/hobby/pinceaux-van-bleiswijck-fins.avif":`/~ribatet1/SAE-3.01/Base/assets/pinceaux-van-bleiswijck-fins-Dl4gXi2j.avif`,"../images/hobby/pinceaux-van-bleiswijck-larges.avif":`/~ribatet1/SAE-3.01/Base/assets/pinceaux-van-bleiswijck-larges-Bvn6adHJ.avif`,"../images/hobby/toile-peindre-van-bleiswijck.avif":`/~ribatet1/SAE-3.01/Base/assets/toile-peindre-van-bleiswijck-BEzOszMG.avif`,"../images/logo.webp":`/~ribatet1/SAE-3.01/Base/assets/logo-Cjz4wVmC.webp`});function ge(e){return e?e.startsWith(`uploads/`)?`/~ribatet1/SAE-3.01/Base/`+e:he[`../images/${e}`]??``:``}var w={},_e=function(e){return{...e,prix:Number(e.prix),prix_unitaire:e.prix_unitaire===null?null:Number(e.prix_unitaire),stock:e.stock,seuilAlerte:e.seuil_alerte,src:ge(e.src),options:(e.options||[]).map(e=>({id:e.id,nom:e.nom,ordre:e.ordre,valeurs:(e.valeurs||[]).map(e=>({id:e.id,valeur:e.valeur,prixSupplement:e.prix_supplement===null?0:Number(e.prix_supplement),ordre:e.ordre}))}))}},ve=function(e){return{src:ge(e.chemin),alt:e.texte_alternatif??``,ordre:Number(e.ordre??0)}};w.fetchPage=async function(e,t,n=null){let r=`produits?page=${e}`;n!=null&&n!==``&&(r+=`&categorie=${encodeURIComponent(n)}`),t!==void 0&&(r+=`&tri=${encodeURIComponent(t.tri)}&parPage=${t.parPage}`);let i=await d(r);return{...i,produits:i.produits.map(_e)}},w.fetchBySlug=async function(e){let t=await d(`produits/${encodeURIComponent(e)}`);return{...t,produit:_e(t.produit),galerie:(t.galerie??[]).map(ve),options:(t.options??[]).map(e=>({id:e.id,nom:e.nom,ordre:e.ordre,valeurs:(e.valeurs??[]).map(e=>({id:e.id,valeur:e.valeur,prixSupplement:e.prix_supplement===null?0:Number(e.prix_supplement),ordre:e.ordre}))}))}};function T(e){return{id:e.id,reference:e.reference,slug:e.slug,nom:e.nom,categorieId:e.categorie_id,categorie:e.categorie,marque:e.marque??``,format:e.format??``,description:e.description??``,prix:Number(e.prix),prixUnitaire:e.prix_unitaire===null?``:Number(e.prix_unitaire),unitePrix:e.unite_prix??``,badge:e.badge??``,stock:e.stock,seuilAlerte:e.seuil_alerte,images:(e.images??[]).map(e=>({id:e.id,src:ge(e.chemin),alt:e.texte_alternatif??``}))}}w.fetchAdminListe=async function(e=1,t){let n=`admin/produits?page=${e}`;t!==void 0&&(n+=`&tri=${encodeURIComponent(t.tri)}&parPage=${t.parPage}`);let r=await d(n);return{...r,produits:r.produits.map(T)}},w.creer=async function(e){return T((await f(`admin/produits`,e)).produit)},w.modifier=async function(e,t){return T((await p(`admin/produits/${encodeURIComponent(e)}`,t)).produit)},w.supprimer=function(e){return m(`admin/produits/${encodeURIComponent(e)}`)},w.ajouterImage=function(e,t){return f(`admin/produits/${encodeURIComponent(e)}/images`,t)},w.supprimerImage=function(e,t){return m(`admin/produits/${encodeURIComponent(e)}/images/${encodeURIComponent(t)}`)},w.fetchAdminOptions=function(e){return d(`admin/produits/${encodeURIComponent(e)}/options`).then(e=>e.options)},w.creerOption=function(e,t){return f(`admin/produits/${encodeURIComponent(e)}/options`,t).then(e=>e.options)},w.modifierOption=function(e,t){return p(`admin/produits/options/${encodeURIComponent(e)}`,t).then(e=>e.options)},w.supprimerOption=function(e){return m(`admin/produits/options/${encodeURIComponent(e)}`).then(e=>e.options)},w.ajouterValeur=function(e,t){return f(`admin/produits/options/${encodeURIComponent(e)}/valeurs`,t).then(e=>e.options)},w.modifierValeur=function(e,t){return p(`admin/produits/valeurs/${encodeURIComponent(e)}`,t).then(e=>e.options)},w.supprimerValeur=function(e){return m(`admin/produits/valeurs/${encodeURIComponent(e)}`).then(e=>e.options)};var ye=`<div class="mb-6 flex flex-wrap items-end gap-4 rounded-lg border p-4 border-border-default c-barre-outils">\r
  <label class="flex flex-col gap-2 text-14 font-medium">\r
    Trier par\r
    <select name="tri" class="h-9 min-w-44 rounded-md border bg-surface-default px-3 font-normal transition-colors hover:border-border-default border-border-default">\r
      <option value="nom">Nom (A → Z)</option>\r
      <option value="prix">Prix (croissant)</option>\r
    </select>\r
  </label>\r
\r
  <label class="flex flex-col gap-2 text-14 font-medium">\r
    {{libelleParPage}}\r
    <select name="parPage" class="h-9 min-w-44 rounded-md border bg-surface-default px-3 font-normal transition-colors hover:border-border-default border-border-default">\r
      <option value="12">12 {{libelleUnite}}</option>\r
      <option value="24">24 {{libelleUnite}}</option>\r
      <option value="48">48 {{libelleUnite}}</option>\r
    </select>\r
  </label>\r
\r
  <span class="ml-auto text-14 text-text-secondary">{{total}} {{libelleTotal}}</span>\r
</div>\r
`,E={html:function(e){return n(ye,{libelleTotal:`produits`,libelleParPage:`Produits par page`,libelleUnite:`produits`,...e})},dom:function(e,t){let n=r(E.html(e)),i=n.querySelector(`select[name="tri"]`),a=n.querySelector(`select[name="parPage"]`);return i&&(Array.isArray(e.optionsTri)&&i.replaceChildren(...e.optionsTri.map(({valeur:e,libelle:t})=>{let n=document.createElement(`option`);return n.value=e,n.textContent=t,n})),i.value=e.tri,i.addEventListener(`change`,()=>t.surTri(i.value))),a&&(a.value=String(e.parPage),a.addEventListener(`change`,()=>t.surParPage(Number(a.value)))),n}},be=`<nav aria-label="Fil d'Ariane" class="mb-4 c-fil-ariane">
  <ol data-zone="items" class="flex flex-wrap items-center gap-2 text-14"></ol>
</nav>`,xe={html:function(){return be},dom:function(e=[]){let t=r(be),n=t.querySelector(`[data-zone="items"]`);return e.forEach((t,r)=>{let i=r===e.length-1,a=document.createElement(`li`);if(a.className=`flex items-center gap-2`,i||!t.lien){let e=document.createElement(`span`);e.textContent=t.libelle,e.className=`font-medium text-zinc-900 dark:text-zinc-100`,i&&e.setAttribute(`aria-current`,`page`),a.appendChild(e)}else{let e=document.createElement(`a`);e.href=t.lien,e.dataset.link=``,e.textContent=t.libelle,e.className=`text-zinc-500 underline hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200`,a.appendChild(e)}if(!i){let e=document.createElement(`span`);e.textContent=`/`,e.setAttribute(`aria-hidden`,`true`),e.className=`text-zinc-400`,a.appendChild(e)}n.appendChild(a)}),t}},Se=`<span class="inline-flex items-center gap-1.5 border px-2 py-0.5 text-12 font-medium backdrop-blur-xs shadow-2xs {{classes}} c-badge-stock">
  <svg class="h-3 w-3 shrink-0 {{iconClasse}}" aria-hidden="true">
    <use href="#{{id-icon}}"/>
  </svg>
  {{texte}}
</span>
`,Ce={"En stock":{classes:`border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/80 dark:text-emerald-300`,iconClasse:`fill-emerald-500 dark:fill-emerald-400`,idIcon:`icon-circle`},"Bientôt épuisé":{classes:`border-amber-200 bg-amber-50/90 text-amber-800 dark:border-amber-800/80 dark:bg-amber-950/80 dark:text-amber-300`,iconClasse:`fill-amber-500 dark:fill-amber-400 animate-pulse`,idIcon:`icon-alert-triangle`},Épuisé:{classes:`border-rose-200 bg-rose-50/90 text-rose-800 dark:border-rose-800/80 dark:bg-rose-950/80 dark:text-rose-300`,iconClasse:`fill-rose-500 dark:fill-rose-400`,idIcon:`icon-circle`}};function we(e={}){if(e?.etat){let t=String(e.etat).toLowerCase().trim();return t.includes(`bientot`)||t.includes(`faible`)||t.includes(`alerte`)?`Bientôt épuisé`:t.includes(`épuisé`)||t.includes(`epuise`)||t.includes(`rupture`)?`Épuisé`:`En stock`}return typeof e?.stock==`number`?e.stock<=0?`Épuisé`:e.stock<=(e.seuilAlerte??5)?`Bientôt épuisé`:`En stock`:`En stock`}var D={html:function(e={}){let t=we(e),r=Ce[t]||Ce[`En stock`];return n(Se,{texte:t,classes:r.classes,iconClasse:r.iconClasse,"id-icon":r.idIcon})},dom:function(e={}){return r(D.html(e))}},Te=`<article class="flex flex-col justify-between overflow-hidden rounded-lg border bg-surface-default shadow-xs transition-shadow hover:shadow-md border-border-default c-carte-produit">\r
  <a href="{{lien}}" data-link class="flex flex-1 flex-col text-inherit no-underline">\r
    <figure class="flex flex-1 flex-col">\r
      <div class="flex h-48 w-full items-center justify-center overflow-hidden bg-surface-subtle p-4">\r
        <img src="{{src}}" alt="{{alt}}" class="h-full w-full object-contain text-text-primary transition-transform duration-200 hover:scale-105" loading="lazy" />\r
      </div>\r
\r
      <figcaption class="flex flex-col p-4 gap-5">\r
        <h2 class="mb-1 min-h-[2.75em] overflow-hidden text-16 font-semibold leading-snug tracking-tight text-text-primary line-clamp-2">\r
          {{nom}}\r
        </h2>\r
\r
        <div class="mb-3 flex items-baseline justify-between gap-2">\r
          <span class="text-18 font-bold text-text-primary">\r
            {{prix}} €\r
          </span>\r
          <slot name="badge-stock"></slot>\r
        </div>\r
      </figcaption>\r
    </figure>\r
  </a>\r
  <div class="px-4 pb-4">\r
    <button type="button" data-action="ajouter-panier" class="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">\r
      Ajouter au panier\r
    </button>\r
  </div>\r
</article>\r
`,Ee={html:function(e={}){let t=typeof e.prix==`number`?e.prix.toFixed(2).replace(`.`,`,`):String(e.prix||`0,00`);return n(Te,{nom:e.nom||``,prix:t,src:e.src||e.image||``,alt:e.alt||e.nom||`Produit Action`,lien:e.lien||(e.slug?`/produit/${e.slug}`:e.id?`/produit/${e.id}`:`#`)})},dom:function(e={},t={}){let n=r(Ee.html(e)),i=n.querySelector(`slot[name="badge-stock"]`);i&&i.replaceWith(D.dom({etat:e.etat,stock:e.stock,seuilAlerte:e.seuilAlerte}));let a=n.querySelector(`[data-action="ajouter-panier"]`),o=e.etat===`Épuisé`||e.etat===`epuise`||e.stock===0;return a&&(o?(a.disabled=!0,a.textContent=`Épuisé`):t.surAjouterPanier&&a.addEventListener(`click`,()=>t.surAjouterPanier(e.id))),n}},De=`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 c-grille-produits">
  <slot name="cartes"></slot>
</div>
`,Oe=`<p class="text-14 text-text-secondary c-grille-produits__vide">
    Aucun produit à afficher.
</p>
`,ke={dom:function(e=[],t={}){if(!e||e.length===0)return r(Oe);let n=r(De),i=e.map(e=>Ee.dom(e,t)),a=n.querySelector(`slot[name="cartes"]`);return a&&a.replaceWith(...i),n}},Ae=`<p role="status" class="mb-6 rounded-md border px-4 py-3 text-14 {{couleurs}} c-message">{{texte}}</p>
`,je={erreur:`border-red-700 text-red-700 dark:border-red-400 dark:text-red-400`,succes:`border-green-700 text-green-700 dark:border-green-400 dark:text-green-400`,info:`border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400`},O={html:function(e){return!e||!e.texte?``:n(Ae,{texte:e.texte,couleurs:je[e.type]||je.erreur})},dom:function(e){return r(O.html(e))}},Me=`<nav class="mt-10 flex items-center justify-center gap-4 c-pagination">
  <button type="button" data-action="precedente" class="h-9 rounded-md border px-4 text-14 font-medium transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent border-border-default">
    Précédent
  </button>

  <span class="text-14 text-text-secondary">Page {{page}} sur {{pagesTotal}}</span>

  <button type="button" data-action="suivante" class="h-9 rounded-md border px-4 text-14 font-medium transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent border-border-default">
    Suivant
  </button>
</nav>
`,k={html:function(e){return n(Me,{page:e.page||1,pagesTotal:e.pagesTotal||1})},dom:function(e,t={}){let n=r(k.html(e)),i=n.querySelector(`[data-action="precedente"]`),a=n.querySelector(`[data-action="suivante"]`);return i&&(i.disabled=e.page<=1,t.surPage&&i.addEventListener(`click`,()=>t.surPage(e.page-1))),a&&(a.disabled=e.page>=e.pagesTotal,t.surPage&&a.addEventListener(`click`,()=>t.surPage(e.page+1))),n}},Ne=`<section class="mx-auto max-w-5xl px-6 pt-10 pb-16">
  <slot name="ariane"></slot>
  <h1 class="mb-6 text-2xl font-semibold tracking-tight">Catalogue</h1>

  <slot name="barre-outils"></slot>
  <slot name="message"></slot>
  <slot name="grille"></slot>
  <slot name="pagination"></slot>
</section>
`,A={catalogue:null,message:null,categorieSlug:null,categorieLibelle:null},j={};j.charger=async function(e,t,n=A.categorieSlug){try{A.catalogue=await w.fetchPage(e,t,n),A.message=null}catch(e){A.catalogue=null,A.message={type:`erreur`,texte:`Impossible de charger le catalogue : ${e.message}`}}},j.handler_changerTri=async function(e){await j.charger(1,{tri:e,parPage:A.catalogue.parPage},A.categorieSlug),M.rafraichir()},j.handler_changerParPage=async function(e){await j.charger(1,{tri:A.catalogue.tri,parPage:e},A.categorieSlug),M.rafraichir()},j.handler_changerPage=async function(e){await j.charger(e,{tri:A.catalogue.tri,parPage:A.catalogue.parPage},A.categorieSlug),M.rafraichir(),window.scrollTo({top:0,behavior:`smooth`})},j.handler_ajouterPanier=function(e){let t=(A.catalogue?.produits??[]).find(t=>String(t.id)===String(e));t&&te(t,1)},j.init=async function(e=null){return A.categorieSlug=e!=null&&e!==``?e:null,await j.charger(1,void 0,A.categorieSlug),A.categorieLibelle=A.catalogue?.categorie?.libelle??A.categorieSlug,M.init()};var M={};M.racine=null,M.init=function(){let e=M.createPageFragment();return M.racine=e.firstElementChild,e},M.rafraichir=function(){let e=M.createPageFragment(),t=e.firstElementChild;M.racine.replaceWith(e),M.racine=t},M.createPageFragment=function(){let e=r(Ne),t=A.categorieSlug===null?[{libelle:`Catalogue`}]:[{libelle:`Catalogue`,lien:`/`},{libelle:A.categorieLibelle}];if(e.querySelector(`slot[name="ariane"]`).replaceWith(xe.dom(t)),e.querySelector(`slot[name="message"]`).replaceWith(O.dom(A.message)),A.catalogue===null){for(let t of e.querySelectorAll(`slot`))t.remove();return e}return e.querySelector(`slot[name="barre-outils"]`).replaceWith(E.dom(A.catalogue,{surTri:j.handler_changerTri,surParPage:j.handler_changerParPage})),e.querySelector(`slot[name="grille"]`).replaceWith(ke.dom(A.catalogue.produits,{surAjouterPanier:j.handler_ajouterPanier})),e.querySelector(`slot[name="pagination"]`).replaceWith(k.dom(A.catalogue,{surPage:j.handler_changerPage})),e};function Pe(e={}){return j.init(e.slug??e.Slug??e.categorie??null)}var Fe=`Click & Collect`;function N(e,t,n){if(!n)return;let r=document.head.querySelector(`meta[${e}="${t}"]`);r||(r=document.createElement(`meta`),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute(`content`,n)}function Ie(e){if(!e)return;let t=document.head.querySelector(`link[rel="canonical"]`);t||(t=document.createElement(`link`),t.setAttribute(`rel`,`canonical`),document.head.appendChild(t)),t.setAttribute(`href`,e)}function Le(e=`/`){let t=`/~ribatet1/SAE-3.01/Base/`.replace(/\/$/,``),n=e.startsWith(`/`)?e:`/${e}`;return`${window.location.origin}${t}${n}`}function Re(e){return e?/^https?:\/\//.test(e)?e:`${window.location.origin}${e}`:``}function ze({titre:e,description:t,image:n,chemin:r,type:i=`website`}={}){let a=e?`${e} | ${Fe}`:Fe,o=r?Le(r):window.location.href;if(document.title=a,N(`name`,`description`,t),N(`property`,`og:site_name`,Fe),N(`property`,`og:title`,a),N(`property`,`og:description`,t),N(`property`,`og:type`,i),N(`property`,`og:url`,o),N(`property`,`og:locale`,`fr_FR`),N(`name`,`twitter:card`,n?`summary_large_image`:`summary`),N(`name`,`twitter:title`,a),N(`name`,`twitter:description`,t),n){let e=Re(n);N(`property`,`og:image`,e),N(`name`,`twitter:image`,e)}Ie(o)}var Be=`<div class="w-fit inline-flex items-center rounded-md border border-border-default c-boutons-quantite">
    <button type="button" data-action="moins" aria-label="Diminuer la quantité" class="h-10 w-10 text-18 hover:bg-surface-subtle disabled:opacity-40">
    −
    </button>
    <input type="number" name="quantite" min="1" value="1" aria-label="Quantité" class="h-10 w-14 bg-transparent text-center text-14" />
    <button type="button" data-action="plus" aria-label="Augmenter la quantité" class="h-10 w-10 text-18 hover:bg-surface-subtle disabled:opacity-40">
    +
    </button>
</div>`,P={html:function(){return Be},ajuster:function(e,t=1,n=1/0){let r=parseInt(e,10);return Number.isNaN(r)&&(r=t),Math.min(Math.max(r,t),n)},dom:function(e={},t={}){let n=e.min??1,i=e.max??1/0,a=r(Be),o=a.querySelector(`input[name="quantite"]`),s=a.querySelector(`[data-action="moins"]`),c=a.querySelector(`[data-action="plus"]`);o.min=n,Number.isFinite(i)&&(o.max=i);let l=(e,r=!0)=>{let a=P.ajuster(e,n,i);o.value=a,s.disabled=a<=n,c.disabled=a>=i,r&&t.surChange&&t.surChange(a)};return o.value=P.ajuster(e.valeur??n,n,i),s.disabled=o.value<=n,c.disabled=o.value>=i,s.addEventListener(`click`,()=>l(Number(o.value)-1)),c.addEventListener(`click`,()=>l(Number(o.value)+1)),o.addEventListener(`change`,()=>l(o.value)),a}},Ve=`<figure class="flex flex-col gap-3 w-full c-galerie-images">
  <img data-zone="principale" src="" alt="" class="h-96 w-full object-contain bg-surface-default" />
  <figcaption class="flex flex-col gap-3">
    <div class="flex w-full items-center justify-between overflow-hidden rounded-lg bg-surface-default">
      <button type="button" data-action="precedent" aria-label="Image précédente" class="flex h-10 w-10 items-center justify-center bg-background-subtle text-text-primary shadow hover:bg-surface-subtle">
        ‹
      </button>
      <p class="text-14 text-text-primary backdrop-blur-xs">
        <span data-zone="index-image">{{numero-img}}</span>
        / 
        <span data-zone="total-images">{{total-img}}</span>
      </p>
      <button type="button" data-action="suivant" aria-label="Image suivante" class="flex h-10 w-10 items-center justify-center bg-background-subtle text-text-primary shadow hover:bg-surface-subtle">
        ›
      </button>
    </div>
    <div data-zone="miniatures" class="flex gap-2 overflow-x-auto"></div>
  </figcaption>
</figure>`,He={html:function(){return Ve},dom:function(e=[],t={}){let n=r(Ve),i=n.querySelector(`[data-zone="principale"]`),a=n.querySelector(`[data-zone="miniatures"]`),o=n.querySelector(`[data-action="precedent"]`),s=n.querySelector(`[data-action="suivant"]`),c=0,l=[],u=t.activeOrdre??null,d=n.querySelector(`[data-zone="index-image"]`),f=n.querySelector(`[data-zone="total-images"]`);f&&(f.textContent=String(e.length||1)),e.length<=1&&(o&&(o.hidden=!0),s&&(s.hidden=!0));let p=function(){if(u!==null){let t=e.findIndex(e=>e.ordre===u);if(t!==-1)return t}return 0},m=t=>{c=(t+e.length)%e.length,i.src=e[c].src,i.alt=e[c].alt||``,d&&(d.textContent=String(c+1)),l.forEach((e,t)=>e.setAttribute(`aria-current`,t===c?`true`:`false`))};return e.forEach((e,t)=>{let n=document.createElement(`button`);n.type=`button`,n.setAttribute(`aria-label`,`Voir l'image ${t+1}`),n.className=`h-16 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 aria-[current=true]:border-zinc-950 dark:aria-[current=true]:border-zinc-50`;let r=document.createElement(`img`);r.src=e.src,r.alt=``,r.className=`h-full w-full object-contain`,n.appendChild(r),n.addEventListener(`click`,()=>m(t)),a.appendChild(n),l.push(n)}),e.length>0&&m(p()),n}},Ue=`<a href="{{lien}}" data-link class="inline-flex items-center gap-1 text-14 text-text-secondary underline hover:text-text-primary hover:text-text-secondary c-lien-retour">← {{libelle}}</a>`,We={html:function(e={}){return n(Ue,{libelle:e.libelle??`Retour`,lien:e.lien??`#`})},dom:function(e={}){return r(We.html(e))}},Ge=`<fieldset class="flex flex-col gap-4 c-boutons-options">
  <legend class="sr-only">Options du produit</legend>
  <div data-zone="groupes" class="flex flex-col gap-4"></div>
</fieldset>`,Ke={html:function(){return Ge},dom:function(e={},t={}){let n=r(Ge),i=n.querySelector(`[data-zone="groupes"]`),a={...e.selection||{}};return(e.options||[]).forEach(e=>{let n=document.createElement(`div`);n.className=`flex flex-col gap-2`;let r=document.createElement(`p`);r.className=`text-sm font-medium text-zinc-900 dark:text-zinc-100`,r.textContent=`${e.nom} : ${a[e.nom]??`non choisi`}`,n.appendChild(r);let o=document.createElement(`div`);o.className=`flex flex-wrap gap-2`,e.valeurs.forEach(n=>{let i=(e.indisponibles||[]).includes(n),s=document.createElement(`label`);s.className=`cursor-pointer rounded-md border border-zinc-200 px-3 py-2 text-sm has-[:checked]:border-zinc-950 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40 dark:border-zinc-800 dark:text-zinc-100 dark:has-[:checked]:border-zinc-50`;let c=document.createElement(`input`);c.type=`radio`,c.name=e.nom,c.value=n,c.className=`sr-only`,c.disabled=i,c.checked=a[e.nom]===n,c.addEventListener(`change`,()=>{a[e.nom]=n,r.textContent=`${e.nom} : ${n}`,t.surChange&&t.surChange({...a})}),s.appendChild(c),s.append(i?`${n} (épuisé)`:n),o.appendChild(s)}),n.appendChild(o),i.appendChild(n)}),n}},qe=`<article class="flex flex-col gap-5 c-details-produit">\r
  <ol class="flex justify-start items-center gap-5">\r
    <li>\r
      <slot name="lien-retour-catalogue"></slot>\r
    </li>\r
    <li>\r
      <slot name="lien-retour-categorie"></slot>\r
    </li>\r
  </ol>\r
\r
  <figure class="flex flex-col gap-5 lg:flex-row">\r
    <slot name="galerie"></slot>\r
    <figcaption class="flex flex-col gap-5">\r
      <div class="flex items-start justify-between gap-4">\r
        <h1 class="text-30 font-semibold tracking-tight text-text-primary">{{nom}}</h1>\r
        <slot name="badge-stock"></slot>\r
      </div>\r
      <p class="text-24 font-bold text-text-primary">{{prix}} €</p>\r
\r
      <p class="text-14 leading-relaxed text-text-secondary">{{description}}</p>\r
\r
      <div data-zone="options"></div>\r
\r
      <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
        Quantité\r
        <slot name="quantite"></slot>\r
      </label>\r
\r
      <button type="button" data-action="ajouter-panier" class="flex h-11 w-full items-center justify-center rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">\r
        Ajouter au panier\r
      </button>\r
    </figcaption>\r
  </figure>\r
</article>`,Je={html:function(e={}){let t=typeof e.prixActuel==`number`?e.prixActuel.toFixed(2).replace(`.`,`,`):String(e.prixActuel||`0,00`);return n(qe,{nom:e.nom||``,prix:t,description:e.description||``})},dom:function(e={},t={}){let n=r(Je.html(e)),i=n.querySelector(`slot[name="badge-stock"]`);i&&i.replaceWith(D.dom({etat:e.etat,stock:e.stock,seuilAlerte:e.seuilAlerte}));let a=n.querySelector(`[data-zone="options"]`);a&&a.replaceWith(Ke.dom({options:e.options||[],selection:e.selection||{}},{surChange:n=>{let r=e.selection||{};for(let i of e.options||[]){let e=n[i.nom];e!==void 0&&e!==r[i.nom]&&t.surSelectionChange&&t.surSelectionChange(i.nom,e)}}}));let o=n.querySelector(`slot[name="quantite"]`);o&&o.replaceWith(P.dom({valeur:e.quantite??1,min:1,max:e.stock},{surChange:e=>{t.surQuantite&&t.surQuantite(e)}}));let s=n.querySelector(`slot[name="galerie"]`);s&&s.replaceWith(He.dom(e.images??[],{activeOrdre:e.activeOrdre}));let c=n.querySelector(`slot[name="lien-retour-catalogue"]`);c&&c.replaceWith(We.dom({libelle:e.libelleCatalogue??`Tous les produits`,lien:e.lienCatalogue??`/`}));let l=n.querySelector(`slot[name="lien-retour-categorie"]`);l&&l.replaceWith(We.dom({libelle:e.libelleCategorie??`Catégorie`,lien:e.lienCategorie??`/`}));let u=n.querySelector(`[data-action="ajouter-panier"]`),d=e.etat===`Épuisé`||e.stock===0;return u&&(d?(u.disabled=!0,u.textContent=`Épuisé`):t.surAjouterPanier&&u.addEventListener(`click`,()=>{t.surAjouterPanier(e.id)})),n}},Ye=`<section class="mx-auto max-w-6xl px-6 pt-10 pb-16">
  <slot name="ariane"></slot>

  <div data-zone="message"></div>

  <slot name="produit"></slot>
</section>
`,F={slug:null,produit:null,galerie:[],options:[],selection:{},quantite:1,message:null},I={};I.charger=async function(e){try{let t=await w.fetchBySlug(e);F.produit=t.produit,F.galerie=t.galerie,F.options=t.options??[],F.selection={},F.quantite=1,F.message=null}catch(e){F.produit=null,F.galerie=[],F.message={type:`erreur`,texte:e.statut===404?`Ce produit n'existe pas ou n'est plus disponible.`:`Impossible de charger ce produit : ${e.message}`}}},I.ordreImageActive=function(){if(F.produit===null)return null;for(let e of F.options){let t=F.selection[e.nom];if(t===void 0)continue;let n=(e.valeurs||[]).find(e=>e.valeur===t);if(n&&F.galerie.some(e=>e.ordre===n.ordre))return n.ordre}return null},I.produitAffichage=function(){if(F.produit===null)return null;let e=F.produit.categorie??null;return{...F.produit,images:F.galerie,options:F.options,selection:F.selection,quantite:F.quantite,activeOrdre:I.ordreImageActive(),prixBase:Number(F.produit.prix||0),prixActuel:I.prixActuel(),lienCatalogue:`/`,libelleCatalogue:`Tous les produits`,lienCategorie:e?.slug?`/categorie/${e.slug}`:`/`,libelleCategorie:e?.libelle??`Catégorie`}},I.filAriane=function(){let e=[{libelle:`Catalogue`,lien:`/`}],t=F.produit?.categorie;return t?.slug&&e.push({libelle:t.libelle,lien:`/categorie/${t.slug}`}),F.produit&&e.push({libelle:F.produit.nom}),e},I.prixActuel=function(){if(F.produit===null)return 0;let e=0;for(let t of F.options){let n=F.selection[t.nom],r=(t.valeurs||[]).find(e=>e.valeur===n);r&&(e+=r.prixSupplement||0)}return Number(F.produit.prix||0)+e},I.selectionnerOption=function(e,t){F.produit!==null&&(F.selection[e]=t,L.rafraichir())},I.handler_quantite=function(e){F.quantite=Math.max(1,Math.floor(Number(e)||1))},I.handler_ajouterPanier=async function(e){if(F.produit===null)return;let t=e??F.produit.id,n=Number(F.produit.stock)||0,r=F.quantite;if(n<=0){F.message={type:`erreur`,texte:`Ce produit est épuisé et ne peut pas être ajouté au panier.`},L.majMessage();return}r>n&&(r=n,F.message={type:`erreur`,texte:`La quantité demandée dépasse le stock disponible (${n} maximum). La quantité a été ajustée.`});let i=_().find(e=>String(e.id)===String(t)),a=Number(i?.quantite||0),o;try{o=await g([{id:t,quantite:a+r}])}catch{o=null}let s=o?.lignes?.[0];if(s&&!s.estValide){let e=Number(s.quantiteMax)||0;if(r=Math.max(0,e-a),r<=0){F.message={type:`erreur`,texte:s.message||`Ce produit est épuisé.`},L.majMessage();return}F.message={type:`erreur`,texte:`${s.message||``} La quantité a été ajustée à ${r} (maximum autorisé : ${e} au total).`}}else(!F.message||F.message.type!==`erreur`)&&(F.message={type:`succes`,texte:`${F.produit.nom} a été ajouté au panier.`});te({id:t,slug:F.produit.slug,nom:F.produit.nom,prix:I.prixActuel(),stock:F.produit.stock,src:F.galerie[0]?.src??``,options:{...F.selection}},r),L.majMessage()},I.majSeo=function(){if(F.produit===null){ze({titre:`Produit introuvable`,description:`Ce produit n'existe pas ou n'est plus disponible.`,chemin:`/`});return}let e=(F.produit.description||``).slice(0,300).trim()||`Fiche produit : ${F.produit.nom}.`;ze({titre:F.produit.nom,description:e,image:F.galerie[0]?.src??``,chemin:`/produit/${F.produit.slug}`,type:`product`})},I.init=async function(e){return F.slug=e??null,await I.charger(F.slug),I.majSeo(),L.init()};var L={};L.racine=null,L.zoneMessage=null,L.init=function(){let e=L.createPageFragment();return L.racine=e.firstElementChild,e},L.rafraichir=function(){let e=L.createPageFragment(),t=e.firstElementChild;L.racine.replaceWith(e),L.racine=t},L.majMessage=function(){L.zoneMessage!==null&&L.zoneMessage.replaceChildren(O.dom(F.message))},L.createPageFragment=function(){let e=r(Ye);e.querySelector(`slot[name="ariane"]`).replaceWith(xe.dom(I.filAriane())),L.zoneMessage=e.querySelector(`[data-zone="message"]`),L.zoneMessage.replaceChildren(O.dom(F.message));let t=e.querySelector(`slot[name="produit"]`);if(F.produit===null){for(let t of e.querySelectorAll(`slot`))t.remove();return e}return t.replaceWith(Je.dom(I.produitAffichage(),{surAjouterPanier:I.handler_ajouterPanier,surSelectionChange:I.selectionnerOption,surQuantite:I.handler_quantite})),e};function Xe(e={}){return I.init(e.slug??e.Slug??null)}var R={};R.login=async function(e,t){return f(`login`,{login:e,mdp:t})},R.logout=async function(){return f(`logout`)};var Ze={};Ze.fetch=async function(){return d(`admin/stats`)};var Qe=`<section class="mb-6 rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-formulaires-admin-connexionadmin">
  <h2 class="mb-1 text-24 font-semibold tracking-tight text-text-primary">Connexion administrateur</h2>
  <p class="mb-5 text-14 text-text-secondary">Accès réservé à l'équipe de gestion Action</p>

  <form class="flex flex-col gap-4">
    <slot name="message"></slot>

    <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
      Identifiant
      <input name="login" type="text" autocomplete="username" required value="{{login}}" placeholder="Identifiant ou email" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
    </label>

    <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
      Mot de passe
      <input name="mdp" type="password" autocomplete="current-password" required placeholder="••••••••" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
    </label>

    <button type="submit" class="mt-2 h-10 w-full rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text transition-opacity hover:opacity-90">
      Se connecter
    </button>
  </form>
</section>
`,$e={html:function(e={}){return n(Qe,{login:e?.login||``})},dom:function(e={},t={}){let n=r($e.html(e)),i=n.querySelector(`form`);return i&&i.addEventListener(`submit`,e=>{e.preventDefault(),t.surConnexion&&t.surConnexion(i.elements.login.value.trim(),i.elements.mdp.value)}),n}},et=`<section class="mb-6 rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-statistiques">
  <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
    <div>
      <h2 class="text-20 font-semibold tracking-tight text-text-primary">Tableau de bord de l'activité</h2>
      <p class="text-12 text-text-secondary">Indicateurs clés et suivi des ventes Click & Collect</p>
    </div>
    <div class="flex gap-2">
      <slot name="export-stats"></slot>
    </div>
  </div>

  <!-- Cartes d'indicateurs clés -->
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
    <div class="rounded-lg border bg-surface-subtle p-4 border-border-default">
      <div class="text-24 font-bold tracking-tight text-text-link">{{revenus7j}} €</div>
      <div class="text-12 font-medium text-text-secondary">Revenus (7 jours)</div>
    </div>
    <div class="rounded-lg border bg-surface-subtle p-4 border-border-default">
      <div class="text-24 font-bold tracking-tight text-text-primary">{{totalCommandes}}</div>
      <div class="text-12 font-medium text-text-secondary">Commandes passées</div>
    </div>
    <div class="rounded-lg border bg-surface-subtle p-4 border-border-default">
      <div class="text-24 font-bold tracking-tight text-text-primary">{{totalProduits}}</div>
      <div class="text-12 font-medium text-text-secondary">Produits au catalogue</div>
    </div>
    <div class="rounded-lg border border-status-warning-indicator bg-status-warning-background p-4">
      <div class="text-24 font-bold tracking-tight text-status-warning-text">{{alertesStock}}</div>
      <div class="text-12 font-medium text-status-warning-text">Stocks faibles ou épuisés</div>
    </div>
  </div>

  <!-- Commandes par statut -->
  <div class="mt-6 border-t pt-5 border-border-default">
    <h3 class="mb-3 text-14 font-semibold text-text-primary">Commandes par statut</h3>
    <div data-zone="statuts-commandes" class="grid grid-cols-2 gap-3 sm:grid-cols-4 text-12"></div>
  </div>

  <!-- Graphique des stocks par produit (Histogramme CSS) -->
  <div class="mt-6 border-t pt-5 border-border-default">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-14 font-semibold text-text-primary">Niveaux de stock par produit</h3>
      <span class="text-12 text-text-secondary">Unités restantes</span>
    </div>
    <div data-zone="graphique-stocks" class="flex flex-col gap-2.5"></div>
  </div>

  <!-- Produits les plus vendus -->
  <div class="mt-6 border-t pt-5 border-border-default">
    <h3 class="mb-3 text-14 font-semibold text-text-primary">Top des ventes</h3>
    <ul data-zone="top-ventes" class="divide-y divide-border-subtle text-14"></ul>
  </div>
</section>
`,tt=`<li class="flex items-center justify-between py-2.5 c-statistiques__ligne-stats">
  <div class="flex items-center gap-2">
    <span class="font-medium text-text-primary">{{nom}}</span>
    <span class="text-12 text-text-secondary">({{detail}})</span>
  </div>
  <span class="font-semibold text-text-primary">{{valeur}}</span>
</li>
`,nt={html:function(e={}){return n(et,{revenus7j:typeof e.revenus7j==`number`?e.revenus7j.toFixed(2).replace(`.`,`,`):`0,00`,totalCommandes:e.totalCommandes??0,totalProduits:e.totalProduits??0,alertesStock:e.alertesStock??0})},dom:function(e={}){let t=r(nt.html(e)),i=t.querySelector(`[data-zone="statuts-commandes"]`);i&&Array.isArray(e.statutsCommandes)&&e.statutsCommandes.forEach(e=>{let t=document.createElement(`div`);t.className=`flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950`,t.innerHTML=`
          <span class="capitalize text-zinc-600 dark:text-zinc-400">${e.statut}</span>
          <span class="font-bold text-zinc-900 dark:text-zinc-100">${e.nombre}</span>
        `,i.appendChild(t)});let a=t.querySelector(`[data-zone="graphique-stocks"]`);if(a&&Array.isArray(e.stocksParProduit)){let t=Math.max(...e.stocksParProduit.map(e=>e.stock||0),1);e.stocksParProduit.forEach(e=>{let n=Math.max(5,Math.round((e.stock||0)/t*100)),r=(e.stock||0)<=(e.seuilAlerte??5),i=document.createElement(`div`);i.className=`flex items-center gap-3 text-xs`;let o=document.createElement(`span`);o.className=`w-40 shrink-0 truncate text-zinc-700 dark:text-zinc-300`,o.textContent=e.nom,o.title=e.nom;let s=document.createElement(`div`);s.className=`h-4 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800`;let c=document.createElement(`div`);c.className=r?`h-full rounded-full bg-amber-500 transition-all duration-300`:`h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300`,c.style.width=`${n}%`;let l=document.createElement(`span`);l.className=`w-8 text-right font-medium text-zinc-900 dark:text-zinc-100`,l.textContent=e.stock,s.appendChild(c),i.append(o,s,l),a.appendChild(i)})}let o=t.querySelector(`[data-zone="top-ventes"]`);return o&&Array.isArray(e.topVentes)&&e.topVentes.forEach(e=>{let t=n(tt,{nom:e.nom||`Article`,detail:`${e.quantite||0} vendus`,valeur:e.totalVentes?`${Number(e.totalVentes).toFixed(2).replace(`.`,`,`)} €`:``});o.appendChild(r(t))}),t}},rt=`<section class="mx-auto max-w-2xl px-6 pt-10 pb-16">
  <slot name="connexion"></slot>
  <slot name="message"></slot>
  <slot name="statistiques"></slot>
</section>
`,z={login:``,stats:null,message:null},B={};B.chargerStats=async function(){try{z.stats=await Ze.fetch(),a(!0)}catch(e){z.stats=null,a(!1);let t=e.message;e.statut===401&&(t=`Vous n'êtes pas connecté.`),e.statut===403&&(t=`Accès réservé aux administrateurs.`),z.message={type:`erreur`,texte:t}}},B.handler_connexion=async function(e,t){z.login=e;try{await R.login(e,t),z.message={type:`succes`,texte:`Connecté en tant que ${e}.`},await B.chargerStats()}catch(e){z.message={type:`erreur`,texte:e.message}}V.rafraichir()},B.handler_deconnexion=async function(){try{await R.logout(),z.message=null,await B.chargerStats()}catch(e){z.message={type:`erreur`,texte:e.message}}V.rafraichir(),document.dispatchEvent(new Event(`admin:deconnexion-terminee`))},document.addEventListener(`admin:quitter`,()=>{R.logout().catch(()=>{}),a(!1)}),B.init=async function(){return z.message=null,await B.chargerStats(),V.init()};var V={};V.racine=null,V.init=function(){let e=V.createPageFragment();return V.racine=e.firstElementChild,e},V.rafraichir=function(){let e=V.createPageFragment(),t=e.firstElementChild;V.racine.replaceWith(e),V.racine=t},V.createPageFragment=function(){let e=r(rt),t=e.querySelector(`slot[name="connexion"]`);z.stats===null?t.replaceWith($e.dom({login:z.login},{surConnexion:B.handler_connexion,surDeconnexion:B.handler_deconnexion})):t.remove(),e.querySelector(`slot[name="message"]`).replaceWith(O.dom(z.message));let n=e.querySelector(`slot[name="statistiques"]`);return z.stats===null?n.remove():n.replaceWith(nt.dom(z.stats)),e};function it(){return B.init()}var at=`<section aria-labelledby="titre-formulaire-categorie" class="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
    <h2 id="titre-formulaire-categorie" class="mb-4 text-xl font-semibold text-zinc-950 dark:text-zinc-50">{{titre}}</h2>

    <form novalidate class="flex flex-col gap-4">
        <label class="flex flex-col gap-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Nom *
            <input name="libelle" type="text" required maxlength="100" autocomplete="off" class="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm font-normal dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
        </label>

        <label class="flex flex-col gap-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Description
            <textarea name="description" rows="3" maxlength="500" class="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-normal dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"></textarea>
        </label>

        <div class="flex justify-end gap-3">
            <button type="button" data-action="annuler" class="h-10 rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800">Annuler</button>
            <button type="submit" class="h-10 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900">Enregistrer</button>
        </div>
    </form>
</section>
`,ot={html:function(e={}){return n(at,{titre:e.id?`Modifier la catégorie`:`Nouvelle catégorie`})},dom:function(e={},t={}){let n=r(ot.html(e)),i=n.querySelector(`form`);return i.elements.libelle.value=e.nom??``,i.elements.description.value=e.description??``,i.addEventListener(`submit`,e=>{e.preventDefault(),t.surEnregistrer?.({libelle:i.elements.libelle.value,description:i.elements.description.value})}),n.querySelector(`[data-action="annuler"]`).addEventListener(`click`,()=>{t.surAnnuler?.()}),n}},st=`<div data-zone="overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <section role="dialog" aria-modal="true" aria-labelledby="titre-suppr-categorie" class="max-h-screen w-full max-w-lg overflow-y-auto rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-formulaires-admin-suppressioncategorie">
        <h2 id="titre-suppr-categorie" class="mb-2 text-20 font-semibold text-text-primary">Supprimer la catégorie « {{nom}} » ?</h2>
        <p data-zone="info" class="mb-4 text-14 text-text-secondary"></p>

        <label data-zone="reaffectation" class="mb-5 flex flex-col gap-1.5 text-14 font-medium text-text-primary">
            Réaffecter ses produits à
            <select name="cible" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary"></select>
        </label>

        <p data-zone="erreur" role="alert" class="mb-4 hidden text-14 text-status-warning-text"></p>

        <div class="flex justify-end gap-3">
            <button type="button" data-action="fermer" class="h-10 rounded-md border px-4 text-14 font-medium text-text-secondary hover:bg-surface-subtle border-border-default">Annuler</button>
            <button type="button" data-action="confirmer" class="h-10 rounded-md bg-status-warning-background px-4 text-14 font-medium text-action-primary-text hover:opacity-90 disabled:opacity-40">Supprimer</button>
        </div>
    </section>
</div>`,ct={html:function(e={}){return n(st,{nom:e.nom??``})},dom:function(e={},t={}){let n=r(ct.html(e)),i=n.querySelector(`[data-zone="info"]`),a=n.querySelector(`[data-zone="reaffectation"]`),o=a.querySelector(`select`),s=n.querySelector(`[data-zone="erreur"]`),c=n.querySelector(`[data-action="confirmer"]`),l=Number(e.nbProduits||0),u=e.categories||[];return l===0?(i.textContent=`Cette catégorie ne contient aucun produit.`,a.hidden=!0):(i.textContent=`Elle contient ${l} produit${l>1?`s`:``}.`,u.length===0?(s.textContent=`Impossible de supprimer : créez d'abord une autre catégorie pour y réaffecter ses produits.`,s.classList.remove(`hidden`),c.disabled=!0,a.hidden=!0):u.forEach(e=>{let t=document.createElement(`option`);t.value=e.id,t.textContent=e.nom,o.appendChild(t)})),c.addEventListener(`click`,()=>{let n=l>0?o.value:null;t.surConfirmer?.(e.id,n)}),n.querySelectorAll(`[data-action="fermer"]`).forEach(e=>e.addEventListener(`click`,()=>t.surFermer?.())),n}},lt=`<section class="mb-6 overflow-x-auto rounded-lg border bg-surface-default shadow-xs border-border-default c-tableaux-recapitulatifs-admin-categories">
    <table class="w-full text-left text-14">
        <thead class="bg-surface-subtle text-text-secondary">
        <tr>
            <th scope="col" class="px-4 py-3 font-medium">Nom</th>
            <th scope="col" class="px-4 py-3 font-medium">Description</th>
            <th scope="col" class="px-4 py-3 font-medium">Produits</th>
            <th scope="col" class="px-4 py-3 font-medium"><span class="sr-only">Actions</span></th>
        </tr>
        </thead>
        <tbody data-zone="lignes" class="divide-y divide-border-subtle"></tbody>
    </table>
</section>`,ut=`<tr class="text-zinc-900 dark:text-zinc-100">
  <td class="px-4 py-3 font-medium">{{nom}}</td>
  <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">{{description}}</td>
  <td class="px-4 py-3">{{nbProduits}}</td>
  <td class="whitespace-nowrap px-4 py-3 text-right">
    <button type="button" data-action="modifier" data-id="{{id}}" class="mr-3 text-blue-600 underline hover:text-blue-700 dark:text-blue-400">Modifier</button>
    <button type="button" data-action="supprimer" data-id="{{id}}" class="text-red-700 underline hover:text-red-900 dark:text-red-400">Supprimer</button>
  </td>
</tr>`,dt={html:function(){return lt},dom:function(e=[],t={}){let i=r(lt),a=i.querySelector(`[data-zone="lignes"]`);return a.innerHTML=e.length?e.map(e=>n(ut,e)).join(``):`<tr><td colspan="4" class="px-4 py-6 text-center text-zinc-500">Aucune catégorie pour le moment.</td></tr>`,a.addEventListener(`click`,e=>{let n=e.target.closest(`[data-action]`);if(!n)return;let r=n.dataset.id;n.dataset.action===`modifier`&&t.surModifier?.(r),n.dataset.action===`supprimer`&&t.surSupprimer?.(r)}),i}},ft=`<section class="mx-auto max-w-4xl px-6 pt-10 pb-16">\r
    <div data-zone="entete" class="mb-6 flex flex-wrap items-center justify-between gap-4">\r
        <h1 class="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Gestion des catégories</h1>\r
        <button type="button" data-action="creer" class="h-10 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900">Nouvelle catégorie</button>\r
    </div>\r
\r
    <p data-zone="acces" hidden class="mb-6 text-sm text-zinc-600 dark:text-zinc-300">\r
        Cette page est réservée à l'administrateur.\r
        <a href="/admin" data-link class="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400">Se connecter</a>.\r
    </p>\r
\r
    <slot name="message"></slot>\r
    <slot name="formulaire"></slot>\r
    <slot name="suppression"></slot>\r
    <slot name="barre-outils"></slot>\r
    <slot name="tableau"></slot>\r
    <slot name="pagination"></slot>\r
</section>\r
`,pt=100,mt=500,H={acces:null,categories:[],tri:`nom`,parPage:12,page:1,pagesTotal:1,total:0,toutesCategories:[],message:null,edition:null,suppression:null},U={};U.chargerCategories=async function(e=H.page,t=H.tri,n=H.parPage){try{let r=await S.fetchAdminPage(e,t,n);H.categories=r.categories,H.tri=r.tri,H.parPage=r.parPage,H.page=r.page,H.pagesTotal=r.pagesTotal,H.total=r.total,H.acces=`ok`,a(!0)}catch(e){H.categories=[],e instanceof c&&e.statut===401?(H.acces=`non-connecte`,a(!1)):e instanceof c&&e.statut===403?(H.acces=`refuse`,a(!1)):H.message={type:`erreur`,texte:e.message}}},U.handler_changerTri=async function(e){await U.chargerCategories(1,e,H.parPage),W.rafraichir()},U.handler_changerParPage=async function(e){await U.chargerCategories(1,H.tri,e),W.rafraichir()},U.handler_changerPage=async function(e){await U.chargerCategories(e,H.tri,H.parPage),W.rafraichir(),window.scrollTo({top:0,behavior:`smooth`})},U.trouverCategorie=function(e){return H.categories.find(t=>String(t.id)===String(e))??null},U.validerFormulaire=function({libelle:e,description:t}){return e.trim()===``?`Le nom de la catégorie est obligatoire.`:e.trim().length>pt?`Le nom ne doit pas dépasser ${pt} caractères.`:t.trim().length>mt?`La description ne doit pas dépasser ${mt} caractères.`:null},U.handler_ouvrirCreation=function(){H.edition={id:null,nom:``,description:``},H.suppression=null,H.message=null,W.rafraichir()},U.handler_ouvrirModification=function(e){let t=U.trouverCategorie(e);t&&(H.edition={id:t.id,nom:t.nom,description:t.description},H.suppression=null,H.message=null,W.rafraichir())},U.handler_annulerFormulaire=function(){H.edition=null,W.rafraichir()},U.handler_enregistrer=async function(e){H.edition={...H.edition,nom:e.libelle,description:e.description};let t=U.validerFormulaire(e);if(t){H.message={type:`erreur`,texte:t},W.rafraichir();return}let n={libelle:e.libelle.trim(),description:e.description.trim()};try{H.edition.id===null?(await S.creer(n),H.message={type:`succes`,texte:`Catégorie « ${n.libelle} » créée.`}):(await S.modifier(H.edition.id,n),H.message={type:`succes`,texte:`Catégorie « ${n.libelle} » modifiée.`}),H.edition=null,await U.chargerCategories()}catch(e){H.message={type:`erreur`,texte:e.message}}W.rafraichir()},U.handler_demanderSuppression=async function(e){let t=U.trouverCategorie(e);if(t){try{H.toutesCategories=await S.fetchAdminListe(H.tri)}catch(e){H.message={type:`erreur`,texte:e.message},W.rafraichir();return}H.suppression=t,H.edition=null,H.message=null,W.rafraichir()}},U.handler_annulerSuppression=function(){H.suppression=null,W.rafraichir()},U.handler_confirmerSuppression=async function(e,t){let n=U.trouverCategorie(e)?.nom??``;try{await S.supprimer(e,t),H.suppression=null,H.message={type:`succes`,texte:`Catégorie « ${n} » supprimée.`},await U.chargerCategories()}catch(e){H.message={type:`erreur`,texte:e.message}}W.rafraichir()},U.handler_deconnexion=async function(){if(W.racine?.isConnected){try{await R.logout(),H.message={type:`info`,texte:`Vous êtes déconnecté.`}}catch(e){H.message={type:`erreur`,texte:e.message}}H.acces=`non-connecte`,H.categories=[],a(!1),H.edition=null,H.suppression=null,W.rafraichir(),document.dispatchEvent(new Event(`admin:deconnexion-terminee`))}},document.addEventListener(`admin:deconnexion`,U.handler_deconnexion),U.init=async function(){return H.message=null,H.edition=null,H.suppression=null,await U.chargerCategories(),W.init()};var W={};W.racine=null,W.init=function(){let e=W.createPageFragment();return W.racine=e.firstElementChild,e},W.rafraichir=function(){let e=W.createPageFragment(),t=e.firstElementChild;W.racine.replaceWith(e),W.racine=t},W.createPageFragment=function(){let e=r(ft),t=H.acces===`ok`,n=H.edition!==null,i=e.querySelector(`[data-action="creer"]`);return i.hidden=!t||n,i.addEventListener(`click`,U.handler_ouvrirCreation),e.querySelector(`[data-zone="entete"]`).hidden=n,e.querySelector(`[data-zone="acces"]`).hidden=t,e.querySelector(`slot[name="message"]`).replaceWith(O.dom(H.message)),e.querySelector(`slot[name="formulaire"]`).replaceWith(H.edition?ot.dom(H.edition,{surEnregistrer:U.handler_enregistrer,surAnnuler:U.handler_annulerFormulaire}):``),e.querySelector(`slot[name="suppression"]`).replaceWith(H.suppression?ct.dom({id:H.suppression.id,nom:H.suppression.nom,nbProduits:H.suppression.nbProduits,categories:H.toutesCategories.filter(e=>e.id!==H.suppression.id).map(e=>({id:e.id,nom:e.nom}))},{surConfirmer:U.handler_confirmerSuppression,surFermer:U.handler_annulerSuppression}):``),e.querySelector(`slot[name="barre-outils"]`).replaceWith(t&&!n?E.dom({tri:H.tri,parPage:H.parPage,total:H.total,libelleTotal:`catégories`,libelleParPage:`Catégories par page`,libelleUnite:`catégories`,optionsTri:[{valeur:`nom`,libelle:`Nom (A → Z)`},{valeur:`produits_asc`,libelle:`Nombre de produits (croissant)`},{valeur:`produits_desc`,libelle:`Nombre de produits (décroissant)`}]},{surTri:U.handler_changerTri,surParPage:U.handler_changerParPage}):``),e.querySelector(`slot[name="tableau"]`).replaceWith(t&&!n?dt.dom(H.categories,{surModifier:U.handler_ouvrirModification,surSupprimer:U.handler_demanderSuppression}):``),e.querySelector(`slot[name="pagination"]`).replaceWith(t&&!n?k.dom(H,{surPage:U.handler_changerPage}):``),e};function ht(){return U.init()}var gt=`<section class="mb-6 rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-formulaires-forms-produit">\r
    <h2 class="mb-4 text-24 font-semibold tracking-tight text-text-primary">{{titre}}</h2>\r
\r
    <form class="flex flex-col gap-4" novalidate>\r
        <p data-zone="message" role="alert" class="hidden rounded-md border border-status-warning-indicator p-3 text-14 text-status-warning-text"></p>\r
\r
        <div class="grid gap-4 sm:grid-cols-2">\r
            <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                Nom du produit\r
                <input name="nom" type="text" required maxlength="160" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
            </label>\r
\r
            <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                Référence\r
                <input name="reference" type="text" maxlength="20" placeholder="Générée si vide" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
            </label>\r
\r
            <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                Catégorie\r
                <select name="categorieId" required data-zone="categories" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary"></select>\r
            </label>\r
\r
            <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                Marque\r
                <input name="marque" type="text" maxlength="80" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
            </label>\r
\r
            <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                Format\r
                <input name="format" type="text" maxlength="120" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
            </label>\r
\r
            <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                Badge\r
                <input name="badge" type="text" maxlength="40" placeholder="Nouveau, Promo…" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
            </label>\r
        </div>\r
\r
        <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
            Description\r
            <textarea name="description" rows="4" maxlength="2000" class="rounded-md border bg-surface-default px-3 py-2 text-14 font-normal border-border-default text-text-primary"></textarea>\r
        </label>\r
\r
        <div class="grid gap-4 sm:grid-cols-3">\r
            <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                Prix (€)\r
                <input name="prix" type="number" min="0" max="9999.99" step="0.01" required class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
            </label>\r
\r
            <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                Prix unitaire (€)\r
                <input name="prixUnitaire" type="number" min="0" max="9999.99" step="0.01" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
            </label>\r
\r
            <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                Unité de prix\r
                <input name="unitePrix" type="text" maxlength="10" placeholder="€/m²" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
            </label>\r
        </div>\r
\r
        <div class="grid gap-4 sm:grid-cols-2">\r
            <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                Stock\r
                <input name="stock" type="number" min="0" max="65535" step="1" required class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
            </label>\r
\r
            <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                Seuil « Bientôt épuisé »\r
                <input name="seuilAlerte" type="number" min="0" max="255" step="1" required class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
            </label>\r
        </div>\r
\r
        <div class="flex flex-col gap-2">\r
            <p class="text-14 font-medium text-text-primary">Images actuelles</p>\r
            <ul data-zone="images" class="flex flex-wrap gap-3">\r
                <li data-zone="images-vide" class="text-14 text-text-secondary">Aucune image pour le moment.</li>\r
            </ul>\r
        </div>\r
\r
        <div class="flex flex-col gap-2">\r
            <p class="text-14 font-medium text-text-primary">Ajouter une ou plusieurs images</p>\r
            <label data-zone="depot-image" class="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border-default bg-surface-subtle p-5 text-center hover:border-border-strong focus-within:outline-2 focus-within:outline-border-focus">\r
                <input name="image" type="file" accept="image/avif,image/jpeg,image/png,image/webp" multiple data-zone="fichier-image" class="sr-only" />\r
                <svg aria-hidden="true" class="size-6 text-text-secondary" viewBox="0 0 24 24" fill="currentColor">\r
                    <use href="#icon-download"></use>\r
                </svg>\r
                <span class="text-14 text-text-primary">Glissez une ou plusieurs images ici ou <span class="text-text-link underline">parcourir</span></span>\r
                <span class="text-12 text-text-secondary">AVIF, JPG/JPEG, PNG ou WebP · 5 Mo chacune · plusieurs images possibles</span>\r
            </label>\r
            <div data-zone="fichiers-selectionnes" class="hidden flex flex-col gap-2 rounded-md border border-border-default bg-surface-default p-3"></div>\r
        </div>\r
\r
        <div data-zone="options" class="mt-6 border-t border-border-default pt-4 c-formulaires-forms-produit__options">\r
            <h3 class="mb-3 text-14 font-medium text-text-primary">Options de personnalisation</h3>\r
            <div data-zone="options-liste" class="flex flex-col gap-3"></div>\r
            <div class="mt-2 flex flex-wrap gap-3">\r
                <input name="nouvelleOptionNom" type="text" placeholder="Nom de l'option (ex. Couleur)" class="rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
                <input name="nouvelleOptionOrdre" type="number" min="0" max="255" value="1" placeholder="Ordre" class="h-10 w-24 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
                <button type="button" data-action="ajouter-option" class="h-10 rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text hover:opacity-90">Ajouter l'option</button>\r
            </div>\r
            <p class="mt-2 text-12 text-text-secondary">Chaque valeur peut prévoir un supplément de prix (ex. « Beige » +2,00 €). L'ordre d'une valeur désigne l'image de la galerie qui s'affiche quand elle est choisie.</p>\r
        </div>\r
\r
        <div class="mt-2 flex justify-end gap-3">\r
            <button type="button" data-action="annuler" class="h-10 rounded-md border px-4 text-14 font-medium text-text-secondary hover:bg-surface-subtle border-border-default">Annuler</button>\r
            <button type="submit" class="h-10 rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text hover:opacity-90">Enregistrer</button>\r
        </div>\r
    </form>\r
</section>`,_t=5242880,vt=[`image/avif`,`image/jpeg`,`image/png`,`image/webp`],G={html:function(e={}){return n(gt,{titre:e.id?`Modifier le produit`:`Nouveau produit`})},valider:function(e){if(!e.nom.trim())return`Le nom du produit est obligatoire.`;if(e.nom.trim().length>160)return`Le nom ne doit pas dépasser 160 caractères.`;if(!e.categorieId)return`Choisissez une catégorie.`;if(e.prix===``||Number(e.prix)<0||Number(e.prix)>9999.99)return`Le prix doit être un nombre positif, par exemple 12,95.`;if(e.prixUnitaire!==``&&(Number(e.prixUnitaire)<0||Number(e.prixUnitaire)>9999.99))return`Le prix unitaire doit être un nombre positif.`;if(!Number.isInteger(Number(e.stock))||Number(e.stock)<0)return`Le stock doit être un nombre entier positif ou nul.`;if(!Number.isInteger(Number(e.seuilAlerte))||Number(e.seuilAlerte)<0)return`Le seuil d'alerte doit être un nombre entier positif ou nul.`;if(Array.isArray(e.images)){for(let t of e.images)if(t instanceof File&&t.size!==0){if(!vt.includes(t.type))return`Le format de l'image doit être AVIF, JPG/JPEG, PNG ou WebP.`;if(t.size>_t)return`L'image « `+t.name+` » est trop lourde : 5 Mo maximum.`}}return null},dom:function(e={},t={}){let n=r(G.html(e)),i=n.querySelector(`form`),a=n.querySelector(`[data-zone="message"]`),o=n.querySelector(`[data-zone="categories"]`),s=n.querySelector(`[data-zone="fichier-image"]`),c=n.querySelector(`[data-zone="depot-image"]`),l=n.querySelector(`[data-zone="fichiers-selectionnes"]`),u=e.valeurs??{},d=Array.isArray(u.images)?[...u.images]:[],f=function(e){return Math.max(1,Math.ceil(e.size/1024))+` Ko`},p=function(e){d.splice(e,1),m()},m=function(){l.innerHTML=``,d.length===0?(l.classList.add(`hidden`),l.classList.remove(`flex`)):(d.forEach((e,t)=>{let n=G.valider({nom:`ok`,categorieId:`ok`,prix:`0`,prixUnitaire:``,stock:`0`,seuilAlerte:`0`,images:[e]}),r=document.createElement(`div`);r.className=`flex items-center justify-between gap-3 rounded-md border p-2 `+(n?`border-status-danger-indicator bg-status-danger-subtle`:`border-border-default bg-surface-default`);let i=document.createElement(`div`);i.className=`flex min-w-0 flex-col`;let a=document.createElement(`span`);a.className=`truncate text-14 font-medium text-text-primary`,a.textContent=e.name;let o=document.createElement(`span`);if(o.className=`text-12 text-text-secondary`,o.textContent=f(e),i.append(a,o),n){let e=document.createElement(`span`);e.className=`text-12 text-status-danger-text`,e.textContent=n,r.append(i,e)}else{let e=document.createElement(`button`);e.type=`button`,e.textContent=`Retirer`,e.className=`shrink-0 rounded-md px-3 py-2 text-14 text-text-secondary hover:bg-surface-subtle`,e.addEventListener(`click`,()=>p(t)),r.append(i,e)}l.appendChild(r)}),l.classList.remove(`hidden`),l.classList.add(`flex`))};s.addEventListener(`change`,()=>{for(let e of s.files)d.push(e);s.value=``,m()}),[`dragenter`,`dragover`].forEach(e=>{c.addEventListener(e,e=>{e.preventDefault(),c.classList.add(`border-border-strong`,`bg-surface-info`)})}),[`dragleave`,`drop`].forEach(e=>{c.addEventListener(e,e=>{e.preventDefault(),c.classList.remove(`border-border-strong`,`bg-surface-info`)})}),c.addEventListener(`drop`,e=>{for(let t of e.dataTransfer.files)d.push(t);m()});let h=i.elements;h.nom.value=u.nom??``,h.reference.value=u.reference??``,h.marque.value=u.marque??``,h.format.value=u.format??``,h.badge.value=u.badge??``,h.description.value=u.description??``,h.prix.value=u.prix??``,h.prixUnitaire.value=u.prixUnitaire??``,h.unitePrix.value=u.unitePrix??``,h.stock.value=u.stock??0,h.seuilAlerte.value=u.seuilAlerte??5,(t.categories||[]).forEach(e=>{let t=document.createElement(`option`);t.value=e.id,t.textContent=e.nom,t.selected=String(e.id)===String(u.categorieId??``),o.appendChild(t)});let ee=n.querySelector(`[data-zone="images"]`),g=n.querySelector(`[data-zone="images-vide"]`),_=e.images??[];_.length>0&&g.remove(),_.forEach(e=>{let n=document.createElement(`li`);n.className=`flex flex-col items-start gap-2`;let r=document.createElement(`img`);r.src=e.src,r.alt=e.alt,r.className=`h-24 w-24 rounded-md border object-cover border-border-default`;let a=document.createElement(`button`);a.type=`button`,a.textContent=`Supprimer l'image`,a.className=`text-12 text-red-700 underline hover:text-red-900 dark:text-red-400`,a.addEventListener(`click`,()=>{t.surSupprimerImage?.(e.id,G.lireSaisie(i,d))}),n.append(r,a),ee.appendChild(n)}),n.querySelector(`[data-zone="options"]`);let v=n.querySelector(`[data-zone="options-liste"]`),y=(e,t)=>{let n=e.querySelector(`[name="${t}"]`);return n?n.value:``},te=function(e){let n=document.createElement(`div`);n.className=`flex flex-wrap gap-2 items-end`,n.dataset.valeurId=e.id;let r=document.createElement(`input`);r.type=`text`,r.name=`valeurValeur`,r.value=e.valeur,r.placeholder=`Valeur (ex. Blanc)`,r.className=`rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`,r.maxLength=80;let i=document.createElement(`input`);i.type=`number`,i.name=`valeurPrix`,i.min=`0`,i.max=`9999.99`,i.step=`0.01`,i.value=String(e.prixSupplement??0),i.placeholder=`0,00`,i.className=`h-9 w-24 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`;let a=document.createElement(`input`);a.type=`number`,a.name=`valeurOrdre`,a.min=`0`,a.max=`255`,a.value=String(e.ordre??1),a.className=`h-9 w-20 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`;let o=document.createElement(`button`);o.type=`button`,o.textContent=`Enregistrer`,o.className=`h-9 rounded-md text-12 text-text-secondary underline hover:text-text-primary`,o.addEventListener(`click`,()=>{t.surModifierValeur?.(Number(n.dataset.valeurId),y(n,`valeurValeur`),y(n,`valeurPrix`),Number(y(n,`valeurOrdre`)||1))});let s=document.createElement(`button`);return s.type=`button`,s.textContent=`Supprimer`,s.className=`h-9 rounded-md text-12 text-red-700 underline hover:text-red-900 dark:text-red-400`,s.addEventListener(`click`,()=>{t.surSupprimerValeur?.(Number(n.dataset.valeurId))}),n.append(r,i,a,o,s),n},ne=function(e){let n=document.createElement(`div`);n.className=`flex flex-col gap-3 rounded-md border p-3`,n.dataset.optionId=e.id;let r=document.createElement(`div`);r.className=`flex flex-wrap gap-3 items-end`;let i=document.createElement(`input`);i.type=`text`,i.name=`optionNom`,i.value=e.nom,i.placeholder=`Nom de l'option`,i.className=`rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`,i.maxLength=80;let a=document.createElement(`input`);a.type=`number`,a.name=`optionOrdre`,a.min=`0`,a.max=`255`,a.value=String(e.ordre??1),a.className=`h-9 w-20 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`;let o=document.createElement(`button`);o.type=`button`,o.textContent=`Enregistrer`,o.className=`h-9 rounded-md text-12 text-text-secondary underline hover:text-text-primary`,o.addEventListener(`click`,()=>{t.surModifierOption?.(Number(n.dataset.optionId),y(n,`optionNom`),Number(y(n,`optionOrdre`)||1))});let s=document.createElement(`button`);s.type=`button`,s.textContent=`Supprimer l'option`,s.className=`h-9 rounded-md text-12 text-red-700 underline hover:text-red-900 dark:text-red-400`,s.addEventListener(`click`,()=>{t.surSupprimerOption?.(Number(n.dataset.optionId))}),r.append(i,a,o,s);let c=document.createElement(`div`);c.className=`ml-4 flex flex-col gap-2`,(e.valeurs||[]).forEach(e=>{c.appendChild(te(e))});let l=document.createElement(`div`);l.className=`flex flex-wrap gap-2 items-end mt-2`;let u=document.createElement(`input`);u.type=`text`,u.name=`nouvelleValeurValeur`,u.placeholder=`Nouvelle valeur`,u.className=`rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`,u.maxLength=80;let d=document.createElement(`input`);d.type=`number`,d.name=`nouvelleValeurPrix`,d.min=`0`,d.max=`9999.99`,d.step=`0.01`,d.placeholder=`Supplément €`,d.className=`h-9 w-28 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`;let f=document.createElement(`input`);f.type=`number`,f.name=`nouvelleValeurOrdre`,f.min=`0`,f.max=`255`,f.value=`1`,f.className=`h-9 w-20 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`;let p=document.createElement(`button`);return p.type=`button`,p.textContent=`Ajouter la valeur`,p.className=`h-9 rounded-md text-12 text-text-secondary underline hover:text-text-primary`,p.addEventListener(`click`,()=>{t.surAjouterValeur?.(Number(n.dataset.optionId),u.value,d.value,Number(f.value||1))}),l.append(u,d,f,p),n.append(r,c,l),n};return function(){v.innerHTML=``,(e.options||[]).forEach(e=>{v.appendChild(ne(e))})}(),n.querySelector(`[data-action="ajouter-option"]`).addEventListener(`click`,()=>{let e=n.querySelector(`[name="nouvelleOptionNom"]`),r=n.querySelector(`[name="nouvelleOptionOrdre"]`);t.surAjouterOption?.(e?e.value:``,Number(r?r.value:1)||1)}),i.addEventListener(`submit`,e=>{e.preventDefault();let n=G.lireSaisie(i,d),r=G.valider(n);a.textContent=r||``,a.classList.toggle(`hidden`,!r),!r&&t.surEnregistrer&&t.surEnregistrer(n)}),n.querySelector(`[data-action="annuler"]`).addEventListener(`click`,()=>t.surAnnuler?.()),n},lireSaisie:function(e,t=[]){let n=Object.fromEntries(new FormData(e));return{nom:String(n.nom??``),reference:String(n.reference??``),categorieId:String(n.categorieId??``),marque:String(n.marque??``),format:String(n.format??``),badge:String(n.badge??``),description:String(n.description??``),prix:String(n.prix??``),prixUnitaire:String(n.prixUnitaire??``),unitePrix:String(n.unitePrix??``),stock:String(n.stock??``),seuilAlerte:String(n.seuilAlerte??``),images:t}}},yt=`<div data-zone="overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <section role="dialog" aria-modal="true" aria-labelledby="titre-suppr-produit" class="max-h-screen w-full max-w-lg overflow-y-auto rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-formulaires-admin-suppressionproduit">
        <h2 id="titre-suppr-produit" class="mb-2 text-20 font-semibold text-text-primary">Supprimer le produit « {{nom}} » ?</h2>
        <p class="mb-5 text-14 text-text-secondary">Le produit ne sera plus proposé à la vente. Cette action est irréversible.</p>
        <div class="flex justify-end gap-3">
            <button type="button" data-action="fermer" class="h-10 rounded-md border px-4 text-14 font-medium text-text-secondary hover:bg-surface-subtle border-border-default">Annuler</button>
            <button type="button" data-action="confirmer" class="h-10 rounded-md bg-status-warning-background px-4 text-14 font-medium text-action-primary-text hover:opacity-90">Supprimer</button>
        </div>
    </section>
</div>`,bt={html:function(e={}){return n(yt,{nom:e.nom??``})},dom:function(e={},t={}){let n=r(bt.html(e));return n.querySelector(`[data-action="confirmer"]`).addEventListener(`click`,()=>t.surConfirmer?.(e.id)),n.querySelectorAll(`[data-action="fermer"]`).forEach(e=>e.addEventListener(`click`,()=>t.surFermer?.())),n}},xt=`<section class="mb-6 overflow-x-auto rounded-lg border bg-surface-default shadow-xs border-border-default c-tableaux-recapitulatifs-admin-produits">
    <table class="w-full text-left text-14">
        <thead class="bg-surface-subtle text-text-secondary">
        <tr>
            <th scope="col" class="px-4 py-3 font-medium">Produit</th>
            <th scope="col" class="px-4 py-3 font-medium">Catégorie</th>
            <th scope="col" class="px-4 py-3 font-medium">Prix</th>
            <th scope="col" class="px-4 py-3 font-medium">Stock</th>
            <th scope="col" class="px-4 py-3 font-medium">État</th>
            <th scope="col" class="px-4 py-3 font-medium"><span class="sr-only">Actions</span></th>
        </tr>
        </thead>
        <tbody data-zone="lignes" class="divide-y divide-border-subtle"></tbody>
    </table>
</section>`,St=`<tr class="text-zinc-900 dark:text-zinc-100">
  <td class="px-4 py-3 font-medium">{{nom}}</td>
  <td class="px-4 py-3">{{categorie}}</td>
  <td class="px-4 py-3">{{prix}} €</td>
  <td class="px-4 py-3">{{stock}}</td>
  <td class="px-4 py-3" data-zone="etat"></td>
  <td class="whitespace-nowrap px-4 py-3 text-right">
    <button type="button" data-action="modifier" data-id="{{id}}" class="mr-3 text-blue-600 underline hover:text-blue-700 dark:text-blue-400">Modifier</button>
    <button type="button" data-action="supprimer" data-id="{{id}}" class="text-red-700 underline hover:text-red-900 dark:text-red-400">Supprimer</button>
  </td>
</tr>`,Ct={html:function(){return xt},dom:function(e=[],t={}){let i=r(xt),a=i.querySelector(`[data-zone="lignes"]`);if(e.length===0)a.innerHTML=`<tr><td colspan="6" class="px-4 py-6 text-center text-zinc-500">Aucun produit pour le moment.</td></tr>`;else{a.innerHTML=e.map(e=>n(St,e)).join(``);let t=a.querySelectorAll(`tr`);e.forEach((e,n)=>{let r=t[n].querySelector(`[data-zone="etat"]`);r&&r.appendChild(D.dom({etat:e.etat,stock:e.stock,seuilAlerte:e.seuilAlerte}))})}return a.addEventListener(`click`,e=>{let n=e.target.closest(`[data-action]`);n&&(n.dataset.action===`modifier`&&t.surModifier?.(n.dataset.id),n.dataset.action===`supprimer`&&t.surSupprimer?.(n.dataset.id))}),i}},wt=`<section class="mx-auto max-w-4xl px-6 pt-10 pb-16">\r
    <div data-zone="entete" class="mb-6 flex flex-wrap items-center justify-between gap-4">\r
        <h1 class="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Gestion des produits</h1>\r
        <button type="button" data-action="creer" class="h-10 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900">Nouveau produit</button>\r
    </div>\r
\r
    <p data-zone="acces" hidden class="mb-6 text-sm text-zinc-600 dark:text-zinc-300">\r
        Cette page est réservée à l'administrateur.\r
        <a href="/admin" data-link class="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400">Se connecter</a>.\r
    </p>\r
\r
    <slot name="message"></slot>\r
    <slot name="formulaire"></slot>\r
    <slot name="suppression"></slot>\r
    <slot name="barre-outils"></slot>\r
    <slot name="tableau"></slot>\r
    <slot name="pagination"></slot>\r
</section>`,K={acces:null,produits:[],tri:`nom`,parPage:12,page:1,pagesTotal:1,total:0,categories:[],message:null,edition:null,suppression:null},q={};q.chargerDonnees=async function(){try{let[e,t]=await Promise.all([w.fetchAdminListe(1),S.fetchAdminListe()]);q.appliquerListe(e),K.categories=t,K.acces=`ok`,a(!0)}catch(e){K.produits=[],K.categories=[],e instanceof c&&e.statut===401?(K.acces=`non-connecte`,a(!1)):e instanceof c&&e.statut===403?(K.acces=`refuse`,a(!1)):K.message={type:`erreur`,texte:e.message}}},q.appliquerListe=function(e){K.produits=e.produits,K.tri=e.tri,K.parPage=e.parPage,K.page=e.page,K.pagesTotal=e.pagesTotal,K.total=e.total},q.chargerProduits=async function(e=K.page,t={tri:K.tri,parPage:K.parPage}){q.appliquerListe(await w.fetchAdminListe(e,t))},q.changerListe=async function(e,t){try{await q.chargerProduits(e,t),K.message=null}catch(e){K.message={type:`erreur`,texte:e.message}}J.rafraichir()},q.handler_changerTri=function(e){return q.changerListe(1,{tri:e,parPage:K.parPage})},q.handler_changerParPage=function(e){return q.changerListe(1,{tri:K.tri,parPage:e})},q.handler_changerPage=function(e){return q.changerListe(e,{tri:K.tri,parPage:K.parPage}).then(()=>{window.scrollTo({top:0,behavior:`smooth`})})},q.trouverProduit=function(e){return K.produits.find(t=>String(t.id)===String(e))??null},q.valeursVides=function(){return{nom:``,reference:``,categorieId:``,marque:``,format:``,badge:``,description:``,prix:``,prixUnitaire:``,unitePrix:``,stock:0,seuilAlerte:5,images:[],options:[]}},q.valeursDepuis=function(e){return{nom:e.nom,reference:e.reference,categorieId:String(e.categorieId),marque:e.marque,format:e.format,badge:e.badge,description:e.description,prix:String(e.prix),prixUnitaire:e.prixUnitaire===``?``:String(e.prixUnitaire),unitePrix:e.unitePrix,stock:e.stock,seuilAlerte:e.seuilAlerte}},q.versApi=function(e){return{nom:e.nom.trim(),reference:e.reference.trim(),categorie_id:Number(e.categorieId),marque:e.marque.trim(),format:e.format.trim(),description:e.description.trim(),prix:e.prix,prix_unitaire:e.prixUnitaire,unite_prix:e.unitePrix.trim(),badge:e.badge.trim(),stock:Number(e.stock),seuil_alerte:Number(e.seuilAlerte)}},q.lireDataUrl=function(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(Error(`Lecture de l'image impossible.`)),r.readAsDataURL(e)})},q.handler_ouvrirCreation=function(){K.edition={id:null,valeurs:q.valeursVides(),images:[],options:[]},K.suppression=null,K.message=null,J.rafraichir()},q.handler_ouvrirModification=async function(e){let t=q.trouverProduit(e);if(!t)return;let n=[];try{n=await w.fetchAdminOptions(t.id)}catch(e){K.message={type:`erreur`,texte:`Impossible de charger les options : ${e.message}`}}K.edition={id:t.id,valeurs:q.valeursDepuis(t),images:t.images,options:n},K.suppression=null,K.message=null,J.rafraichir()},q.handler_annulerFormulaire=function(){K.edition=null,J.rafraichir()},q.handler_enregistrer=async function(e){K.edition={...K.edition,valeurs:e};let t=G.valider(e);if(t)K.message={type:`erreur`,texte:t},J.rafraichir();else{try{let t=q.versApi(e),n=K.edition.id===null?await w.creer(t):await w.modifier(K.edition.id,t);if(K.edition={...K.edition,id:n.id},Array.isArray(e.images))for(let t of e.images){if(!(t instanceof File)||t.size===0)continue;let e=await q.lireDataUrl(t);await w.ajouterImage(n.id,[{image:e,texte_alternatif:n.nom,nomFichier:t.name}])}K.message={type:`succes`,texte:`Produit « ${n.nom} » enregistré.`},K.edition=null,await q.chargerProduits()}catch(e){if(K.message={type:`erreur`,texte:e.message},K.edition?.id){await q.chargerProduits().catch(()=>{});let e=q.trouverProduit(K.edition.id);e&&(K.edition={...K.edition,images:e.images})}}J.rafraichir()}},q.handler_supprimerImage=async function(e,t){if(K.edition?.id){try{await w.supprimerImage(K.edition.id,e),await q.chargerProduits();let n=q.trouverProduit(K.edition.id);K.edition={...K.edition,valeurs:t,images:n?n.images:[]},K.message={type:`succes`,texte:`Image supprimée.`}}catch(e){K.message={type:`erreur`,texte:e.message}}J.rafraichir()}},q.handler_ajouterOption=async function(e,t){if(K.edition?.id){try{K.edition.options=await w.creerOption(K.edition.id,{nom:e,ordre:t}),K.message=null}catch(e){K.message={type:`erreur`,texte:e.message}}J.rafraichir()}},q.handler_ajouterValeur=async function(e,t,n,r){if(K.edition?.id){try{K.edition.options=await w.ajouterValeur(e,{valeur:t,prix_supplement:n,ordre:r}),K.message=null}catch(e){K.message={type:`erreur`,texte:e.message}}J.rafraichir()}},q.handler_modifierOption=async function(e,t,n){if(K.edition?.id){try{K.edition.options=await w.modifierOption(e,{nom:t,ordre:n}),K.message=null}catch(e){K.message={type:`erreur`,texte:e.message}}J.rafraichir()}},q.handler_supprimerOption=async function(e){if(K.edition?.id){try{K.edition.options=await w.supprimerOption(e),K.message=null}catch(e){K.message={type:`erreur`,texte:e.message}}J.rafraichir()}},q.handler_modifierValeur=async function(e,t,n,r){if(K.edition?.id){try{K.edition.options=await w.modifierValeur(e,{valeur:t,prix_supplement:n,ordre:r}),K.message=null}catch(e){K.message={type:`erreur`,texte:e.message}}J.rafraichir()}},q.handler_supprimerValeur=async function(e){if(K.edition?.id){try{K.edition.options=await w.supprimerValeur(e),K.message=null}catch(e){K.message={type:`erreur`,texte:e.message}}J.rafraichir()}},q.handler_demanderSuppression=function(e){let t=q.trouverProduit(e);t&&(K.suppression=t,K.edition=null,K.message=null,J.rafraichir())},q.handler_annulerSuppression=function(){K.suppression=null,J.rafraichir()},q.handler_confirmerSuppression=async function(e){let t=q.trouverProduit(e)?.nom??``;try{await w.supprimer(e),K.suppression=null,K.message={type:`succes`,texte:`Produit « ${t} » supprimé.`},await q.chargerProduits()}catch(e){K.message={type:`erreur`,texte:e.message}}J.rafraichir()},q.handler_deconnexion=async function(){if(J.racine?.isConnected){try{await R.logout(),K.message={type:`info`,texte:`Vous êtes déconnecté.`}}catch(e){K.message={type:`erreur`,texte:e.message}}K.acces=`non-connecte`,a(!1),K.produits=[],K.categories=[],K.edition=null,K.suppression=null,J.rafraichir(),document.dispatchEvent(new Event(`admin:deconnexion-terminee`))}},document.addEventListener(`admin:deconnexion`,q.handler_deconnexion),q.init=async function(){return K.message=null,K.edition=null,K.suppression=null,await q.chargerDonnees(),J.init()};var J={};J.racine=null,J.init=function(){let e=J.createPageFragment();return J.racine=e.firstElementChild,e},J.rafraichir=function(){let e=J.createPageFragment(),t=e.firstElementChild;J.racine.replaceWith(e),J.racine=t},J.createPageFragment=function(){let e=r(wt),t=K.acces===`ok`,n=K.edition!==null,i=e.querySelector(`[data-action="creer"]`);return i.hidden=!t||n,i.addEventListener(`click`,q.handler_ouvrirCreation),e.querySelector(`[data-zone="entete"]`).hidden=n,e.querySelector(`[data-zone="acces"]`).hidden=t,e.querySelector(`slot[name="message"]`).replaceWith(O.dom(K.message)),e.querySelector(`slot[name="formulaire"]`).replaceWith(K.edition?G.dom(K.edition,{categories:K.categories,surEnregistrer:q.handler_enregistrer,surAnnuler:q.handler_annulerFormulaire,surSupprimerImage:q.handler_supprimerImage,surAjouterOption:q.handler_ajouterOption,surAjouterValeur:q.handler_ajouterValeur,surModifierOption:q.handler_modifierOption,surSupprimerOption:q.handler_supprimerOption,surModifierValeur:q.handler_modifierValeur,surSupprimerValeur:q.handler_supprimerValeur}):``),e.querySelector(`slot[name="suppression"]`).replaceWith(K.suppression?bt.dom({id:K.suppression.id,nom:K.suppression.nom},{surConfirmer:q.handler_confirmerSuppression,surFermer:q.handler_annulerSuppression}):``),e.querySelector(`slot[name="barre-outils"]`).replaceWith(t&&!n?E.dom({...K,optionsTri:[{valeur:`nom`,libelle:`Nom (A → Z)`},{valeur:`prix`,libelle:`Prix (croissant)`},{valeur:`categorie`,libelle:`Catégorie (A → Z)`},{valeur:`stock`,libelle:`Stock (croissant)`},{valeur:`etat`,libelle:`État (épuisé en premier)`}]},{surTri:q.handler_changerTri,surParPage:q.handler_changerParPage}):``),e.querySelector(`slot[name="tableau"]`).replaceWith(t&&!n?Ct.dom(K.produits,{surModifier:q.handler_ouvrirModification,surSupprimer:q.handler_demanderSuppression}):``),e.querySelector(`slot[name="pagination"]`).replaceWith(t&&!n?k.dom(K,{surPage:q.handler_changerPage}):``),e};function Tt(){return q.init()}var Et=`<li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center c-ligne-panier">
  <img src="{{src}}" alt="{{alt}}" class="h-20 w-20 shrink-0 rounded-md bg-surface-subtle object-contain" />
  <div class="flex flex-1 flex-col gap-1">
    <a href="{{lien}}" data-link class="font-medium text-text-primary hover:underline">{{nom}}</a>
    <p data-zone="options" class="text-12 text-text-secondary"></p>
    <p class="text-14 text-text-secondary">{{prix}} € l'unité</p>
  </div>
  <slot name="quantite"></slot>
  <p data-zone="total" class="w-28 text-right font-semibold text-text-primary"></p>
  <button type="button" data-action="supprimer" class="text-14 text-status-warning-text underline hover:text-status-warning-text">Supprimer</button>
</li>`,Y={html:function(e={}){let t=typeof e.prix==`number`?e.prix.toFixed(2).replace(`.`,`,`):String(e.prix||`0,00`);return n(Et,{src:e.src||``,alt:e.alt||e.nom||``,lien:e.lien||`#`,nom:e.nom||``,prix:t})},total:function(e){let t=Number(e.prixOptions||0);return(Number(e.prix)+t)*Number(e.quantite||1)},dom:function(e={},t={}){let n=r(Y.html(e)),i=Object.entries(e.options||{}).map(([e,t])=>`${e} : ${t}`).join(` · `),a=n.querySelector(`[data-zone="options"]`);a&&(a.textContent=i);let o=n.querySelector(`[data-zone="quantite"]`);o&&o.replaceWith(P.dom({valeur:e.quantite,min:1,max:e.stock},{surChange:n=>t.surQuantite?.(e.id,n)}));let s=n.querySelector(`[data-zone="total"]`);return s.textContent=Y.total(e).toFixed(2).replace(`.`,`,`)+` €`,n.querySelector(`[data-action="supprimer"]`).addEventListener(`click`,()=>t.surSupprimer?.(e.id)),n}},Dt=`<section class="mx-auto max-w-3xl c-tableaux-recapitulatifs-client-panier">
    <h2 class="mb-4 text-24 font-semibold tracking-tight text-text-primary">Mon panier</h2>
    <ul data-zone="lignes" class="flex flex-col"></ul>
    <p data-zone="vide" class="hidden py-8 text-center text-text-secondary">Votre panier est vide.</p>

    <div class="my-6 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between border-border-default">
        <p class="text-18 font-semibold text-text-primary">Total : <span data-zone="total">0,00 €</span></p>
        <div class="flex gap-3">
            <button type="button" data-action="continuer" class="h-10 rounded-md border px-4 text-14 font-medium text-text-secondary hover:bg-surface-subtle border-border-default">← Continuer mes achats</button>
            <button type="button" data-action="valider" class="h-10 rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text hover:opacity-90 disabled:opacity-40">Valider mon panier</button>
        </div>
    </div>
</section>`,Ot={html:function(){return Dt},total:function(e=[]){return e.reduce((e,t)=>e+Y.total(t),0)},dom:function(e=[],t={}){let n=r(Dt),i=n.querySelector(`[data-zone="lignes"]`),a=n.querySelector(`[data-zone="vide"]`),o=n.querySelector(`[data-action="valider"]`),s=n=>{n.innerHTML=``,e.forEach(e=>{n.appendChild(Y.dom(e,{surQuantite:(n,r)=>{e.quantite=r,l(),t.surQuantite?.(n,r)},surSupprimer:e=>{t.surSupprimer?.(e)}}))})},c=n.querySelector(`[data-zone="total"]`),l=()=>{c&&(c.textContent=Ot.total(e).toFixed(2).replace(`.`,`,`)+` €`),o.disabled=e.length===0,a.classList.toggle(`hidden`,e.length>0)};return s(i),l(),o.addEventListener(`click`,()=>t.surValider?.(e)),n.querySelector(`[data-action="continuer"]`).addEventListener(`click`,()=>t.surContinuer?.()),n}},kt=`<section class="mx-auto max-w-3xl px-6 pt-10 pb-16 gap-2">
  <slot name="panier"></slot>
  <slot name="message"></slot>
</section>
`,X={panier:[],message:null},Z={};Z.charger=async function(){if(X.panier=_(),X.panier.length===0){X.message=null;return}let e=!1,t=[];try{let n=await g(X.panier.map(e=>({id:e.id,quantite:e.quantite})));for(let r of n.lignes){let n=X.panier.find(e=>String(e.id)===String(r.id));n&&(n.stock=r.stock??n.stock,r.estValide||(e=!0,r.quantiteMax<=0?(X.panier=X.panier.filter(e=>String(e.id)!==String(r.id)),t.push(`${n.nom??`Cet article`} a été retiré du panier : produit épuisé.`)):(n.quantite=r.quantiteMax,t.push(`${n.nom??`Cet article`} : quantité ajustée au stock disponible (${r.quantiteMax} maximum).`))))}}catch{}e&&(v(X.panier),b()),X.message=t.length>0?{type:`erreur`,texte:t.join(` `)}:null},Z.handler_surQuantite=async function(e,t){ne(e,t),await Z.charger(),b(),Q.rafraichir()},Z.handler_surSupprimer=async function(e){let t=X.panier.find(t=>String(t.id)===String(e))?.nom;re(e),await Z.charger(),b(),X.message={type:`succes`,texte:`Le produit "${t}" a bien été supprimé du panier.`},Q.rafraichir()},Z.handler_surValider=async function(){if(X.panier.length===0)return;let e;try{e=await g(X.panier.map(e=>({id:e.id,quantite:e.quantite})))}catch{X.message={type:`erreur`,texte:`Impossible de vérifier le stock actuellement. Réessayez dans un instant.`},Q.rafraichir();return}let t=(e.lignes??[]).filter(e=>!e.estValide);if(t.length>0){let e=!1,n=[];for(let r of t){let t=X.panier.find(e=>String(e.id)===String(r.id));t&&(e=!0,r.quantiteMax<=0?(X.panier=X.panier.filter(e=>String(e.id)!==String(r.id)),n.push(`${t.nom??`Cet article`} retiré du panier : produit épuisé.`)):(t.quantite=r.quantiteMax,n.push(`${t.nom??`Cet article`} : quantité ajustée à ${r.quantiteMax} (stock disponible).`)))}e&&(v(X.panier),b()),X.message={type:`erreur`,texte:`${n.join(` `)} Vérifiez votre panier avant de valider la commande.`},Q.rafraichir()}else ie(),b(),X.panier=[],X.message={type:`succes`,texte:`Votre commande a été validée.`},Q.rafraichir()},Z.handler_surContinuer=function(){window.location.href=`/~ribatet1/SAE-3.01/Base/`},Z.init=async function(){return await Z.charger(),Q.init()};var Q={};Q.racine=null,Q.init=function(){let e=Q.createPageFragment();return Q.racine=e.firstElementChild,e},Q.rafraichir=function(){let e=Q.createPageFragment(),t=e.firstElementChild;Q.racine.replaceWith(e),Q.racine=t},Q.createPageFragment=function(){let e=r(kt);return e.querySelector(`slot[name="panier"]`).replaceWith(Ot.dom(X.panier,{surQuantite:Z.handler_surQuantite,surSupprimer:Z.handler_surSupprimer,surValider:Z.handler_surValider,surContinuer:Z.handler_surContinuer})),e.querySelector(`slot[name="message"]`).replaceWith(O.dom(X.message)),e};function At(){return Z.init()}var jt=`<section class="mx-auto max-w-5xl px-6 pt-10 pb-16">
  <h1 class="mb-6 text-2xl font-semibold tracking-tight">Page introuvable</h1>
  <p class="mb-6 text-sm text-zinc-500 dark:text-zinc-400">Cette page n'existe pas.</p>
  <a href="/" data-link class="text-sm font-medium underline underline-offset-4">Retour au catalogue</a>
</section>
`;function Mt(){return jt}document.body.insertAdjacentHTML(`afterbegin`,`<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\r
  \r
  <!-- Circle -->\r
  <symbol id="icon-circle" viewBox="0 0 24 24" fill="currentColor">\r
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />\r
    <path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" />\r
  </symbol>\r
\r
  <!-- Alert Triangle -->\r
  <symbol id="icon-alert-triangle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\r
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />\r
    <path d="M12 9v4" />\r
    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />\r
    <path d="M12 16h.01" />\r
  </symbol>\r
\r
  <!-- Cross -->\r
  <symbol id="icon-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\r
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />\r
    <path d="M18 6l-12 12" />\r
    <path d="M6 6l12 12" />\r
  </symbol>\r
\r
  <!-- Check -->\r
  <symbol id="icon-check" viewBox="0 0 24 24" fill="currentColor">\r
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />\r
    <path d="M20.707 6.293a1 1 0 0 1 0 1.414l-10 10a1 1 0 0 1 -1.414 0l-5 -5a1 1 0 0 1 1.414 -1.414l4.293 4.293l9.293 -9.293a1 1 0 0 1 1.414 0" />\r
  </symbol>\r
\r
  <!-- User Circle -->\r
  <symbol id="icon-user-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\r
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />\r
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />\r
    <path d="M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />\r
    <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />\r
  </symbol>\r
\r
  <!-- Shopping Bag -->\r
  <symbol id="icon-shopping-bag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\r
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />\r
    <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304" />\r
    <path d="M9 11v-5a3 3 0 0 1 6 0v5" />\r
  </symbol>\r
\r
  <!-- Sun -->\r
  <symbol id="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\r
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />\r
    <path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />\r
    <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />\r
  </symbol>\r
\r
  <!-- Moon -->\r
  <symbol id="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\r
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />\r
    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008" />\r
  </symbol>\r
\r
  <!-- Download -->\r
  <symbol id="icon-download" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-download">\r
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />\r
    <path d="M20 16a1 1 0 0 1 1 1v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2a1 1 0 0 1 2 0v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1v-2a1 1 0 0 1 1 -1m-8 -13a1 1 0 0 1 1 1v9.585l3.293 -3.292a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1 -.09 .08l.09 -.08a1 1 0 0 1 -.674 .292l-.033 .001h-.032l-.054 -.004l.086 .004a1 1 0 0 1 -.617 -.213a1 1 0 0 1 -.09 -.08l-5 -5a1 1 0 0 1 1.414 -1.414l3.293 3.292v-9.585a1 1 0 0 1 1 -1" />\r
  </symbol>\r
\r
</svg>`);var $=new e(`app`,{base:`/~ribatet1/SAE-3.01/Base/`});$.addLayout(`/`,me),$.addRoute(`/`,Pe),$.addRoute(`/categorie/:slug`,Pe),$.addRoute(`/produit/:slug`,Xe),$.addRoute(`/panier`,At),$.addRoute(`/admin`,it),$.addRoute(`/admin/categories`,ht),$.addRoute(`/admin/produits`,Tt),$.addRoute(`*`,Mt),document.addEventListener(`admin:deconnexion-terminee`,()=>$.navigate(`/admin`)),document.addEventListener(`admin:session-change`,e=>{let t=e.detail===!0;document.querySelectorAll(`[data-zone="navigation-authentifie"]`).forEach(e=>{e.hidden=!t}),document.querySelectorAll(`[data-action="deconnexion"]`).forEach(e=>{e.hidden=!t})}),$.start();