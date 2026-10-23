(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(e,t={}){this.root=document.getElementById(e),this.routes=[],this.layouts={},this.base=(t.base??`/`).replace(/\/$/,``),this.navigation=0,this.currentPath=null,window.addEventListener(`popstate`,()=>this.handleRoute()),document.addEventListener(`click`,e=>{let t=e.target.closest(`a[data-link]`);t!==null&&(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),this.navigate(this.routePath(t.pathname))))})}addLayout(e,t){return this.layouts[e]=t,this}findLayout(e){let t=null,n=0;for(let[r,i]of Object.entries(this.layouts))e.startsWith(r)&&r.length>n&&(t=i,n=r.length);return t}addRoute(e,t,n={}){return this.routes.push({path:e,regex:this.pathToRegex(e),keys:this.extractParams(e),handler:t,useLayout:n.useLayout!==!1}),this}pathToRegex(e){if(e===`*`)return/.*/;let t=e.replace(/\//g,`\\/`).replace(/:(\w+)/g,`([^\\/]+)`).replace(/\*/g,`.*`);return RegExp(`^`+t+`$`)}extractParams(e){let t=[];for(let n of e.matchAll(/:(\w+)/g))t.push(n[1]);return t}getParams(e,t){let n=t.match(e.regex);if(!n)return{};let r={};return e.keys.forEach((e,t)=>{r[e]=decodeURIComponent(n[t+1])}),r}routePath(e){return e===this.base?`/`:e.startsWith(this.base+`/`)?e.slice(this.base.length):e}url(e){return this.base+e}navigate(e){window.history.pushState(null,``,this.url(e)),this.handleRoute()}async handleRoute(){let e=++this.navigation,t=this.currentPath,n=this.routePath(window.location.pathname);this.currentPath=n,t&&t.startsWith(`/admin`)&&!n.startsWith(`/admin`)&&document.dispatchEvent(new Event(`admin:quitter`));let r=this.routes.find(e=>e.regex.test(n));if(!r)return;let i=await r.handler(this.getParams(r,n));e===this.navigation&&this.renderContent(i,r,n)}renderContent(e,t,n){let r=e;if(!(r instanceof DocumentFragment)){let e=document.createElement(`template`);e.innerHTML=r,r=e.content}let i=t.useLayout?this.findLayout(n):null;if(i){let e=i(n);e.querySelector(`slot:not([name])`).replaceWith(r),r=e}this.root.replaceChildren(r),this.updateLinks(n),window.scrollTo(0,0)}updateLinks(e){for(let t of this.root.querySelectorAll(`a[data-link]`)){let n=this.routePath(t.pathname);t.setAttribute(`href`,this.url(n)),n===e?t.setAttribute(`aria-current`,`page`):t.removeAttribute(`aria-current`)}}start(){this.handleRoute()}};function t(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}var n=function(e,n){let r=e;for(let e in n)r=r.replaceAll(`{{${e}}}`,()=>t(n[e]));return r};function r(e){let t=document.createElement(`template`);return t.innerHTML=e.trim(),t.content}var i=!1;function a(e){i=e,document.dispatchEvent(new CustomEvent(`admin:session-change`,{detail:e}))}function o(){return i}var s=`/~ribatet1/SAE-3.01/Base/api/`,c=class extends Error{constructor(e,t){super(e),this.name=`ErreurApi`,this.statut=t}},l=async function(e,t){let n=await fetch(s+e,t),r=null;try{r=await n.json()}catch{throw new c(`Réponse illisible du serveur.`,n.status)}if(!n.ok)throw new c(r?.erreur??`Erreur ${n.status}`,n.status);return r},u=function(e,t,n){return l(e,{method:t,headers:{Accept:`application/json`,"Content-Type":`application/json`},body:JSON.stringify(n)})},d=function(e){return l(e,{method:`GET`,headers:{Accept:`application/json`}})},f=function(e,t={}){return l(e,{method:`POST`,headers:{Accept:`application/json`,"Content-Type":`application/json`},body:JSON.stringify(t)})},p=function(e,t={}){return u(e,`PUT`,t)},m=function(e,t={}){return u(e,`DELETE`,t)},h=`sae301:panier`,ee=new Set;async function g(e){let t=await f(`panier/verifier-stock`,{lignes:e});return{valide:t.valide===!0,lignes:t.lignes??[],messages:(t.lignes??[]).filter(e=>e.message).map(e=>e.message)}}function _(){try{let e=window.localStorage.getItem(h);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}}function v(e){try{window.localStorage.setItem(h,JSON.stringify(e))}catch{}x();for(let t of ee)t(e)}function y(){return _().reduce((e,t)=>e+(Number(t.quantite)||0),0)}function te(e,t=1){let n=_(),r=Math.max(1,Math.floor(Number(t)||1)),i=e?.id;if(i==null)return n;let a=n.find(e=>String(e.id)===String(i));return a?a.quantite=(Number(a.quantite)||0)+r:n.push({id:i,slug:e.slug??``,nom:e.nom??``,prix:Number(e.prix)||0,quantite:r,src:e.src??``}),v(n),n}function ne(e,t){let n=_(),r=n.find(t=>String(t.id)===String(e));if(!r)return n;let i=Math.floor(Number(t)||0);return i<=0?(v(n.filter(t=>String(t.id)!==String(e))),_()):(r.quantite=i,v(n),n)}function b(e){let t=_().filter(t=>String(t.id)!==String(e));return v(t),t}function re(){v([])}function x(){let e=y();for(let t of document.querySelectorAll(`[data-role="compteur-panier"]`))t.textContent=String(e)}function ie(){let e=document.documentElement.classList.toggle(`theme-dark`);try{localStorage.setItem(`theme`,e?`sombre`:`clair`)}catch{}}function ae(e){return{id:e.id,nom:e.libelle,description:e.description??``,nbProduits:e.nb_produits??0}}var S={fetchAll:async function(){let e=await d(`categories`);return Array.isArray(e)?e:e.categories??[]},fetchAdminListe:async function(e=`nom`){return(await d(`admin/categories?tri=${encodeURIComponent(e)}`)).categories.map(ae)},fetchAdminPage:async function(e,t,n){let r=await d(`admin/categories?page=${e}&tri=${encodeURIComponent(t)}&parPage=${n}`);return{...r,categories:r.categories.map(ae)}},creer:async function(e){return ae((await f(`admin/categories`,e)).categorie)},modifier:async function(e,t){return ae((await p(`admin/categories/${encodeURIComponent(e)}`,t)).categorie)},supprimer:async function(e,t=null){let n=t===null?{}:{cible_id:Number(t)};return m(`admin/categories/${encodeURIComponent(e)}`,n)}},oe=`<header class="sticky top-0 z-10 border-b bg-surface-default shadow-xs border-border-default c-header-client">\r
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
</a>`,ce=`/~ribatet1/SAE-3.01/Base/assets/logo-Cjz4wVmC.webp`,C={html:function(e={}){let t=document.documentElement.classList.contains(`theme-dark`)?`#icon-sun`:`#icon-moon`;return n(oe,{nbArticles:e.nbArticles??e.totalArticles??0,"icon-theme":t,"logo-src":ce})},dom:function(e={},t={}){let n=r(C.html(e)),i=n.querySelector(`slot[name="categories"]`);i&&(Array.isArray(e.categories)&&e.categories.length>0?i.replaceWith(...e.categories.map(C.creerLienCategorie)):C.chargerCategories(i));let a=n.querySelector(`[data-action="theme"]`);return a&&a.addEventListener(`click`,()=>{ie();let e=document.documentElement.classList.contains(`theme-dark`),n=a.querySelector(`use`);n&&n.setAttribute(`href`,e?`#icon-sun`:`#icon-moon`),t.surChangerTheme&&t.surChangerTheme()}),n},creerLienCategorie:function(e){let t=`/categorie/${encodeURIComponent(e.slug)}`,i=`/~ribatet1/SAE-3.01/Base/`.replace(/\/$/,``),a=e.lien||`${i}${t}`,o=r(n(se,{nom:e.nom||e.libelle||``,lien:a,"nb-produits":e.nb_produits??e.nbProduits??0})),s=o.firstElementChild;return window.location.pathname===a&&s.setAttribute(`aria-current`,`page`),o},chargerCategories:async function(e){try{let t=await S.fetchAll();if(!e.isConnected)return;let n=t.map(C.creerLienCategorie);e.replaceWith(...n)}catch{e?.isConnected&&e.remove()}}},le=`<header class="sticky top-0 z-10 border-b border-border-default bg-surface-default/95 backdrop-blur-xs c-header-admin">\r
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
</a>`,de=[{lien:`/admin/produits`,nom:`Produits`},{lien:`/admin/categories`,nom:`Catégories`},{lien:`/admin/commandes`,nom:`Commandes`}],fe={html:function(){return n(le,{"icon-theme":document.documentElement.classList.contains(`theme-dark`)?`#icon-sun`:`#icon-moon`,"logo-src":ce})},dom:function(e={}){let t=r(fe.html()),i=t.querySelector(`[data-zone="navigation-authentifie"]`);i&&(i.hidden=!e.adminConnecte);let a=t.querySelector(`[data-action="deconnexion"]`);a&&(a.hidden=!e.adminConnecte);let o=t.querySelector(`slot[name="navigation"]`);if(o){let e=de.map(e=>r(n(ue,e)));o.replaceWith(...e)}let s=t.querySelector(`[data-action="theme"]`);return s&&s.addEventListener(`click`,()=>{ie();let e=document.documentElement.classList.contains(`theme-dark`),t=s.querySelector(`use`);t&&t.setAttribute(`href`,e?`#icon-sun`:`#icon-moon`)}),a&&e.surDeconnexion&&a.addEventListener(`click`,()=>e.surDeconnexion()),t}},pe=`<div class="min-h-screen">
  <slot name="header"></slot>
  <main>
    <!-- Le slot sans nom reçoit la page affichée (voir lib/router.js). -->
    <slot></slot>
  </main>
</div>
`;function me(e=`/`){let t=r(pe),n=e===`/admin`||e.startsWith(`/admin/`),i=n?fe:C,a=n?{adminConnecte:o(),surDeconnexion:()=>document.dispatchEvent(new Event(`admin:deconnexion`))}:{},s=n?{}:{nbArticles:y()};return t.querySelector(`slot[name="header"]`).replaceWith(i.dom(s,a)),t}var he=Object.assign({"../images/bricolage/boite-outils-keter-fermer.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-fermer-BCeyoHet.avif`,"../images/bricolage/boite-outils-keter-ouvert.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-ouvert-DHPzhAIY.avif`,"../images/bricolage/boite-outils-keter-seul.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-seul-DBg7fsyY.avif`,"../images/bricolage/boite-outils-keter.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-DQbvFGvG.avif`,"../images/bricolage/lampe-travail-sans-fil-werckmann-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-sans-fil-werckmann-boite-KL58At6W.avif`,"../images/bricolage/lampe-travail-sans-fil-werckmann-detail.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-sans-fil-werckmann-detail-j_KN6pop.avif`,"../images/bricolage/lampe-travail-sans-fil-werckmann.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-sans-fil-werckmann-DBIycGbc.avif`,"../images/bricolage/lampe-travail-trepier-werckmann-allumee.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-trepier-werckmann-allumee-CQBA4dBf.avif`,"../images/bricolage/lampe-travail-trepier-werckmann-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-trepier-werckmann-boite-B1U6B7m2.avif`,"../images/bricolage/lampe-travail-trepier-werckmann.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-trepier-werckmann-CBQTY0FS.avif`,"../images/bricolage/multiprise-pro-max-triple-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/multiprise-pro-max-triple-boite-DfDB75hT.avif`,"../images/bricolage/multiprise-pro-max-triple-detail.avif":`/~ribatet1/SAE-3.01/Base/assets/multiprise-pro-max-triple-detail-CHIPEjeb.avif`,"../images/bricolage/multiprise-pro-max-triple.avif":`/~ribatet1/SAE-3.01/Base/assets/multiprise-pro-max-triple-BPa04KDQ.avif`,"../images/habitat/boule-lumineuse-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/boule-lumineuse-boite-BzG9_fWl.avif`,"../images/habitat/boule-lumineuse-cable.png":`/~ribatet1/SAE-3.01/Base/assets/boule-lumineuse-cable-BdbxzmYB.png`,"../images/habitat/boule-lumineuse.avif":`/~ribatet1/SAE-3.01/Base/assets/boule-lumineuse-BKdLDzjB.avif`,"../images/habitat/couette-sans-housse-beige-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-beige-zoom-DLIJrnxN.avif`,"../images/habitat/couette-sans-housse-beige.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-beige-DyE4rrQ7.avif`,"../images/habitat/couette-sans-housse-blanche-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-blanche-zoom-Dczs4QaA.avif`,"../images/habitat/couette-sans-housse-blanche.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-blanche-COoqT0Df.avif`,"../images/habitat/couette-sans-housse-noire-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-noire-zoom-BFKrSxbj.avif`,"../images/habitat/couette-sans-housse-noire.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-noire-B9E-IJVb.avif`,"../images/habitat/couette-sans-housse-sac.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-sac-DJnKY3JV.avif`,"../images/habitat/oreiller-mousse-memoire-forme-dessus.avif":`/~ribatet1/SAE-3.01/Base/assets/oreiller-mousse-memoire-forme-dessus-CmAwF7Ow.avif`,"../images/habitat/oreiller-mousse-memoire-forme-sachet.avif":`/~ribatet1/SAE-3.01/Base/assets/oreiller-mousse-memoire-forme-sachet-DCLiQeTC.avif`,"../images/habitat/oreiller-mousse-memoire-forme.avif":`/~ribatet1/SAE-3.01/Base/assets/oreiller-mousse-memoire-forme-XNN87-XU.avif`,"../images/habitat/rideaux-velours-beige-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-beige-boite-2F0lCa7v.avif`,"../images/habitat/rideaux-velours-beige-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-beige-zoom-DAMrAkI9.avif`,"../images/habitat/rideaux-velours-beige.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-beige-rkMrkhe8.avif`,"../images/habitat/rideaux-velours-rose-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-rose-boite-DT8x0SOi.avif`,"../images/habitat/rideaux-velours-rose-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-rose-zoom-T7Ny8J_8.avif`,"../images/habitat/rideaux-velours-rose.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-rose-CNkcMHz3.avif`,"../images/habitat/serviette-cuivre-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-cuivre-zoom-3iPaP7EM.avif`,"../images/habitat/serviette-cuivre.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-cuivre-D8Yz88Ej.avif`,"../images/habitat/serviette-invite-noire-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-noire-zoom-Bv1AaHhL.avif`,"../images/habitat/serviette-invite-noire.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-noire-CQYcjFoo.avif`,"../images/habitat/serviette-invite-orange-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-orange-zoom-CYD4M7Vk.avif`,"../images/habitat/serviette-invite-orange.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-orange-BW_j71D4.avif`,"../images/habitat/serviette-invite-verte-longueur.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-verte-longueur-CYmtp2-i.avif`,"../images/habitat/serviette-invite-verte-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-verte-zoom-D8bN77Xs.avif`,"../images/habitat/serviette-invite-verte.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-verte-H380OaA4.avif`,"../images/habitat/serviette-noire-longueur.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-noire-longueur-CcaH3Jku.avif`,"../images/habitat/serviette-noire.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-noire-CmooFf5M.avif`,"../images/habitat/serviette-verte.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-verte-Cjt8Z8eK.avif`,"../images/habitat/taies-oreiller-hotel-royal-blanc.avif":`data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAAGNbWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAsaWxvYwAAAABEAAACAAEAAAABAAAJcwAABcYAAgAAAAEAAAG1AAAHvgAAAEJpaW5mAAAAAAACAAAAGmluZmUCAAAAAAEAAGF2MDFDb2xvcgAAAAAaaW5mZQIAAAAAAgAAYXYwMUFscGhhAAAAABppcmVmAAAAAAAAAA5hdXhsAAIAAQABAAAAw2lwcnAAAACdaXBjbwAAABRpc3BlAAAAAAAAAoAAAAKAAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgSQAAAAAABNjb2xybmNseAACAAIAAYAAAAAOcGl4aQAAAAABCAAAAAxhdjFDgQQcAAAAADhhdXhDAAAAAHVybjptcGVnOm1wZWdCOmNpY3A6c3lzdGVtczphdXhpbGlhcnk6YWxwaGEAAAAAHmlwbWEAAAAAAAAAAgABBAECgwQAAgQBBYYHAAANjG1kYXQSAAoHGSZn+f+FQDKwDxGgBhhQ9ME0R8c1BVZ8w+woC/qL96f7zUF7mXseYtVukkVh4aAw5h5zMsBvktulAbsGUppMyZoedARzhVFuEMp2KLzp9mPgMERj4b0Fg8VNwZRVpx91dJneSUmsyTdto6ZOGOxuyDzPfWDN0XJH4q95CQ70azd34icqcvY+VxDaQa2vOuJIg2si5PLVBz0eCcTmG7KWgyS2fLw3cKGebpzDEkDru6z6ePzG/qnpFZhGku7vov9Ds9GNobQXG/Y7BbRWA2nCFjrhKJf7A451aIon+ENPsDQlg4xv4e1sCdUvBHWqTehEh4cjUcSfq3lLMAnbz7+5ke9iTjnrra3CQgIjHTc6og2cXBhdftjfpDGYeMLkixugvBWAuEuKiG7aNL3XDy0TLMyxjzvmr6W31tWdnGB0wFBpShPhog/YiIB/OxmAUIS+uU8P3kx1SYId3TLnE22fSRg03DzKdS/ipB0ySGhIeMJENnr/arsHD+CiOgmFoo7R+VujKIwoT02x0WT/Ui8KcQNjmkj4Ahh8JwKqRuf2rqVmtLGgS3Z5CUcZaWTJxaR3aZfSuc+pX/TuJv/j7enTpVNAMfAxM0nyNVcd4T6H8gvBaMy5kAm7tS1TYL1lyiBq9MRzO/vGYPhDOjqz3Yi2N3xk34wz9a5x3DeiSIJfQAaldViC6iFfjqjMy4dkdJGwy4Aa7kxg6q9Gk6hZcPLeYvabLBtK69yeb1n61CzjG7yjj6DfUUhKTse4e9LveEXAwlmqDV8f/9NeNleQOTfRfld5RBFT5tobRsr9i+d5RHHeD2XOsnY6VU1THHSfcmQd2a216//XxsFxTW/bk/zFhowmJKYQPecg1O4artIdcnZxkP0+2TYmuiIJxpB+rgCpNwHIKGVL+a6GoVm7xLBkm7nfCRTslDnAHlBSQjXv9CeoYJNYKJaVgimg7ko1KZpJ7rK84n7gCGrsHchVLz0mH9juL5G91Gliw4OfY1Q2oAAmxSiYVgXuaI98KfnVC0iPtcIrJdWnzWKCz51DvxMcDoR37hz1n9WUeJeTMS0oH5E9Jq67dyr+f83+sUT1o8JAyAxYuwUJjNz8rPBgtg8nqUHGhX+YpRmDsxr1jzkXKengS0i4gDtD7EG5Yt1Jv5LxYti6FROIDrgrC2jkHR6mkayBd5mnUi8SuxZfCMwWVIVqtibWPhi0aY4xggX4KV7EhP37MIjdcXHIh1yrUapUCRXlEeJQQBzaUxTjKPB+RvNJwoUJE8Ss0v23rggcEjlPLBbi4wKVhSl2YnZ4iRHikQoI08VE/M7tnlbDk/oBiKBqZXmes+zJLXOE9F+VuUi4HnH0m8YnN0m22JZaFdPmHBpxLwEo9UlaGrjTygyOvcuuqzwPheyHjX/XV5Q3hBr5biHxmC+X/Od6r8B6V/Mh+joUtyhyRQt7Za2mV+QKZyhJEO87VOn2pFAcTI2dGxoH2E3REfDZbyPrTX7mAwQQiaoO8CgCoI+AWZ+umEeuyMp2AW8w+fpRKjRvygum4cIq55Nsh61UZ/Dhu4AlJXzZtPJDPmTuoxFEIbECamrVL+KcFm+n6TkomWUpE10Ums6pJZy2ACmLbwQW/AUkHAYzqV9PGtSeRXId0VwJqxWNMaxQnt4bPNl/IA5N6CrG7PMALWJQHCSSHyqpyl8TmGowUp4lm/Ol6QKMBwf0CEIHZ9EAOtCI9xx3skXIn14XzyAmSX3NENuPmD9ZHm5XyhTX6zEQQVUCiOj9xz9H49b/aD8i3A0Ryk31y4TMNd9HMtnMBP39FAOxO2kcE6YTgFYI7X/8UUnvZeZea6ltiCxP7wJ/mnwmhPossKHq3TrF5oRDO3ImsNPFhAzZjrrIuv4uunszDnogBp/gOaaHcEgmQrrKS+O5X1e7HBfVJ/pCDbU9m5Qu1f4Uu78V8reGOTw099mmhyGkWXWh8wfNPdzOuWd8aOeJaU9yi2OwTY7bNP8Y1eUejd4TWV8bAzyljQ5mW2fVNHmUjYK2Puf7xRQev/tckIfLwUdrrMiBD5NoNETW1pN+1eusHfTag4dT+WycfxqXeWKbVJ1xvxJ3FtHhbKOq9JfXVWq5gJwtvK/CJN3z+UhuqRjYOkAg7mO1BKusG8NvNesZkFYPnBywMqrueRYGp/hyJQ/BIG/VXRkImC54AzP94VxEtXF5DPQmj7CecEqgUCywEYubVZwP6UFvBxknjHopocGWRXg85ITI5C3cBb689Y/J48s+5ypuYRvkzk4KofAr+0wVUpC8zJVB5J5FrlaH58Jivv0n5gyaEm3EXLYGrrsAxMYMPUoNNAtxW6H/UStG1pTwUfz8Dr0Q/NutqKtw2Ppea2FUzptQO1AJXqgU3Q35lNwL53GOAa+swakeiBTrcONSALK9rWqT11mKp5b66GXx8IGuc4AcYmmZVDnAcwm0BTTsE11hxdFiwe93iiWzG828lcIzYv85rLA/b4T3NjGlBRy8c4RlVWNfLe5J1pUywoMnSzqstnVS5NaWMbCEZO/GWnomRgB648ysBITg5LnL8fFXSaBLGD/HdBgED2WeaSePbZCn71FCeVkfWadO03Hjwp/jIiFV1CCKCFKgFG8VZjVbb325CLDZZ33D7Chse3pzRBIACgo5Jmf5/4QICAZAMrULRGgAYYYYUPS61/riCRU2dQGRAAYYrs5JNyM0OlrVPPRlMF83fFH8mpUQXB5nqS4cqHhp/tzjjkHnlH5GOH/K4oey5rAGaYjL4CUZVLuWI+TOOKBznFlbHH2DtsBb8XrBG5BXRYsS1NY5+rI7M9vV3m9xilskaFnUF5sWA4unqDYf8vw5M1pGBxpcsXTgiOigVGLvKBjn0oTcWIyefq/cJQz/X2ikdksHLCP9GOvhKnb7EA99w5dmwV7qZDJaQ+D6csI3j2VbEXrz7gkeb6FmVjPa+lsjtAeqtYGO8fJcBGfNtEnQAkaUBsL6k4dKWCBWGJMO9vy+UuLpZIhCcsS4SaSRD/UVhuFqzVfD/nG1L3ZeAvmekdfBc8hjQOBRmAQ3Z98PDCY/3hc+75U0pCN+hFqbbAfmP3gvWgCdZISB/xPDEVYppmLHyliEebUjzfdbHSsCzajQg+F34PqnJupFpnjto3wG4CUIklg5pk8fwfXhkXtbtoBY0rtqlejkiQrXii7U4eaouC2Ksrvdx/BLYaGMZuQhAWcuTpYOKC86SbVVPtTIHKZTdbDqLWuLcNKIBW+FYUFILsTX1v6lSjWmnnLDfGjfFO0E5eWeHQMlQ0IdQBZrD2DwwyBpFdQa5nvTwFcc/npSHrhjr4DsRz4zVyGHeGEfsHfsm20NCOPgvDk/kT9ryz1Htz0WLWydCnolK9PGyV+86XFo4GWGYi74WPPVPDz4S4zLlnv+Rxqzza8Baz9fzZRFS8cnPyExiMxCrjm+aH2BEk7htRk7YYswVNs9Che6x6/JLSDhMxgGQ5mdjRE9E1nXl6rj/ql4jaTDYZSwK8NpXT2n3ESlOeynHlqkuWcrShDjIT1BSzODIzH5lFDWVRYmqy0uYm1gBYJmvb1Ddfv0qte+qRVITQbgSzuoi4dHwMyBnNQomK/JvJEK4Psvhz+44taF4CsuWI8igaMw/rgAifod2vI0sF86oOFNS5G8sl19dLtL6yB58v2tLzRdIjm1343BOy9fI0pU+SZej2XdSzXXje+55/MqgTMLp75lA0eM15qa0IQAwaZOXM/cyiYVS8MK6aL/91ZTJK8Dz83pZlrAW6ydQyxuwHFSWQK9acYry5btaBUc9OHz3jz+9sn9f/TfoOep3iui1DSvJ83I0TFDBlsAjB/P9KDpr3xPdbnWXkwz15qm3u53jTcQVsYL/HEgKiPM28/LhpXMwIu9M5iQkXxou9JWv/FTqj8e1DxOsxTb1Ftzk0+vgPdRDOAuEjoDFtg60UXZp7Cyazu8IeQhKJ8DKiFVytpBRG4wPOUyo1nMqgbtAVGZL4WOaHJCBqmjBsc2gaAU729NSxJO3BkmUVy1IvQsj82Dq+ACNAuK1VnTDnBPkN68O6QKrG0QGOIxYoANZSFh8FFKpbuh2RqI43qLAH+gQtwYJyb6b/ozC5MPUHtyyn7VgtQROUBGqlsDVXsSqJHSunI3VrHO2DjkD31T9e3efzNrMoLvgDug1FPe3dOD7XyFKTgO4s0eSf01RWmMDc774ZQPU2JBnpDjc+HsxwUpJb9A5mF3gookZZDaFM9jVmdL0c0Yo5oyyw2eZAohKMHJofE6VLLtXEe3Wdg+nMObWM3OnkdWeEC4+F4FuMzPnRQNfbPnB6ZVnnOrUgIJrXGOAtT/WHq7VbBklsi6XPLXCbDlHXWYzNpYSKj87FTxXz14WiwCpic3jqGLAc6YGkYiOEIsmbiI7rQdsC4KiW1hbhqPmJ/D5StKLhtZh8/Pwk9sumR2jVmlpSMKJl492mQv60iNWT/06y1IREvlptW4kkDl3iYiuzP9scivEz3tnTBZQDRoq4MxG2s9KV39WnnrocAO4G/LhhvfNpf6tmYotYjiZBQNs9GWs8izwkSUASnUjObiDPMe8f8mEXVv0mzJ8U2lrbzL70EGypaa7mJp7Rk99Y/A`,"../images/habitat/taies-oreiller-hotel-royal-bleu-seul.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-bleu-seul-DCGqeneR.avif`,"../images/habitat/taies-oreiller-hotel-royal-bleu-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-bleu-zoom-C92Wi9t5.avif`,"../images/habitat/taies-oreiller-hotel-royal-bleu.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-bleu-NfJ5o17X.avif`,"../images/habitat/taies-oreiller-hotel-royal-rose-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-rose-boite-Cwgi5e-a.avif`,"../images/habitat/taies-oreiller-hotel-royal-rose.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-rose-C9WZUMDM.avif`,"../images/hobby/crayons-aquarelle-van-bleiswijck-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/crayons-aquarelle-van-bleiswijck-boite-Do2k5YTH.avif`,"../images/hobby/crayons-aquarelle-van-bleiswijck-complet.avif":`/~ribatet1/SAE-3.01/Base/assets/crayons-aquarelle-van-bleiswijck-complet-DQMZByHG.avif`,"../images/hobby/crayons-aquarelle-van-bleiswijck.avif":`/~ribatet1/SAE-3.01/Base/assets/crayons-aquarelle-van-bleiswijck-CKdSf73d.avif`,"../images/hobby/paillettes-blanc-a-rose.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-blanc-a-rose-ByHqHq3F.avif`,"../images/hobby/paillettes-fushia-a-bleu.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-fushia-a-bleu-CKJFBOmJ.avif`,"../images/hobby/paillettes-rose-a-orange.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-rose-a-orange-BChwCw1E.avif`,"../images/hobby/paillettes-sac.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-sac-H030CzW4.avif`,"../images/hobby/peinture-acrylique-van-bleiswijck-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/peinture-acrylique-van-bleiswijck-boite-fbr9r4GC.avif`,"../images/hobby/peinture-acrylique-van-bleiswijck.avif":`/~ribatet1/SAE-3.01/Base/assets/peinture-acrylique-van-bleiswijck-DA9rPbSx.avif`,"../images/hobby/pinceaux-van-bleiswijck-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/pinceaux-van-bleiswijck-boite-CW3Tcveo.avif`,"../images/hobby/pinceaux-van-bleiswijck-fins.avif":`/~ribatet1/SAE-3.01/Base/assets/pinceaux-van-bleiswijck-fins-Dl4gXi2j.avif`,"../images/hobby/pinceaux-van-bleiswijck-larges.avif":`/~ribatet1/SAE-3.01/Base/assets/pinceaux-van-bleiswijck-larges-Bvn6adHJ.avif`,"../images/hobby/toile-peindre-van-bleiswijck.avif":`/~ribatet1/SAE-3.01/Base/assets/toile-peindre-van-bleiswijck-BEzOszMG.avif`,"../images/logo.webp":`/~ribatet1/SAE-3.01/Base/assets/logo-Cjz4wVmC.webp`});function ge(e){return e?e.startsWith(`uploads/`)?`/~ribatet1/SAE-3.01/Base/`+e:he[`../images/${e}`]??``:``}var w={},_e=function(e){return{...e,prix:Number(e.prix),prix_unitaire:e.prix_unitaire===null?null:Number(e.prix_unitaire),stock:e.stock,seuilAlerte:e.seuil_alerte,src:ge(e.src),options:(e.options||[]).map(e=>({id:e.id,nom:e.nom,ordre:e.ordre,valeurs:(e.valeurs||[]).map(e=>({id:e.id,valeur:e.valeur,prixSupplement:e.prix_supplement===null?0:Number(e.prix_supplement),ordre:e.ordre}))}))}},ve=function(e){return{chemin:e.chemin,src:ge(e.chemin),alt:e.texte_alternatif??``,ordre:Number(e.ordre??0)}};w.fetchPage=async function(e,t,n=null){let r=`produits?page=${e}`;n!=null&&n!==``&&(r+=`&categorie=${encodeURIComponent(n)}`),t!==void 0&&(r+=`&tri=${encodeURIComponent(t.tri)}&parPage=${t.parPage}`);let i=await d(r);return{...i,produits:i.produits.map(_e)}},w.fetchBySlug=async function(e){let t=await d(`produits/${encodeURIComponent(e)}`);return{...t,produit:_e(t.produit),galerie:(t.galerie??[]).map(ve),options:(t.options??[]).map(e=>({id:e.id,nom:e.nom,ordre:e.ordre,valeurs:(e.valeurs??[]).map(e=>({id:e.id,valeur:e.valeur,prixSupplement:e.prix_supplement===null?0:Number(e.prix_supplement),ordre:e.ordre}))}))}};function ye(e){return{id:e.id,reference:e.reference,slug:e.slug,nom:e.nom,categorieId:e.categorie_id,categorie:e.categorie,marque:e.marque??``,format:e.format??``,description:e.description??``,prix:Number(e.prix),prixUnitaire:e.prix_unitaire===null?``:Number(e.prix_unitaire),unitePrix:e.unite_prix??``,badge:e.badge??``,stock:e.stock,seuilAlerte:e.seuil_alerte,images:(e.images??[]).map(e=>({id:e.id,src:ge(e.chemin),alt:e.texte_alternatif??``}))}}w.fetchAdminListe=async function(e=1,t){let n=`admin/produits?page=${e}`;t!==void 0&&(n+=`&tri=${encodeURIComponent(t.tri)}&parPage=${t.parPage}`);let r=await d(n);return{...r,produits:r.produits.map(ye)}},w.creer=async function(e){return ye((await f(`admin/produits`,e)).produit)},w.modifier=async function(e,t){return ye((await p(`admin/produits/${encodeURIComponent(e)}`,t)).produit)},w.supprimer=function(e){return m(`admin/produits/${encodeURIComponent(e)}`)},w.ajouterImage=function(e,t){return f(`admin/produits/${encodeURIComponent(e)}/images`,t)},w.supprimerImage=function(e,t){return m(`admin/produits/${encodeURIComponent(e)}/images/${encodeURIComponent(t)}`)},w.fetchAdminOptions=function(e){return d(`admin/produits/${encodeURIComponent(e)}/options`).then(e=>e.options)},w.creerOption=function(e,t){return f(`admin/produits/${encodeURIComponent(e)}/options`,t).then(e=>e.options)},w.modifierOption=function(e,t){return p(`admin/produits/options/${encodeURIComponent(e)}`,t).then(e=>e.options)},w.supprimerOption=function(e){return m(`admin/produits/options/${encodeURIComponent(e)}`).then(e=>e.options)},w.ajouterValeur=function(e,t){return f(`admin/produits/options/${encodeURIComponent(e)}/valeurs`,t).then(e=>e.options)},w.modifierValeur=function(e,t){return p(`admin/produits/valeurs/${encodeURIComponent(e)}`,t).then(e=>e.options)},w.supprimerValeur=function(e){return m(`admin/produits/valeurs/${encodeURIComponent(e)}`).then(e=>e.options)};var be=`<div class="mb-6 flex flex-wrap items-end gap-4 rounded-lg border p-4 border-border-default c-barre-outils">\r
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
`,xe={html:function(e){return n(be,{libelleTotal:`produits`,libelleParPage:`Produits par page`,libelleUnite:`produits`,...e})},dom:function(e,t){let n=r(xe.html(e)),i=n.querySelector(`select[name="tri"]`),a=n.querySelector(`select[name="parPage"]`);return i&&(Array.isArray(e.optionsTri)&&i.replaceChildren(...e.optionsTri.map(({valeur:e,libelle:t})=>{let n=document.createElement(`option`);return n.value=e,n.textContent=t,n})),i.value=e.tri,i.addEventListener(`change`,()=>t.surTri(i.value))),a&&(a.value=String(e.parPage),a.addEventListener(`change`,()=>t.surParPage(Number(a.value)))),n}},Se=`<nav aria-label="Fil d'Ariane" class="mb-4 c-fil-ariane">
  <ol data-zone="items" class="flex flex-wrap items-center gap-2 text-14"></ol>
</nav>`,Ce={html:function(){return Se},dom:function(e=[]){let t=r(Se),n=t.querySelector(`[data-zone="items"]`);return e.forEach((t,r)=>{let i=r===e.length-1,a=document.createElement(`li`);if(a.className=`flex items-center gap-2`,i||!t.lien){let e=document.createElement(`span`);e.textContent=t.libelle,e.className=`font-medium text-zinc-900 dark:text-zinc-100`,i&&e.setAttribute(`aria-current`,`page`),a.appendChild(e)}else{let e=document.createElement(`a`);e.href=t.lien,e.dataset.link=``,e.textContent=t.libelle,e.className=`text-zinc-500 underline hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200`,a.appendChild(e)}if(!i){let e=document.createElement(`span`);e.textContent=`/`,e.setAttribute(`aria-hidden`,`true`),e.className=`text-zinc-400`,a.appendChild(e)}n.appendChild(a)}),t}},we=`<span class="inline-flex items-center gap-1.5 border px-2 py-0.5 text-12 font-medium backdrop-blur-xs shadow-2xs {{classes}} c-badge-stock">
  <svg class="h-3 w-3 shrink-0 {{iconClasse}}" aria-hidden="true">
    <use href="#{{id-icon}}"/>
  </svg>
  {{texte}}
</span>
`,Te={"En stock":{classes:`border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/80 dark:text-emerald-300`,iconClasse:`fill-emerald-500 dark:fill-emerald-400`,idIcon:`icon-circle`},"Bientôt épuisé":{classes:`border-amber-200 bg-amber-50/90 text-amber-800 dark:border-amber-800/80 dark:bg-amber-950/80 dark:text-amber-300`,iconClasse:`fill-amber-500 dark:fill-amber-400 animate-pulse`,idIcon:`icon-alert-triangle`},Épuisé:{classes:`border-rose-200 bg-rose-50/90 text-rose-800 dark:border-rose-800/80 dark:bg-rose-950/80 dark:text-rose-300`,iconClasse:`fill-rose-500 dark:fill-rose-400`,idIcon:`icon-circle`}};function Ee(e={}){if(e?.etat){let t=String(e.etat).toLowerCase().trim();return t.includes(`bientot`)||t.includes(`faible`)||t.includes(`alerte`)?`Bientôt épuisé`:t.includes(`épuisé`)||t.includes(`epuise`)||t.includes(`rupture`)?`Épuisé`:`En stock`}return typeof e?.stock==`number`?e.stock<=0?`Épuisé`:e.stock<=(e.seuilAlerte??5)?`Bientôt épuisé`:`En stock`:`En stock`}var De={html:function(e={}){let t=Ee(e),r=Te[t]||Te[`En stock`];return n(we,{texte:t,classes:r.classes,iconClasse:r.iconClasse,"id-icon":r.idIcon})},dom:function(e={}){return r(De.html(e))}},Oe=`<article class="flex flex-col justify-between overflow-hidden rounded-lg border bg-surface-default shadow-xs transition-shadow hover:shadow-md border-border-default c-carte-produit">\r
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
`,ke={html:function(e={}){let t=typeof e.prix==`number`?e.prix.toFixed(2).replace(`.`,`,`):String(e.prix||`0,00`);return n(Oe,{nom:e.nom||``,prix:t,src:e.src||e.image||``,alt:e.alt||e.nom||`Produit Action`,lien:e.lien||(e.slug?`/produit/${e.slug}`:e.id?`/produit/${e.id}`:`#`)})},dom:function(e={},t={}){let n=r(ke.html(e)),i=n.querySelector(`slot[name="badge-stock"]`);i&&i.replaceWith(De.dom({etat:e.etat,stock:e.stock,seuilAlerte:e.seuilAlerte}));let a=n.querySelector(`[data-action="ajouter-panier"]`),o=e.etat===`Épuisé`||e.etat===`epuise`||e.stock===0;return a&&(o?(a.disabled=!0,a.textContent=`Épuisé`):t.surAjouterPanier&&a.addEventListener(`click`,()=>t.surAjouterPanier(e.id))),n}},Ae=`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 c-grille-produits">
  <slot name="cartes"></slot>
</div>
`,je=`<p class="text-14 text-text-secondary c-grille-produits__vide">
    Aucun produit à afficher.
</p>
`,Me={dom:function(e=[],t={}){if(!e||e.length===0)return r(je);let n=r(Ae),i=e.map(e=>ke.dom(e,t)),a=n.querySelector(`slot[name="cartes"]`);return a&&a.replaceWith(...i),n}},Ne=`<p role="status" class="mb-6 rounded-md border px-4 py-3 text-14 {{couleurs}} c-message">{{texte}}</p>
`,Pe={erreur:`border-red-700 text-red-700 dark:border-red-400 dark:text-red-400`,succes:`border-green-700 text-green-700 dark:border-green-400 dark:text-green-400`,info:`border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400`},T={html:function(e){return!e||!e.texte?``:n(Ne,{texte:e.texte,couleurs:Pe[e.type]||Pe.erreur})},dom:function(e){return r(T.html(e))}},Fe=`<nav class="mt-10 flex items-center justify-center gap-4 c-pagination">
  <button type="button" data-action="precedente" class="h-9 rounded-md border px-4 text-14 font-medium transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent border-border-default">
    Précédent
  </button>

  <span class="text-14 text-text-secondary">Page {{page}} sur {{pagesTotal}}</span>

  <button type="button" data-action="suivante" class="h-9 rounded-md border px-4 text-14 font-medium transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent border-border-default">
    Suivant
  </button>
</nav>
`,E={html:function(e){return n(Fe,{page:e.page||1,pagesTotal:e.pagesTotal||1})},dom:function(e,t={}){let n=r(E.html(e)),i=n.querySelector(`[data-action="precedente"]`),a=n.querySelector(`[data-action="suivante"]`);return i&&(i.disabled=e.page<=1,t.surPage&&i.addEventListener(`click`,()=>t.surPage(e.page-1))),a&&(a.disabled=e.page>=e.pagesTotal,t.surPage&&a.addEventListener(`click`,()=>t.surPage(e.page+1))),n}},Ie=`<section class="mx-auto max-w-5xl px-6 pt-10 pb-16">
  <slot name="ariane"></slot>
  <h1 class="mb-6 text-2xl font-semibold tracking-tight">Catalogue</h1>

  <slot name="barre-outils"></slot>
  <slot name="message"></slot>
  <slot name="grille"></slot>
  <slot name="pagination"></slot>
</section>
`,D={catalogue:null,message:null,categorieSlug:null,categorieLibelle:null},O={};O.charger=async function(e,t,n=D.categorieSlug){try{D.catalogue=await w.fetchPage(e,t,n),D.message=null}catch(e){D.catalogue=null,D.message={type:`erreur`,texte:`Impossible de charger le catalogue : ${e.message}`}}},O.handler_changerTri=async function(e){await O.charger(1,{tri:e,parPage:D.catalogue.parPage},D.categorieSlug),k.rafraichir()},O.handler_changerParPage=async function(e){await O.charger(1,{tri:D.catalogue.tri,parPage:e},D.categorieSlug),k.rafraichir()},O.handler_changerPage=async function(e){await O.charger(e,{tri:D.catalogue.tri,parPage:D.catalogue.parPage},D.categorieSlug),k.rafraichir(),window.scrollTo({top:0,behavior:`smooth`})},O.handler_ajouterPanier=function(e){let t=(D.catalogue?.produits??[]).find(t=>String(t.id)===String(e));t&&te(t,1)},O.init=async function(e=null){return D.categorieSlug=e!=null&&e!==``?e:null,await O.charger(1,void 0,D.categorieSlug),D.categorieLibelle=D.catalogue?.categorie?.libelle??D.categorieSlug,k.init()};var k={};k.racine=null,k.init=function(){let e=k.createPageFragment();return k.racine=e.firstElementChild,e},k.rafraichir=function(){let e=k.createPageFragment(),t=e.firstElementChild;k.racine.replaceWith(e),k.racine=t},k.createPageFragment=function(){let e=r(Ie),t=D.categorieSlug===null?[{libelle:`Catalogue`}]:[{libelle:`Catalogue`,lien:`/`},{libelle:D.categorieLibelle}];if(e.querySelector(`slot[name="ariane"]`).replaceWith(Ce.dom(t)),e.querySelector(`slot[name="message"]`).replaceWith(T.dom(D.message)),D.catalogue===null){for(let t of e.querySelectorAll(`slot`))t.remove();return e}return e.querySelector(`slot[name="barre-outils"]`).replaceWith(xe.dom(D.catalogue,{surTri:O.handler_changerTri,surParPage:O.handler_changerParPage})),e.querySelector(`slot[name="grille"]`).replaceWith(Me.dom(D.catalogue.produits,{surAjouterPanier:O.handler_ajouterPanier})),e.querySelector(`slot[name="pagination"]`).replaceWith(E.dom(D.catalogue,{surPage:O.handler_changerPage})),e};function Le(e={}){return O.init(e.slug??e.Slug??e.categorie??null)}var Re=`Click & Collect`;function A(e,t,n){if(!n)return;let r=document.head.querySelector(`meta[${e}="${t}"]`);r||(r=document.createElement(`meta`),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute(`content`,n)}function ze(e){if(!e)return;let t=document.head.querySelector(`link[rel="canonical"]`);t||(t=document.createElement(`link`),t.setAttribute(`rel`,`canonical`),document.head.appendChild(t)),t.setAttribute(`href`,e)}function Be(e=`/`){let t=`/~ribatet1/SAE-3.01/Base/`.replace(/\/$/,``),n=e.startsWith(`/`)?e:`/${e}`;return`${window.location.origin}${t}${n}`}function Ve(e){return e?/^https?:\/\//.test(e)?e:`${window.location.origin}${e}`:``}function He({titre:e,description:t,image:n,chemin:r,type:i=`website`}={}){let a=e?`${e} | ${Re}`:Re,o=r?Be(r):window.location.href;if(document.title=a,A(`name`,`description`,t),A(`property`,`og:site_name`,Re),A(`property`,`og:title`,a),A(`property`,`og:description`,t),A(`property`,`og:type`,i),A(`property`,`og:url`,o),A(`property`,`og:locale`,`fr_FR`),A(`name`,`twitter:card`,n?`summary_large_image`:`summary`),A(`name`,`twitter:title`,a),A(`name`,`twitter:description`,t),n){let e=Ve(n);A(`property`,`og:image`,e),A(`name`,`twitter:image`,e)}ze(o)}var Ue=`<div class="w-fit inline-flex items-center rounded-md border border-border-default c-boutons-quantite">
    <button type="button" data-action="moins" aria-label="Diminuer la quantité" class="h-10 w-10 text-18 hover:bg-surface-subtle disabled:opacity-40">
    −
    </button>
    <input type="number" name="quantite" min="1" value="1" aria-label="Quantité" class="h-10 w-14 bg-transparent text-center text-14" />
    <button type="button" data-action="plus" aria-label="Augmenter la quantité" class="h-10 w-10 text-18 hover:bg-surface-subtle disabled:opacity-40">
    +
    </button>
</div>`,j={html:function(){return Ue},ajuster:function(e,t=1,n=1/0){let r=parseInt(e,10);return Number.isNaN(r)&&(r=t),Math.min(Math.max(r,t),n)},dom:function(e={},t={}){let n=e.min??1,i=e.max??1/0,a=r(Ue),o=a.querySelector(`input[name="quantite"]`),s=a.querySelector(`[data-action="moins"]`),c=a.querySelector(`[data-action="plus"]`);o.min=n,Number.isFinite(i)&&(o.max=i);let l=(e,r=!0)=>{let a=j.ajuster(e,n,i);o.value=a,s.disabled=a<=n,c.disabled=a>=i,r&&t.surChange&&t.surChange(a)};return o.value=j.ajuster(e.valeur??n,n,i),s.disabled=o.value<=n,c.disabled=o.value>=i,s.addEventListener(`click`,()=>l(Number(o.value)-1)),c.addEventListener(`click`,()=>l(Number(o.value)+1)),o.addEventListener(`change`,()=>l(o.value)),a}},We=`<figure class="flex flex-col gap-3 w-full c-galerie-images">
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
</figure>`,Ge={html:function(){return We},dom:function(e=[],t={}){let n=r(We),i=n.querySelector(`[data-zone="principale"]`),a=n.querySelector(`[data-zone="miniatures"]`),o=n.querySelector(`[data-action="precedent"]`),s=n.querySelector(`[data-action="suivant"]`),c=0,l=[],u=t.activeChemin??null,d=n.querySelector(`[data-zone="index-image"]`),f=n.querySelector(`[data-zone="total-images"]`);f&&(f.textContent=String(e.length||1)),e.length<=1&&(o&&(o.hidden=!0),s&&(s.hidden=!0));let p=function(){if(u!==null){let t=e.findIndex(e=>e.chemin===u);if(t!==-1)return t}return 0},m=t=>{c=(t+e.length)%e.length,i.src=e[c].src,i.alt=e[c].alt||``,d&&(d.textContent=String(c+1)),l.forEach((e,t)=>e.setAttribute(`aria-current`,t===c?`true`:`false`))};return e.forEach((e,t)=>{let n=document.createElement(`button`);n.type=`button`,n.setAttribute(`aria-label`,`Voir l'image ${t+1}`),n.className=`h-16 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 aria-[current=true]:border-zinc-950 dark:aria-[current=true]:border-zinc-50`;let r=document.createElement(`img`);r.src=e.src,r.alt=``,r.className=`h-full w-full object-contain`,n.appendChild(r),n.addEventListener(`click`,()=>m(t)),a.appendChild(n),l.push(n)}),e.length>0&&m(p()),n}},Ke=`<a href="{{lien}}" data-link class="inline-flex items-center gap-1 text-14 text-text-secondary underline hover:text-text-primary hover:text-text-secondary c-lien-retour">← {{libelle}}</a>`,qe={html:function(e={}){return n(Ke,{libelle:e.libelle??`Retour`,lien:e.lien??`#`})},dom:function(e={}){return r(qe.html(e))}},Je=`<fieldset class="flex flex-col gap-4 c-boutons-options">
  <legend class="sr-only">Options du produit</legend>
  <div data-zone="groupes" class="flex flex-col gap-4"></div>
</fieldset>`,Ye={html:function(){return Je},dom:function(e={},t={}){let n=r(Je),i=n.querySelector(`[data-zone="groupes"]`),a={...e.selection||{}};return(e.options||[]).forEach(e=>{let n=document.createElement(`div`);n.className=`flex flex-col gap-2`;let r=document.createElement(`p`);r.className=`text-sm font-medium text-zinc-900 dark:text-zinc-100`,r.textContent=`${e.nom} : ${a[e.nom]??`non choisi`}`,n.appendChild(r);let o=document.createElement(`div`);o.className=`flex flex-wrap gap-2`,e.valeurs.forEach(n=>{let i=(e.indisponibles||[]).includes(n),s=document.createElement(`label`);s.className=`cursor-pointer rounded-md border border-zinc-200 px-3 py-2 text-sm has-[:checked]:border-zinc-950 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40 dark:border-zinc-800 dark:text-zinc-100 dark:has-[:checked]:border-zinc-50`;let c=document.createElement(`input`);c.type=`radio`,c.name=e.nom,c.value=n,c.className=`sr-only`,c.disabled=i,c.checked=a[e.nom]===n,c.addEventListener(`change`,()=>{a[e.nom]=n,r.textContent=`${e.nom} : ${n}`,t.surChange&&t.surChange({...a})}),s.appendChild(c),s.append(i?`${n} (épuisé)`:n),o.appendChild(s)}),n.appendChild(o),i.appendChild(n)}),n}},Xe=`<article class="flex flex-col gap-5 c-details-produit">\r
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
</article>`,Ze={html:function(e={}){let t=typeof e.prixActuel==`number`?e.prixActuel.toFixed(2).replace(`.`,`,`):String(e.prixActuel||`0,00`);return n(Xe,{nom:e.nom||``,prix:t,description:e.description||``})},dom:function(e={},t={}){let n=r(Ze.html(e)),i=n.querySelector(`slot[name="badge-stock"]`);i&&i.replaceWith(De.dom({etat:e.etat,stock:e.stock,seuilAlerte:e.seuilAlerte}));let a=n.querySelector(`[data-zone="options"]`);a&&a.replaceWith(Ye.dom({options:e.options||[],selection:e.selection||{}},{surChange:n=>{let r=e.selection||{};for(let i of e.options||[]){let e=n[i.nom];e!==void 0&&e!==r[i.nom]&&t.surSelectionChange&&t.surSelectionChange(i.nom,e)}}}));let o=n.querySelector(`slot[name="quantite"]`);o&&o.replaceWith(j.dom({valeur:e.quantite??1,min:1,max:e.stock},{surChange:e=>{t.surQuantite&&t.surQuantite(e)}}));let s=n.querySelector(`slot[name="galerie"]`);s&&s.replaceWith(Ge.dom(e.images??[],{activeChemin:e.activeChemin}));let c=n.querySelector(`slot[name="lien-retour-catalogue"]`);c&&c.replaceWith(qe.dom({libelle:e.libelleCatalogue??`Tous les produits`,lien:e.lienCatalogue??`/`}));let l=n.querySelector(`slot[name="lien-retour-categorie"]`);l&&l.replaceWith(qe.dom({libelle:e.libelleCategorie??`Catégorie`,lien:e.lienCategorie??`/`}));let u=n.querySelector(`[data-action="ajouter-panier"]`),d=e.etat===`Épuisé`||e.stock===0;return u&&(d?(u.disabled=!0,u.textContent=`Épuisé`):t.surAjouterPanier&&u.addEventListener(`click`,()=>{t.surAjouterPanier(e.id)})),n}},Qe=`<section class="mx-auto max-w-6xl px-6 pt-10 pb-16">
  <slot name="ariane"></slot>

  <div data-zone="message"></div>

  <slot name="produit"></slot>
</section>
`,M={slug:null,produit:null,galerie:[],options:[],selection:{},quantite:1,message:null},N={};N.charger=async function(e){try{let t=await w.fetchBySlug(e);M.produit=t.produit,M.galerie=t.galerie,M.options=t.options??[],M.selection={},M.quantite=1,M.message=null}catch(e){M.produit=null,M.galerie=[],M.message={type:`erreur`,texte:e.statut===404?`Ce produit n'existe pas ou n'est plus disponible.`:`Impossible de charger ce produit : ${e.message}`}}},N.mots=function(e){return e.normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase().split(/[^a-z0-9]+/).filter(e=>e!==``)},N.cheminImageActive=function(){if(M.produit===null)return null;for(let e of M.options){let t=M.selection[e.nom];if(t===void 0)continue;let n=N.mots(t);if(n.length===0)continue;let r=M.galerie.find(e=>{let t=(e.chemin??``).split(`/`).pop().replace(/\.[^.]+$/,``),r=N.mots(t);return n.every(e=>r.some(t=>t.startsWith(e)))});if(r)return r.chemin}return null},N.produitAffichage=function(){if(M.produit===null)return null;let e=M.produit.categorie??null;return{...M.produit,images:M.galerie,options:M.options,selection:M.selection,quantite:M.quantite,activeChemin:N.cheminImageActive(),prixBase:Number(M.produit.prix||0),prixActuel:N.prixActuel(),lienCatalogue:`/`,libelleCatalogue:`Tous les produits`,lienCategorie:e?.slug?`/categorie/${e.slug}`:`/`,libelleCategorie:e?.libelle??`Catégorie`}},N.filAriane=function(){let e=[{libelle:`Catalogue`,lien:`/`}],t=M.produit?.categorie;return t?.slug&&e.push({libelle:t.libelle,lien:`/categorie/${t.slug}`}),M.produit&&e.push({libelle:M.produit.nom}),e},N.prixActuel=function(){if(M.produit===null)return 0;let e=0;for(let t of M.options){let n=M.selection[t.nom],r=(t.valeurs||[]).find(e=>e.valeur===n);r&&(e+=r.prixSupplement||0)}return Number(M.produit.prix||0)+e},N.selectionnerOption=function(e,t){M.produit!==null&&(M.selection[e]=t,P.rafraichir())},N.handler_quantite=function(e){M.quantite=Math.max(1,Math.floor(Number(e)||1))},N.handler_ajouterPanier=async function(e){if(M.produit===null)return;let t=e??M.produit.id,n=Number(M.produit.stock)||0,r=M.quantite;if(n<=0){M.message={type:`erreur`,texte:`Ce produit est épuisé et ne peut pas être ajouté au panier.`},P.majMessage();return}r>n&&(r=n,M.message={type:`erreur`,texte:`La quantité demandée dépasse le stock disponible (${n} maximum). La quantité a été ajustée.`});let i=_().find(e=>String(e.id)===String(t)),a=Number(i?.quantite||0),o;try{o=await g([{id:t,quantite:a+r}])}catch{o=null}let s=o?.lignes?.[0];if(s&&!s.estValide){let e=Number(s.quantiteMax)||0;if(r=Math.max(0,e-a),r<=0){M.message={type:`erreur`,texte:s.message||`Ce produit est épuisé.`},P.majMessage();return}M.message={type:`erreur`,texte:`${s.message||``} La quantité a été ajustée à ${r} (maximum autorisé : ${e} au total).`}}else(!M.message||M.message.type!==`erreur`)&&(M.message={type:`succes`,texte:`${M.produit.nom} a été ajouté au panier.`});te({id:t,slug:M.produit.slug,nom:M.produit.nom,prix:N.prixActuel(),stock:M.produit.stock,src:M.galerie[0]?.src??``,options:{...M.selection}},r),P.majMessage()},N.majSeo=function(){if(M.produit===null){He({titre:`Produit introuvable`,description:`Ce produit n'existe pas ou n'est plus disponible.`,chemin:`/`});return}let e=(M.produit.description||``).slice(0,300).trim()||`Fiche produit : ${M.produit.nom}.`;He({titre:M.produit.nom,description:e,image:M.galerie[0]?.src??``,chemin:`/produit/${M.produit.slug}`,type:`product`})},N.init=async function(e){return M.slug=e??null,await N.charger(M.slug),N.majSeo(),P.init()};var P={};P.racine=null,P.zoneMessage=null,P.init=function(){let e=P.createPageFragment();return P.racine=e.firstElementChild,e},P.rafraichir=function(){let e=P.createPageFragment(),t=e.firstElementChild;P.racine.replaceWith(e),P.racine=t},P.majMessage=function(){P.zoneMessage!==null&&P.zoneMessage.replaceChildren(T.dom(M.message))},P.createPageFragment=function(){let e=r(Qe);e.querySelector(`slot[name="ariane"]`).replaceWith(Ce.dom(N.filAriane())),P.zoneMessage=e.querySelector(`[data-zone="message"]`),P.zoneMessage.replaceChildren(T.dom(M.message));let t=e.querySelector(`slot[name="produit"]`);if(M.produit===null){for(let t of e.querySelectorAll(`slot`))t.remove();return e}return t.replaceWith(Ze.dom(N.produitAffichage(),{surAjouterPanier:N.handler_ajouterPanier,surSelectionChange:N.selectionnerOption,surQuantite:N.handler_quantite})),e};function $e(e={}){return N.init(e.slug??e.Slug??null)}var F={};F.login=async function(e,t){return f(`login`,{login:e,mdp:t})},F.register=async function(e,t,n){return f(`register`,{login:e,mdp:t,mdp_confirmation:n})},F.logout=async function(){return f(`logout`)};var et={};et.fetch=async function(){return d(`admin/stats`)};var tt=`<section class="mb-6 rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-formulaires-admin-connexionadmin">
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
`,nt={html:function(e={}){return n(tt,{login:e?.login||``})},dom:function(e={},t={}){let n=r(nt.html(e)),i=n.querySelector(`form`);return i&&i.addEventListener(`submit`,e=>{e.preventDefault(),t.surConnexion&&t.surConnexion(i.elements.login.value.trim(),i.elements.mdp.value)}),n}},rt=`<section class="mb-6 rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-statistiques">
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
`,it=`<li class="flex items-center justify-between py-2.5 c-statistiques__ligne-stats">
  <div class="flex items-center gap-2">
    <span class="font-medium text-text-primary">{{nom}}</span>
    <span class="text-12 text-text-secondary">({{detail}})</span>
  </div>
  <span class="font-semibold text-text-primary">{{valeur}}</span>
</li>
`,at={html:function(e={}){return n(rt,{revenus7j:typeof e.revenus7j==`number`?e.revenus7j.toFixed(2).replace(`.`,`,`):`0,00`,totalCommandes:e.totalCommandes??0,totalProduits:e.totalProduits??0,alertesStock:e.alertesStock??0})},dom:function(e={}){let t=r(at.html(e)),i=t.querySelector(`[data-zone="statuts-commandes"]`);i&&Array.isArray(e.statutsCommandes)&&e.statutsCommandes.forEach(e=>{let t=document.createElement(`div`);t.className=`flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950`,t.innerHTML=`
          <span class="capitalize text-zinc-600 dark:text-zinc-400">${e.statut}</span>
          <span class="font-bold text-zinc-900 dark:text-zinc-100">${e.nombre}</span>
        `,i.appendChild(t)});let a=t.querySelector(`[data-zone="graphique-stocks"]`);if(a&&Array.isArray(e.stocksParProduit)){let t=Math.max(...e.stocksParProduit.map(e=>e.stock||0),1);e.stocksParProduit.forEach(e=>{let n=Math.max(5,Math.round((e.stock||0)/t*100)),r=(e.stock||0)<=(e.seuilAlerte??5),i=document.createElement(`div`);i.className=`flex items-center gap-3 text-xs`;let o=document.createElement(`span`);o.className=`w-40 shrink-0 truncate text-zinc-700 dark:text-zinc-300`,o.textContent=e.nom,o.title=e.nom;let s=document.createElement(`div`);s.className=`h-4 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800`;let c=document.createElement(`div`);c.className=r?`h-full rounded-full bg-amber-500 transition-all duration-300`:`h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300`,c.style.width=`${n}%`;let l=document.createElement(`span`);l.className=`w-8 text-right font-medium text-zinc-900 dark:text-zinc-100`,l.textContent=e.stock,s.appendChild(c),i.append(o,s,l),a.appendChild(i)})}let o=t.querySelector(`[data-zone="top-ventes"]`);return o&&Array.isArray(e.topVentes)&&e.topVentes.forEach(e=>{let t=n(it,{nom:e.nom||`Article`,detail:`${e.quantite||0} vendus`,valeur:e.totalVentes?`${Number(e.totalVentes).toFixed(2).replace(`.`,`,`)} €`:``});o.appendChild(r(t))}),t}},ot=`<section class="mx-auto max-w-2xl px-6 pt-10 pb-16">
  <slot name="connexion"></slot>
  <slot name="message"></slot>
  <slot name="statistiques"></slot>
</section>
`,I={login:``,stats:null,message:null},L={};L.chargerStats=async function(){try{I.stats=await et.fetch(),a(!0)}catch(e){I.stats=null,a(!1);let t=e.message;e.statut===401&&(t=`Vous n'êtes pas connecté.`),e.statut===403&&(t=`Accès réservé aux administrateurs.`),I.message={type:`erreur`,texte:t}}},L.handler_connexion=async function(e,t){I.login=e;try{await F.login(e,t),I.message={type:`succes`,texte:`Connecté en tant que ${e}.`},await L.chargerStats()}catch(e){I.message={type:`erreur`,texte:e.message}}R.rafraichir()},L.handler_deconnexion=async function(){try{await F.logout(),I.message=null,await L.chargerStats()}catch(e){I.message={type:`erreur`,texte:e.message}}R.rafraichir(),document.dispatchEvent(new Event(`admin:deconnexion-terminee`))},document.addEventListener(`admin:quitter`,()=>{F.logout().catch(()=>{}),a(!1)}),L.init=async function(){return I.message=null,await L.chargerStats(),R.init()};var R={};R.racine=null,R.init=function(){let e=R.createPageFragment();return R.racine=e.firstElementChild,e},R.rafraichir=function(){let e=R.createPageFragment(),t=e.firstElementChild;R.racine.replaceWith(e),R.racine=t},R.createPageFragment=function(){let e=r(ot),t=e.querySelector(`slot[name="connexion"]`);I.stats===null?t.replaceWith(nt.dom({login:I.login},{surConnexion:L.handler_connexion,surDeconnexion:L.handler_deconnexion})):t.remove(),e.querySelector(`slot[name="message"]`).replaceWith(T.dom(I.message));let n=e.querySelector(`slot[name="statistiques"]`);return I.stats===null?n.remove():n.replaceWith(at.dom(I.stats)),e};function st(){return L.init()}var ct=`<section aria-labelledby="titre-formulaire-categorie" class="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
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
`,lt={html:function(e={}){return n(ct,{titre:e.id?`Modifier la catégorie`:`Nouvelle catégorie`})},dom:function(e={},t={}){let n=r(lt.html(e)),i=n.querySelector(`form`);return i.elements.libelle.value=e.nom??``,i.elements.description.value=e.description??``,i.addEventListener(`submit`,e=>{e.preventDefault(),t.surEnregistrer?.({libelle:i.elements.libelle.value,description:i.elements.description.value})}),n.querySelector(`[data-action="annuler"]`).addEventListener(`click`,()=>{t.surAnnuler?.()}),n}},ut=`<div data-zone="overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
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
</div>`,dt={html:function(e={}){return n(ut,{nom:e.nom??``})},dom:function(e={},t={}){let n=r(dt.html(e)),i=n.querySelector(`[data-zone="info"]`),a=n.querySelector(`[data-zone="reaffectation"]`),o=a.querySelector(`select`),s=n.querySelector(`[data-zone="erreur"]`),c=n.querySelector(`[data-action="confirmer"]`),l=Number(e.nbProduits||0),u=e.categories||[];return l===0?(i.textContent=`Cette catégorie ne contient aucun produit.`,a.hidden=!0):(i.textContent=`Elle contient ${l} produit${l>1?`s`:``}.`,u.length===0?(s.textContent=`Impossible de supprimer : créez d'abord une autre catégorie pour y réaffecter ses produits.`,s.classList.remove(`hidden`),c.disabled=!0,a.hidden=!0):u.forEach(e=>{let t=document.createElement(`option`);t.value=e.id,t.textContent=e.nom,o.appendChild(t)})),c.addEventListener(`click`,()=>{let n=l>0?o.value:null;t.surConfirmer?.(e.id,n)}),n.querySelectorAll(`[data-action="fermer"]`).forEach(e=>e.addEventListener(`click`,()=>t.surFermer?.())),n}},ft=`<section class="mb-6 overflow-x-auto rounded-lg border bg-surface-default shadow-xs border-border-default c-tableaux-recapitulatifs-admin-categories">
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
</section>`,pt=`<tr class="text-zinc-900 dark:text-zinc-100">
  <td class="px-4 py-3 font-medium">{{nom}}</td>
  <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">{{description}}</td>
  <td class="px-4 py-3">{{nbProduits}}</td>
  <td class="whitespace-nowrap px-4 py-3 text-right">
    <button type="button" data-action="modifier" data-id="{{id}}" class="mr-3 text-blue-600 underline hover:text-blue-700 dark:text-blue-400">Modifier</button>
    <button type="button" data-action="supprimer" data-id="{{id}}" class="text-red-700 underline hover:text-red-900 dark:text-red-400">Supprimer</button>
  </td>
</tr>`,mt={html:function(){return ft},dom:function(e=[],t={}){let i=r(ft),a=i.querySelector(`[data-zone="lignes"]`);return a.innerHTML=e.length?e.map(e=>n(pt,e)).join(``):`<tr><td colspan="4" class="px-4 py-6 text-center text-zinc-500">Aucune catégorie pour le moment.</td></tr>`,a.addEventListener(`click`,e=>{let n=e.target.closest(`[data-action]`);if(!n)return;let r=n.dataset.id;n.dataset.action===`modifier`&&t.surModifier?.(r),n.dataset.action===`supprimer`&&t.surSupprimer?.(r)}),i}},ht=`<section class="mx-auto max-w-4xl px-6 pt-10 pb-16">\r
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
`,gt=100,_t=500,z={acces:null,categories:[],tri:`nom`,parPage:12,page:1,pagesTotal:1,total:0,toutesCategories:[],message:null,edition:null,suppression:null},B={};B.chargerCategories=async function(e=z.page,t=z.tri,n=z.parPage){try{let r=await S.fetchAdminPage(e,t,n);z.categories=r.categories,z.tri=r.tri,z.parPage=r.parPage,z.page=r.page,z.pagesTotal=r.pagesTotal,z.total=r.total,z.acces=`ok`,a(!0)}catch(e){z.categories=[],e instanceof c&&e.statut===401?(z.acces=`non-connecte`,a(!1)):e instanceof c&&e.statut===403?(z.acces=`refuse`,a(!1)):z.message={type:`erreur`,texte:e.message}}},B.handler_changerTri=async function(e){await B.chargerCategories(1,e,z.parPage),V.rafraichir()},B.handler_changerParPage=async function(e){await B.chargerCategories(1,z.tri,e),V.rafraichir()},B.handler_changerPage=async function(e){await B.chargerCategories(e,z.tri,z.parPage),V.rafraichir(),window.scrollTo({top:0,behavior:`smooth`})},B.trouverCategorie=function(e){return z.categories.find(t=>String(t.id)===String(e))??null},B.validerFormulaire=function({libelle:e,description:t}){return e.trim()===``?`Le nom de la catégorie est obligatoire.`:e.trim().length>gt?`Le nom ne doit pas dépasser ${gt} caractères.`:t.trim().length>_t?`La description ne doit pas dépasser ${_t} caractères.`:null},B.handler_ouvrirCreation=function(){z.edition={id:null,nom:``,description:``},z.suppression=null,z.message=null,V.rafraichir()},B.handler_ouvrirModification=function(e){let t=B.trouverCategorie(e);t&&(z.edition={id:t.id,nom:t.nom,description:t.description},z.suppression=null,z.message=null,V.rafraichir())},B.handler_annulerFormulaire=function(){z.edition=null,V.rafraichir()},B.handler_enregistrer=async function(e){z.edition={...z.edition,nom:e.libelle,description:e.description};let t=B.validerFormulaire(e);if(t){z.message={type:`erreur`,texte:t},V.rafraichir();return}let n={libelle:e.libelle.trim(),description:e.description.trim()};try{z.edition.id===null?(await S.creer(n),z.message={type:`succes`,texte:`Catégorie « ${n.libelle} » créée.`}):(await S.modifier(z.edition.id,n),z.message={type:`succes`,texte:`Catégorie « ${n.libelle} » modifiée.`}),z.edition=null,await B.chargerCategories()}catch(e){z.message={type:`erreur`,texte:e.message}}V.rafraichir()},B.handler_demanderSuppression=async function(e){let t=B.trouverCategorie(e);if(t){try{z.toutesCategories=await S.fetchAdminListe(z.tri)}catch(e){z.message={type:`erreur`,texte:e.message},V.rafraichir();return}z.suppression=t,z.edition=null,z.message=null,V.rafraichir()}},B.handler_annulerSuppression=function(){z.suppression=null,V.rafraichir()},B.handler_confirmerSuppression=async function(e,t){let n=B.trouverCategorie(e)?.nom??``;try{await S.supprimer(e,t),z.suppression=null,z.message={type:`succes`,texte:`Catégorie « ${n} » supprimée.`},await B.chargerCategories()}catch(e){z.message={type:`erreur`,texte:e.message}}V.rafraichir()},B.handler_deconnexion=async function(){if(V.racine?.isConnected){try{await F.logout(),z.message={type:`info`,texte:`Vous êtes déconnecté.`}}catch(e){z.message={type:`erreur`,texte:e.message}}z.acces=`non-connecte`,z.categories=[],a(!1),z.edition=null,z.suppression=null,V.rafraichir(),document.dispatchEvent(new Event(`admin:deconnexion-terminee`))}},document.addEventListener(`admin:deconnexion`,B.handler_deconnexion),B.init=async function(){return z.message=null,z.edition=null,z.suppression=null,await B.chargerCategories(),V.init()};var V={};V.racine=null,V.init=function(){let e=V.createPageFragment();return V.racine=e.firstElementChild,e},V.rafraichir=function(){let e=V.createPageFragment(),t=e.firstElementChild;V.racine.replaceWith(e),V.racine=t},V.createPageFragment=function(){let e=r(ht),t=z.acces===`ok`,n=z.edition!==null,i=e.querySelector(`[data-action="creer"]`);return i.hidden=!t||n,i.addEventListener(`click`,B.handler_ouvrirCreation),e.querySelector(`[data-zone="entete"]`).hidden=n,e.querySelector(`[data-zone="acces"]`).hidden=t,e.querySelector(`slot[name="message"]`).replaceWith(T.dom(z.message)),e.querySelector(`slot[name="formulaire"]`).replaceWith(z.edition?lt.dom(z.edition,{surEnregistrer:B.handler_enregistrer,surAnnuler:B.handler_annulerFormulaire}):``),e.querySelector(`slot[name="suppression"]`).replaceWith(z.suppression?dt.dom({id:z.suppression.id,nom:z.suppression.nom,nbProduits:z.suppression.nbProduits,categories:z.toutesCategories.filter(e=>e.id!==z.suppression.id).map(e=>({id:e.id,nom:e.nom}))},{surConfirmer:B.handler_confirmerSuppression,surFermer:B.handler_annulerSuppression}):``),e.querySelector(`slot[name="barre-outils"]`).replaceWith(t&&!n?xe.dom({tri:z.tri,parPage:z.parPage,total:z.total,libelleTotal:`catégories`,libelleParPage:`Catégories par page`,libelleUnite:`catégories`,optionsTri:[{valeur:`nom`,libelle:`Nom (A → Z)`},{valeur:`produits_asc`,libelle:`Nombre de produits (croissant)`},{valeur:`produits_desc`,libelle:`Nombre de produits (décroissant)`}]},{surTri:B.handler_changerTri,surParPage:B.handler_changerParPage}):``),e.querySelector(`slot[name="tableau"]`).replaceWith(t&&!n?mt.dom(z.categories,{surModifier:B.handler_ouvrirModification,surSupprimer:B.handler_demanderSuppression}):``),e.querySelector(`slot[name="pagination"]`).replaceWith(t&&!n?E.dom(z,{surPage:B.handler_changerPage}):``),e};function vt(){return B.init()}var yt=`<section class="mb-6 rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-formulaires-forms-produit">\r
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
        <div data-zone="options" class="mt-2 flex flex-col gap-4 border-t border-dashed border-border-default pt-4 c-formulaires-forms-produit__options">\r
            <h3 class="text-14 font-semibold text-text-primary">Options (si applicable)</h3>\r
\r
            <label class="flex items-center gap-2 text-14 text-text-primary">\r
                <input type="checkbox" data-zone="options-activer" checked class="size-4" />\r
                Activer les options pour ce produit\r
            </label>\r
\r
            <div data-zone="options-contenu" class="flex flex-col gap-4">\r
                <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                    Options\r
                    <input name="nouvelleOptionNom" type="text" maxlength="80" placeholder="Ex. Taille" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
                </label>\r
\r
                <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">\r
                    Valeurs disponibles\r
                    <input name="nouvelleOptionValeurs" type="text" maxlength="500" placeholder="Ex. S, M, L" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary" />\r
                </label>\r
\r
                <div>\r
                    <button type="button" data-action="ajouter-option" class="h-10 rounded-md border px-4 text-14 font-medium text-text-primary hover:bg-surface-subtle border-border-default">Ajouter une option</button>\r
                </div>\r
\r
                <div data-zone="options-liste" class="flex flex-col gap-3 border-t border-border-default pt-4"></div>\r
            </div>\r
        </div>\r
\r
        <div class="mt-2 flex justify-end gap-3">\r
            <button type="button" data-action="annuler" class="h-10 rounded-md border px-4 text-14 font-medium text-text-secondary hover:bg-surface-subtle border-border-default">Annuler</button>\r
            <button type="submit" class="h-10 rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text hover:opacity-90">Enregistrer</button>\r
        </div>\r
    </form>\r
</section>`,bt=5242880,xt=[`image/avif`,`image/jpeg`,`image/png`,`image/webp`],H={html:function(e={}){return n(yt,{titre:e.id?`Modifier le produit`:`Nouveau produit`})},valider:function(e){if(!e.nom.trim())return`Le nom du produit est obligatoire.`;if(e.nom.trim().length>160)return`Le nom ne doit pas dépasser 160 caractères.`;if(!e.categorieId)return`Choisissez une catégorie.`;if(e.prix===``||Number(e.prix)<0||Number(e.prix)>9999.99)return`Le prix doit être un nombre positif, par exemple 12,95.`;if(e.prixUnitaire!==``&&(Number(e.prixUnitaire)<0||Number(e.prixUnitaire)>9999.99))return`Le prix unitaire doit être un nombre positif.`;if(!Number.isInteger(Number(e.stock))||Number(e.stock)<0)return`Le stock doit être un nombre entier positif ou nul.`;if(!Number.isInteger(Number(e.seuilAlerte))||Number(e.seuilAlerte)<0)return`Le seuil d'alerte doit être un nombre entier positif ou nul.`;if(Array.isArray(e.images)){for(let t of e.images)if(t instanceof File&&t.size!==0){if(!xt.includes(t.type))return`Le format de l'image doit être AVIF, JPG/JPEG, PNG ou WebP.`;if(t.size>bt)return`L'image « `+t.name+` » est trop lourde : 5 Mo maximum.`}}return null},dom:function(e={},t={}){let n=r(H.html(e)),i=n.querySelector(`form`),a=n.querySelector(`[data-zone="message"]`),o=n.querySelector(`[data-zone="categories"]`),s=n.querySelector(`[data-zone="fichier-image"]`),c=n.querySelector(`[data-zone="depot-image"]`),l=n.querySelector(`[data-zone="fichiers-selectionnes"]`),u=e.valeurs??{},d=Array.isArray(u.images)?[...u.images]:[],f=function(e){return Math.max(1,Math.ceil(e.size/1024))+` Ko`},p=function(e){d.splice(e,1),m()},m=function(){l.innerHTML=``,d.length===0?(l.classList.add(`hidden`),l.classList.remove(`flex`)):(d.forEach((e,t)=>{let n=H.valider({nom:`ok`,categorieId:`ok`,prix:`0`,prixUnitaire:``,stock:`0`,seuilAlerte:`0`,images:[e]}),r=document.createElement(`div`);r.className=`flex items-center justify-between gap-3 rounded-md border p-2 `+(n?`border-status-danger-indicator bg-status-danger-subtle`:`border-border-default bg-surface-default`);let i=document.createElement(`div`);i.className=`flex min-w-0 flex-col`;let a=document.createElement(`span`);a.className=`truncate text-14 font-medium text-text-primary`,a.textContent=e.name;let o=document.createElement(`span`);if(o.className=`text-12 text-text-secondary`,o.textContent=f(e),i.append(a,o),n){let e=document.createElement(`span`);e.className=`text-12 text-status-danger-text`,e.textContent=n,r.append(i,e)}else{let e=document.createElement(`button`);e.type=`button`,e.textContent=`Retirer`,e.className=`shrink-0 rounded-md px-3 py-2 text-14 text-text-secondary hover:bg-surface-subtle`,e.addEventListener(`click`,()=>p(t)),r.append(i,e)}l.appendChild(r)}),l.classList.remove(`hidden`),l.classList.add(`flex`))};s.addEventListener(`change`,()=>{for(let e of s.files)d.push(e);s.value=``,m()}),[`dragenter`,`dragover`].forEach(e=>{c.addEventListener(e,e=>{e.preventDefault(),c.classList.add(`border-border-strong`,`bg-surface-info`)})}),[`dragleave`,`drop`].forEach(e=>{c.addEventListener(e,e=>{e.preventDefault(),c.classList.remove(`border-border-strong`,`bg-surface-info`)})}),c.addEventListener(`drop`,e=>{for(let t of e.dataTransfer.files)d.push(t);m()});let h=i.elements;h.nom.value=u.nom??``,h.reference.value=u.reference??``,h.marque.value=u.marque??``,h.format.value=u.format??``,h.badge.value=u.badge??``,h.description.value=u.description??``,h.prix.value=u.prix??``,h.prixUnitaire.value=u.prixUnitaire??``,h.unitePrix.value=u.unitePrix??``,h.stock.value=u.stock??0,h.seuilAlerte.value=u.seuilAlerte??5,(t.categories||[]).forEach(e=>{let t=document.createElement(`option`);t.value=e.id,t.textContent=e.nom,t.selected=String(e.id)===String(u.categorieId??``),o.appendChild(t)});let ee=n.querySelector(`[data-zone="images"]`),g=n.querySelector(`[data-zone="images-vide"]`),_=e.images??[];_.length>0&&g.remove(),_.forEach(e=>{let n=document.createElement(`li`);n.className=`flex flex-col items-start gap-2`;let r=document.createElement(`img`);r.src=e.src,r.alt=e.alt,r.className=`h-24 w-24 rounded-md border object-cover border-border-default`;let a=document.createElement(`button`);a.type=`button`,a.textContent=`Supprimer l'image`,a.className=`text-12 text-red-700 underline hover:text-red-900 dark:text-red-400`,a.addEventListener(`click`,()=>{t.surSupprimerImage?.(e.id,H.lireSaisie(i,d))}),n.append(r,a),ee.appendChild(n)}),n.querySelector(`[data-zone="options"]`);let v=n.querySelector(`[data-zone="options-liste"]`),y=(e,t)=>{let n=e.querySelector(`[name="${t}"]`);return n?n.value:``},te=function(e){let n=document.createElement(`div`);n.className=`flex flex-wrap gap-2 items-end`,n.dataset.valeurId=e.id;let r=document.createElement(`input`);r.type=`text`,r.name=`valeurValeur`,r.value=e.valeur,r.placeholder=`Valeur (ex. Blanc)`,r.className=`rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`,r.maxLength=80;let i=document.createElement(`input`);i.type=`number`,i.name=`valeurPrix`,i.min=`0`,i.max=`9999.99`,i.step=`0.01`,i.value=String(e.prixSupplement??0),i.placeholder=`0,00`,i.className=`h-9 w-24 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`;let a=document.createElement(`input`);a.type=`number`,a.name=`valeurOrdre`,a.min=`0`,a.max=`255`,a.value=String(e.ordre??1),a.className=`h-9 w-20 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`;let o=document.createElement(`button`);o.type=`button`,o.textContent=`Enregistrer`,o.className=`h-9 rounded-md text-12 text-text-secondary underline hover:text-text-primary`,o.addEventListener(`click`,()=>{t.surModifierValeur?.(Number(n.dataset.valeurId),y(n,`valeurValeur`),y(n,`valeurPrix`),Number(y(n,`valeurOrdre`)||1))});let s=document.createElement(`button`);s.type=`button`,s.textContent=`Supprimer`,s.className=`h-9 rounded-md text-12 text-red-700 underline hover:text-red-900 dark:text-red-400`,s.addEventListener(`click`,()=>{t.surSupprimerValeur?.(Number(n.dataset.valeurId))});let c=()=>t.surModifierValeur?.(Number(n.dataset.valeurId),y(n,`valeurValeur`),y(n,`valeurPrix`),Number(y(n,`valeurOrdre`)||1));return r.addEventListener(`change`,c),i.addEventListener(`change`,c),a.addEventListener(`change`,c),n.append(r,i,a,o,s),n},ne=function(e){let n=document.createElement(`div`);n.className=`flex flex-col gap-3 rounded-md border p-3`,n.dataset.optionId=e.id;let r=document.createElement(`div`);r.className=`flex flex-wrap gap-3 items-end`;let i=document.createElement(`input`);i.type=`text`,i.name=`optionNom`,i.value=e.nom,i.placeholder=`Nom de l'option`,i.className=`rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`,i.maxLength=80;let a=document.createElement(`input`);a.type=`number`,a.name=`optionOrdre`,a.min=`0`,a.max=`255`,a.value=String(e.ordre??1),a.className=`h-9 w-20 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`;let o=document.createElement(`button`);o.type=`button`,o.textContent=`Enregistrer`,o.className=`h-9 rounded-md text-12 text-text-secondary underline hover:text-text-primary`,o.addEventListener(`click`,()=>{t.surModifierOption?.(Number(n.dataset.optionId),y(n,`optionNom`),Number(y(n,`optionOrdre`)||1))});let s=document.createElement(`button`);s.type=`button`,s.textContent=`Supprimer l'option`,s.className=`h-9 rounded-md text-12 text-red-700 underline hover:text-red-900 dark:text-red-400`,s.addEventListener(`click`,()=>{t.surSupprimerOption?.(Number(n.dataset.optionId))});let c=()=>t.surModifierOption?.(Number(n.dataset.optionId),y(n,`optionNom`),Number(y(n,`optionOrdre`)||1));i.addEventListener(`change`,c),a.addEventListener(`change`,c),r.append(i,a,o,s);let l=document.createElement(`div`);l.className=`ml-4 flex flex-col gap-2`,(e.valeurs||[]).forEach(e=>{l.appendChild(te(e))});let u=document.createElement(`div`);u.className=`flex flex-wrap gap-2 items-end mt-2`;let d=document.createElement(`input`);d.type=`text`,d.name=`nouvelleValeurValeur`,d.placeholder=`Nouvelle valeur`,d.className=`rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`,d.maxLength=80;let f=document.createElement(`input`);f.type=`number`,f.name=`nouvelleValeurPrix`,f.min=`0`,f.max=`9999.99`,f.step=`0.01`,f.placeholder=`Supplément €`,f.className=`h-9 w-28 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`;let p=document.createElement(`input`);p.type=`number`,p.name=`nouvelleValeurOrdre`,p.min=`0`,p.max=`255`,p.value=`1`,p.className=`h-9 w-20 rounded-md border bg-surface-default px-3 text-14 font-normal border-border-default text-text-primary`;let m=document.createElement(`button`);return m.type=`button`,m.textContent=`Ajouter la valeur`,m.className=`h-9 rounded-md text-12 text-text-secondary underline hover:text-text-primary`,m.addEventListener(`click`,()=>{t.surAjouterValeur?.(Number(n.dataset.optionId),d.value,f.value,Number(p.value||1))}),u.append(d,f,p,m),n.append(r,l,u),n};(function(){v.innerHTML=``,(e.options||[]).forEach(e=>{v.appendChild(ne(e))})})();let b=n.querySelector(`[data-zone="options-activer"]`),re=n.querySelector(`[data-zone="options-contenu"]`);return b.checked=e.optionsActives!==!1,re.hidden=!b.checked,b.addEventListener(`change`,()=>{re.hidden=!b.checked,t.surBasculerOptions?.(b.checked)}),n.querySelector(`[data-action="ajouter-option"]`).addEventListener(`click`,()=>{let e=n.querySelector(`[name="nouvelleOptionNom"]`),r=n.querySelector(`[name="nouvelleOptionValeurs"]`);t.surAjouterOption?.(e.value,r.value)}),i.addEventListener(`input`,()=>{t.surModification?.(H.lireSaisie(i,d))}),i.addEventListener(`submit`,e=>{e.preventDefault();let n=H.lireSaisie(i,d),r=H.valider(n);a.textContent=r||``,a.classList.toggle(`hidden`,!r),!r&&t.surEnregistrer&&t.surEnregistrer(n)}),n.querySelector(`[data-action="annuler"]`).addEventListener(`click`,()=>t.surAnnuler?.()),n},lireSaisie:function(e,t=[]){let n=Object.fromEntries(new FormData(e));return{nom:String(n.nom??``),reference:String(n.reference??``),categorieId:String(n.categorieId??``),marque:String(n.marque??``),format:String(n.format??``),badge:String(n.badge??``),description:String(n.description??``),prix:String(n.prix??``),prixUnitaire:String(n.prixUnitaire??``),unitePrix:String(n.unitePrix??``),stock:String(n.stock??``),seuilAlerte:String(n.seuilAlerte??``),images:t}}},St=`<div data-zone="overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <section role="dialog" aria-modal="true" aria-labelledby="titre-suppr-produit" class="max-h-screen w-full max-w-lg overflow-y-auto rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-formulaires-admin-suppressionproduit">
        <h2 id="titre-suppr-produit" class="mb-2 text-20 font-semibold text-text-primary">Supprimer le produit « {{nom}} » ?</h2>
        <p class="mb-5 text-14 text-text-secondary">Le produit ne sera plus proposé à la vente. Cette action est irréversible.</p>
        <div class="flex justify-end gap-3">
            <button type="button" data-action="fermer" class="h-10 rounded-md border px-4 text-14 font-medium text-text-secondary hover:bg-surface-subtle border-border-default">Annuler</button>
            <button type="button" data-action="confirmer" class="h-10 rounded-md bg-status-warning-background px-4 text-14 font-medium text-action-primary-text hover:opacity-90">Supprimer</button>
        </div>
    </section>
</div>`,Ct={html:function(e={}){return n(St,{nom:e.nom??``})},dom:function(e={},t={}){let n=r(Ct.html(e));return n.querySelector(`[data-action="confirmer"]`).addEventListener(`click`,()=>t.surConfirmer?.(e.id)),n.querySelectorAll(`[data-action="fermer"]`).forEach(e=>e.addEventListener(`click`,()=>t.surFermer?.())),n}},wt=`<section class="mb-6 overflow-x-auto rounded-lg border bg-surface-default shadow-xs border-border-default c-tableaux-recapitulatifs-admin-produits">
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
</section>`,Tt=`<tr class="text-zinc-900 dark:text-zinc-100">
  <td class="px-4 py-3 font-medium">{{nom}}</td>
  <td class="px-4 py-3">{{categorie}}</td>
  <td class="px-4 py-3">{{prix}} €</td>
  <td class="px-4 py-3">{{stock}}</td>
  <td class="px-4 py-3" data-zone="etat"></td>
  <td class="whitespace-nowrap px-4 py-3 text-right">
    <button type="button" data-action="modifier" data-id="{{id}}" class="mr-3 text-blue-600 underline hover:text-blue-700 dark:text-blue-400">Modifier</button>
    <button type="button" data-action="supprimer" data-id="{{id}}" class="text-red-700 underline hover:text-red-900 dark:text-red-400">Supprimer</button>
  </td>
</tr>`,Et={html:function(){return wt},dom:function(e=[],t={}){let i=r(wt),a=i.querySelector(`[data-zone="lignes"]`);if(e.length===0)a.innerHTML=`<tr><td colspan="6" class="px-4 py-6 text-center text-zinc-500">Aucun produit pour le moment.</td></tr>`;else{a.innerHTML=e.map(e=>n(Tt,e)).join(``);let t=a.querySelectorAll(`tr`);e.forEach((e,n)=>{let r=t[n].querySelector(`[data-zone="etat"]`);r&&r.appendChild(De.dom({etat:e.etat,stock:e.stock,seuilAlerte:e.seuilAlerte}))})}return a.addEventListener(`click`,e=>{let n=e.target.closest(`[data-action]`);n&&(n.dataset.action===`modifier`&&t.surModifier?.(n.dataset.id),n.dataset.action===`supprimer`&&t.surSupprimer?.(n.dataset.id))}),i}},Dt=`<section class="mx-auto max-w-4xl px-6 pt-10 pb-16">\r
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
    <div data-zone="message-page">\r
        <slot name="message"></slot>\r
    </div>\r
    <slot name="formulaire"></slot>\r
    <slot name="suppression"></slot>\r
    <slot name="barre-outils"></slot>\r
    <slot name="tableau"></slot>\r
    <slot name="pagination"></slot>\r
</section>`,Ot=800,U=null,W={acces:null,produits:[],tri:`nom`,parPage:12,page:1,pagesTotal:1,total:0,categories:[],message:null,edition:null,suppression:null},G={};G.chargerDonnees=async function(){try{let[e,t]=await Promise.all([w.fetchAdminListe(1),S.fetchAdminListe()]);G.appliquerListe(e),W.categories=t,W.acces=`ok`,a(!0)}catch(e){W.produits=[],W.categories=[],e instanceof c&&e.statut===401?(W.acces=`non-connecte`,a(!1)):e instanceof c&&e.statut===403?(W.acces=`refuse`,a(!1)):W.message={type:`erreur`,texte:e.message}}},G.appliquerListe=function(e){W.produits=e.produits,W.tri=e.tri,W.parPage=e.parPage,W.page=e.page,W.pagesTotal=e.pagesTotal,W.total=e.total},G.chargerProduits=async function(e=W.page,t={tri:W.tri,parPage:W.parPage}){G.appliquerListe(await w.fetchAdminListe(e,t))},G.changerListe=async function(e,t){try{await G.chargerProduits(e,t),W.message=null}catch(e){W.message={type:`erreur`,texte:e.message}}K.rafraichir()},G.handler_changerTri=function(e){return G.changerListe(1,{tri:e,parPage:W.parPage})},G.handler_changerParPage=function(e){return G.changerListe(1,{tri:W.tri,parPage:e})},G.handler_changerPage=function(e){return G.changerListe(e,{tri:W.tri,parPage:W.parPage}).then(()=>{window.scrollTo({top:0,behavior:`smooth`})})},G.trouverProduit=function(e){return W.produits.find(t=>String(t.id)===String(e))??null},G.valeursVides=function(){return{nom:``,reference:``,categorieId:``,marque:``,format:``,badge:``,description:``,prix:``,prixUnitaire:``,unitePrix:``,stock:0,seuilAlerte:5,images:[],options:[]}},G.valeursDepuis=function(e){return{nom:e.nom,reference:e.reference,categorieId:String(e.categorieId),marque:e.marque,format:e.format,badge:e.badge,description:e.description,prix:String(e.prix),prixUnitaire:e.prixUnitaire===``?``:String(e.prixUnitaire),unitePrix:e.unitePrix,stock:e.stock,seuilAlerte:e.seuilAlerte}},G.versApi=function(e){return{nom:e.nom.trim(),reference:e.reference.trim(),categorie_id:Number(e.categorieId),marque:e.marque.trim(),format:e.format.trim(),description:e.description.trim(),prix:e.prix,prix_unitaire:e.prixUnitaire,unite_prix:e.unitePrix.trim(),badge:e.badge.trim(),stock:Number(e.stock),seuil_alerte:Number(e.seuilAlerte)}},G.lireDataUrl=function(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=()=>n(Error(`Lecture de l'image impossible.`)),r.readAsDataURL(e)})},G.handler_ouvrirCreation=function(){W.edition={id:null,valeurs:G.valeursVides(),images:[],options:[]},W.suppression=null,W.message=null,K.rafraichir()},G.handler_ouvrirModification=async function(e){let t=G.trouverProduit(e);if(!t)return;let n=[];try{n=await w.fetchAdminOptions(t.id)}catch(e){W.message={type:`erreur`,texte:`Impossible de charger les options : ${e.message}`}}W.edition={id:t.id,valeurs:G.valeursDepuis(t),images:t.images,options:n},W.suppression=null,W.message=null,K.rafraichir()},G.handler_annulerFormulaire=function(){clearTimeout(U),W.edition=null,K.rafraichir()},G.signaler=function(e){W.message=e;let t=K.racine?.querySelector(`[data-zone="message-page"]`);t&&t.replaceChildren(T.dom(e))},G.handler_modifierSaisie=function(e){W.edition&&(W.edition={...W.edition,valeurs:e},W.edition.id!==null&&(clearTimeout(U),U=setTimeout(G.enregistrerAuto,Ot)))},G.enregistrerAuto=async function(){let e=W.edition?.id,t=W.edition?.valeurs;if(e&&!H.valider(t))try{await w.modifier(e,G.versApi(t)),G.signaler({type:`info`,texte:`Modifications enregistrées automatiquement.`})}catch(e){G.signaler({type:`erreur`,texte:e.message})}},G.handler_enregistrer=async function(e){clearTimeout(U),W.edition={...W.edition,valeurs:e};let t=H.valider(e);if(t)return G.signaler({type:`erreur`,texte:t});let n=!1;try{let t=G.versApi(e),r=W.edition.id===null?await w.creer(t):await w.modifier(W.edition.id,t);if(W.edition={...W.edition,id:r.id},n=!0,Array.isArray(e.images))for(let t of e.images){if(!(t instanceof File)||t.size===0)continue;let e=await G.lireDataUrl(t);await w.ajouterImage(r.id,[{image:e,texte_alternatif:r.nom,nomFichier:t.name}])}W.edition=null,await G.chargerProduits(),W.message={type:`succes`,texte:`Produit « ${r.nom} » enregistré.`},K.rafraichir()}catch(e){if(!n)return G.signaler({type:`erreur`,texte:e.message});await G.chargerProduits().catch(()=>{});let t=G.trouverProduit(W.edition.id);W.edition={...W.edition,images:t?t.images:W.edition.images},W.message={type:`erreur`,texte:e.message},K.rafraichir()}},G.handler_supprimerImage=async function(e,t){if(W.edition?.id){try{await w.supprimerImage(W.edition.id,e),await G.chargerProduits();let n=G.trouverProduit(W.edition.id);W.edition={...W.edition,valeurs:t,images:n?n.images:[]},W.message={type:`succes`,texte:`Image supprimée.`}}catch(e){W.message={type:`erreur`,texte:e.message}}K.rafraichir()}},G.handler_basculerOptions=function(e){W.edition&&={...W.edition,optionsActives:e}},G.handler_ajouterOption=async function(e,t){if(!W.edition?.id)return;let n=e.trim(),r=t.split(`,`).map(e=>e.trim()).filter(e=>e!==``);if(n===``)return G.signaler({type:`erreur`,texte:`Donnez un nom à l'option, par exemple Taille.`});if(r.length===0)return G.signaler({type:`erreur`,texte:`Indiquez au moins une valeur, séparées par des virgules.`});try{let e=new Set(W.edition.options.map(e=>e.id)),t=await w.creerOption(W.edition.id,{nom:n,ordre:W.edition.options.length+1}),i=t.find(t=>!e.has(t.id));for(let[e,n]of r.entries())t=await w.ajouterValeur(i.id,{valeur:n,prix_supplement:0,ordre:e+1});W.edition={...W.edition,options:t}}catch(e){return G.signaler({type:`erreur`,texte:e.message})}W.message=null,K.rafraichir()},G.handler_ajouterValeur=async function(e,t,n,r){if(W.edition?.id){try{W.edition.options=await w.ajouterValeur(e,{valeur:t,prix_supplement:n,ordre:r}),W.message=null}catch(e){return G.signaler({type:`erreur`,texte:e.message})}K.rafraichir()}},G.handler_modifierOption=async function(e,t,n){if(W.edition?.id){try{W.edition.options=await w.modifierOption(e,{nom:t,ordre:n}),W.message=null}catch(e){return G.signaler({type:`erreur`,texte:e.message})}K.rafraichir()}},G.handler_supprimerOption=async function(e){if(W.edition?.id){try{W.edition.options=await w.supprimerOption(e),W.message=null}catch(e){return G.signaler({type:`erreur`,texte:e.message})}K.rafraichir()}},G.handler_modifierValeur=async function(e,t,n,r){if(W.edition?.id){try{W.edition.options=await w.modifierValeur(e,{valeur:t,prix_supplement:n,ordre:r}),W.message=null}catch(e){return G.signaler({type:`erreur`,texte:e.message})}K.rafraichir()}},G.handler_supprimerValeur=async function(e){if(W.edition?.id){try{W.edition.options=await w.supprimerValeur(e),W.message=null}catch(e){return G.signaler({type:`erreur`,texte:e.message})}K.rafraichir()}},G.handler_demanderSuppression=function(e){let t=G.trouverProduit(e);t&&(W.suppression=t,W.edition=null,W.message=null,K.rafraichir())},G.handler_annulerSuppression=function(){W.suppression=null,K.rafraichir()},G.handler_confirmerSuppression=async function(e){let t=G.trouverProduit(e)?.nom??``;try{await w.supprimer(e),W.suppression=null,W.message={type:`succes`,texte:`Produit « ${t} » supprimé.`},await G.chargerProduits()}catch(e){W.message={type:`erreur`,texte:e.message}}K.rafraichir()},G.handler_deconnexion=async function(){if(K.racine?.isConnected){try{await F.logout(),W.message={type:`info`,texte:`Vous êtes déconnecté.`}}catch(e){W.message={type:`erreur`,texte:e.message}}W.acces=`non-connecte`,a(!1),W.produits=[],W.categories=[],W.edition=null,W.suppression=null,K.rafraichir(),document.dispatchEvent(new Event(`admin:deconnexion-terminee`))}},document.addEventListener(`admin:deconnexion`,G.handler_deconnexion),G.init=async function(){return W.message=null,W.edition=null,W.suppression=null,await G.chargerDonnees(),K.init()};var K={};K.racine=null,K.init=function(){let e=K.createPageFragment();return K.racine=e.firstElementChild,e},K.rafraichir=function(){let e=K.createPageFragment(),t=e.firstElementChild;K.racine.replaceWith(e),K.racine=t},K.createPageFragment=function(){let e=r(Dt),t=W.acces===`ok`,n=W.edition!==null,i=e.querySelector(`[data-action="creer"]`);return i.hidden=!t||n,i.addEventListener(`click`,G.handler_ouvrirCreation),e.querySelector(`[data-zone="entete"]`).hidden=n,e.querySelector(`[data-zone="acces"]`).hidden=t,e.querySelector(`slot[name="message"]`).replaceWith(T.dom(W.message)),e.querySelector(`slot[name="formulaire"]`).replaceWith(W.edition?H.dom(W.edition,{categories:W.categories,surEnregistrer:G.handler_enregistrer,surModification:G.handler_modifierSaisie,surAnnuler:G.handler_annulerFormulaire,surSupprimerImage:G.handler_supprimerImage,surAjouterOption:G.handler_ajouterOption,surBasculerOptions:G.handler_basculerOptions,surAjouterValeur:G.handler_ajouterValeur,surModifierOption:G.handler_modifierOption,surSupprimerOption:G.handler_supprimerOption,surModifierValeur:G.handler_modifierValeur,surSupprimerValeur:G.handler_supprimerValeur}):``),e.querySelector(`slot[name="suppression"]`).replaceWith(W.suppression?Ct.dom({id:W.suppression.id,nom:W.suppression.nom},{surConfirmer:G.handler_confirmerSuppression,surFermer:G.handler_annulerSuppression}):``),e.querySelector(`slot[name="barre-outils"]`).replaceWith(t&&!n?xe.dom({...W,optionsTri:[{valeur:`nom`,libelle:`Nom (A → Z)`},{valeur:`prix`,libelle:`Prix (croissant)`},{valeur:`categorie`,libelle:`Catégorie (A → Z)`},{valeur:`stock`,libelle:`Stock (croissant)`},{valeur:`etat`,libelle:`État (épuisé en premier)`}]},{surTri:G.handler_changerTri,surParPage:G.handler_changerParPage}):``),e.querySelector(`slot[name="tableau"]`).replaceWith(t&&!n?Et.dom(W.produits,{surModifier:G.handler_ouvrirModification,surSupprimer:G.handler_demanderSuppression}):``),e.querySelector(`slot[name="pagination"]`).replaceWith(t&&!n?E.dom(W,{surPage:G.handler_changerPage}):``),e};function kt(){return G.init()}var At=`<li class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center c-ligne-panier">
  <img src="{{src}}" alt="{{alt}}" class="h-20 w-20 shrink-0 rounded-md bg-surface-subtle object-contain" />
  <div class="flex flex-1 flex-col gap-1">
    <a href="{{lien}}" data-link class="font-medium text-text-primary hover:underline">{{nom}}</a>
    <p data-zone="options" class="text-12 text-text-secondary"></p>
    <p class="text-14 text-text-secondary">{{prix}} € l'unité</p>
  </div>
  <slot name="quantite"></slot>
  <p data-zone="total" class="w-28 text-right font-semibold text-text-primary"></p>
  <button type="button" data-action="supprimer" class="text-14 text-status-warning-text underline hover:text-status-warning-text">Supprimer</button>
</li>`,jt={html:function(e={}){let t=typeof e.prix==`number`?e.prix.toFixed(2).replace(`.`,`,`):String(e.prix||`0,00`);return n(At,{src:e.src||``,alt:e.alt||e.nom||``,lien:e.lien||`#`,nom:e.nom||``,prix:t})},total:function(e){let t=Number(e.prixOptions||0);return(Number(e.prix)+t)*Number(e.quantite||1)},dom:function(e={},t={}){let n=r(jt.html(e)),i=Object.entries(e.options||{}).map(([e,t])=>`${e} : ${t}`).join(` · `),a=n.querySelector(`[data-zone="options"]`);a&&(a.textContent=i);let o=n.querySelector(`[data-zone="quantite"]`);o&&o.replaceWith(j.dom({valeur:e.quantite,min:1,max:e.stock},{surChange:n=>t.surQuantite?.(e.id,n)}));let s=n.querySelector(`[data-zone="total"]`);return s.textContent=jt.total(e).toFixed(2).replace(`.`,`,`)+` €`,n.querySelector(`[data-action="supprimer"]`).addEventListener(`click`,()=>t.surSupprimer?.(e.id)),n}},Mt=`<section class="mx-auto max-w-3xl c-tableaux-recapitulatifs-client-panier">
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
</section>`,Nt={html:function(){return Mt},total:function(e=[]){return e.reduce((e,t)=>e+jt.total(t),0)},dom:function(e=[],t={}){let n=r(Mt),i=n.querySelector(`[data-zone="lignes"]`),a=n.querySelector(`[data-zone="vide"]`),o=n.querySelector(`[data-action="valider"]`),s=n=>{n.innerHTML=``,e.forEach(e=>{n.appendChild(jt.dom(e,{surQuantite:(n,r)=>{e.quantite=r,l(),t.surQuantite?.(n,r)},surSupprimer:e=>{t.surSupprimer?.(e)}}))})},c=n.querySelector(`[data-zone="total"]`),l=()=>{c&&(c.textContent=Nt.total(e).toFixed(2).replace(`.`,`,`)+` €`),o.disabled=e.length===0,a.classList.toggle(`hidden`,e.length>0)};return s(i),l(),o.addEventListener(`click`,()=>t.surValider?.(e)),n.querySelector(`[data-action="continuer"]`).addEventListener(`click`,()=>t.surContinuer?.()),n}},Pt=`<div data-zone="overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
  <section role="dialog" aria-modal="true" class="max-h-screen w-full max-w-lg overflow-y-auto rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-formulaires-client-connexionclient">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-24 font-semibold tracking-tight text-text-primary">Connexion client</h2>
      <button type="button" data-action="fermer" aria-label="Fermer" class="flex h-8 w-8 items-center justify-center rounded-md border text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary border-border-default">
        ✕
      </button>
    </div>
    <p class="mb-5 text-14 text-text-secondary">Connectez-vous à votre compte Action pour finaliser votre commande en Click & Collect.</p>

    <form class="flex flex-col gap-4">
      <slot name="message"></slot>

      <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
        Adresse email
        <input name="login" type="email" autocomplete="username" required value="{{login}}" placeholder="votre.email@exemple.fr" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
      </label>

      <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
        Mot de passe
        <input name="mdp" type="password" autocomplete="current-password" required placeholder="••••••••" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
      </label>

      <button type="submit" class="mt-2 h-10 w-full rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text transition-opacity hover:opacity-90">
        Me connecter
      </button>

      <div class="mt-3 flex flex-col items-center gap-2 border-t pt-4 text-14 text-text-secondary border-border-default">
        <p>
          Pas encore de compte ?
          <button type="button" data-action="basculer-inscription" class="font-medium text-text-link underline hover:text-text-link">
            Créer un compte
          </button>
        </p>

        <button type="button" data-action="fermer" class="text-12 text-text-secondary underline hover:text-text-primary hover:text-text-secondary">
          ← Retour au panier
        </button>
      </div>
    </form>
  </section>
</div>
`,Ft={html:function(e={}){return n(Pt,{login:e?.login||``})},dom:function(e={},t={}){let n=r(Ft.html(e)),i=n.querySelector(`form`);i&&i.addEventListener(`submit`,e=>{e.preventDefault(),t.surConnexion&&t.surConnexion(i.elements.login.value.trim(),i.elements.mdp.value)}),n.querySelectorAll(`[data-action="fermer"]`).forEach(e=>{e&&t.surFermer&&e.addEventListener(`click`,()=>t.surFermer())});let a=n.querySelector(`[data-action="basculer-inscription"]`);a&&t.surBasculerInscription&&a.addEventListener(`click`,()=>t.surBasculerInscription());let o=n.querySelector(`[data-zone="overlay"]`);return o&&t.surFermer&&o.addEventListener(`click`,e=>{e.target===o&&t.surFermer()}),n}},It=`<div data-zone="overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
  <section role="dialog" aria-modal="true" class="max-h-screen w-full max-w-lg overflow-y-auto rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-formulaires-client-inscriptionclient">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-24 font-semibold tracking-tight text-text-primary">Créer un compte client</h2>
      <button type="button" data-action="fermer" aria-label="Fermer" class="flex h-8 w-8 items-center justify-center rounded-md border text-text-secondary transition-colors hover:bg-surface-subtle hover:text-text-primary border-border-default">
        ✕
      </button>
    </div>
    <p class="mb-5 text-14 text-text-secondary">Créez votre compte pour réserver vos articles et les retirer en magasin Action.</p>

    <form class="flex flex-col gap-4">
      <slot name="message"></slot>

      <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
        Adresse email
        <input name="login" type="email" autocomplete="username" required value="{{login}}" placeholder="votre.email@exemple.fr" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
      </label>

      <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
        Mot de passe
        <input name="mdp" type="password" autocomplete="new-password" required placeholder="8 caractères minimum" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
      </label>

      <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
        Confirmer le mot de passe
        <input name="mdp_confirmation" type="password" autocomplete="new-password" required placeholder="Confirmez votre mot de passe" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
      </label>

      <p class="text-12 text-text-secondary">
        Tous les champs sont obligatoires. Le mot de passe doit comporter au moins 8 caractères.
      </p>

      <button type="submit" class="mt-2 h-10 w-full rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text transition-opacity hover:opacity-90">
        Créer mon compte
      </button>

      <div class="mt-3 flex flex-col items-center gap-2 border-t pt-4 text-14 text-text-secondary border-border-default">
        <p>
          Déjà un compte ?
          <button type="button" data-action="basculer-connexion" class="font-medium text-text-link underline hover:text-text-link">
            Me connecter
          </button>
        </p>

        <button type="button" data-action="fermer" class="text-12 text-text-secondary underline hover:text-text-primary hover:text-text-secondary">
          ← Retour au panier
        </button>
      </div>
    </form>
  </section>
</div>
`,Lt={html:function(e={}){return n(It,{login:e?.login||``})},dom:function(e={},t={}){let n=r(Lt.html(e)),i=n.querySelector(`form`);i&&i.addEventListener(`submit`,e=>{e.preventDefault(),t.surInscription&&t.surInscription(i.elements.login.value.trim(),i.elements.mdp.value,i.elements.mdp_confirmation?i.elements.mdp_confirmation.value:``)}),n.querySelectorAll(`[data-action="fermer"]`).forEach(e=>{e&&t.surFermer&&e.addEventListener(`click`,()=>t.surFermer())});let a=n.querySelector(`[data-action="basculer-connexion"]`);a&&t.surBasculerConnexion&&a.addEventListener(`click`,()=>t.surBasculerConnexion());let o=n.querySelector(`[data-zone="overlay"]`);return o&&t.surFermer&&o.addEventListener(`click`,e=>{e.target===o&&t.surFermer()}),n}},Rt=`<section class="mx-auto max-w-3xl px-6 pt-10 pb-16 gap-2">
  <slot name="panier"></slot>
  <slot name="message"></slot>
</section>
`,q={panier:[],message:null,afficherConnexion:!1,afficherInscription:!1,login:``},J={};J.charger=async function(){if(q.panier=_(),q.panier.length===0){q.message=null;return}let e=!1,t=[];try{let n=await g(q.panier.map(e=>({id:e.id,quantite:e.quantite})));for(let r of n.lignes){let n=q.panier.find(e=>String(e.id)===String(r.id));n&&(n.stock=r.stock??n.stock,r.estValide||(e=!0,r.quantiteMax<=0?(q.panier=q.panier.filter(e=>String(e.id)!==String(r.id)),t.push(`${n.nom??`Cet article`} a été retiré du panier : produit épuisé.`)):(n.quantite=r.quantiteMax,t.push(`${n.nom??`Cet article`} : quantité ajustée au stock disponible (${r.quantiteMax} maximum).`))))}}catch{}e&&(v(q.panier),x()),q.message=t.length>0?{type:`erreur`,texte:t.join(` `)}:null},J.handler_surQuantite=async function(e,t){ne(e,t),await J.charger(),x(),Y.rafraichir()},J.handler_surSupprimer=async function(e){let t=q.panier.find(t=>String(t.id)===String(e))?.nom;b(e),await J.charger(),x(),q.message={type:`succes`,texte:`Le produit "${t}" a bien été supprimé du panier.`},Y.rafraichir()},J.handler_surValider=function(){q.panier.length!==0&&(q.afficherConnexion=!0,Y.rafraichir())},J.handler_connexion=async function(e,t){q.login=e;try{await F.login(e,t),q.afficherConnexion=!1,await J.validerCommande()}catch(e){q.message={type:`erreur`,texte:e.message},Y.rafraichir()}},J.handler_fermerConnexion=function(){q.afficherConnexion=!1,Y.rafraichir()},J.handler_basculerInscription=function(){q.afficherConnexion=!1,q.afficherInscription=!0,Y.rafraichir()},J.handler_fermerInscription=function(){q.afficherInscription=!1,Y.rafraichir()},J.handler_basculerConnexion=function(){q.afficherInscription=!1,q.afficherConnexion=!0,Y.rafraichir()},J.handler_inscription=async function(e,t,n){q.login=e;try{await F.register(e,t,n),q.afficherInscription=!1,await F.login(e,t),await J.validerCommande()}catch(e){q.message={type:`erreur`,texte:e.message},Y.rafraichir()}},J.validerCommande=async function(){if(q.panier.length===0)return;let e;try{e=await g(q.panier.map(e=>({id:e.id,quantite:e.quantite})))}catch{q.message={type:`erreur`,texte:`Impossible de vérifier le stock actuellement. Réessayez dans un instant.`},Y.rafraichir();return}let t=(e.lignes??[]).filter(e=>!e.estValide);if(t.length>0){let e=!1,n=[];for(let r of t){let t=q.panier.find(e=>String(e.id)===String(r.id));t&&(e=!0,r.quantiteMax<=0?(q.panier=q.panier.filter(e=>String(e.id)!==String(r.id)),n.push(`${t.nom??`Cet article`} retiré du panier : produit épuisé.`)):(t.quantite=r.quantiteMax,n.push(`${t.nom??`Cet article`} : quantité ajustée à ${r.quantiteMax} (stock disponible).`)))}e&&(v(q.panier),x()),q.message={type:`erreur`,texte:`${n.join(` `)} Vérifiez votre panier avant de valider la commande.`},Y.rafraichir()}else re(),x(),q.panier=[],q.message={type:`succes`,texte:`Votre commande a été validée.`},Y.rafraichir()},J.handler_surContinuer=function(){window.location.href=`/~ribatet1/SAE-3.01/Base/`},J.init=async function(){return await J.charger(),Y.init()};var Y={};Y.racine=null,Y.init=function(){let e=Y.createPageFragment();return Y.racine=e.firstElementChild,e},Y.rafraichir=function(){let e=Y.createPageFragment(),t=e.firstElementChild;Y.racine.replaceWith(e),Y.racine=t},Y.createPageFragment=function(){let e=r(Rt);e.querySelector(`slot[name="panier"]`).replaceWith(Nt.dom(q.panier,{surQuantite:J.handler_surQuantite,surSupprimer:J.handler_surSupprimer,surValider:J.handler_surValider,surContinuer:J.handler_surContinuer})),e.querySelector(`slot[name="message"]`).replaceWith(T.dom(q.message));let t=e.firstElementChild;return q.afficherConnexion&&t.appendChild(Ft.dom({login:q.login},{surConnexion:J.handler_connexion,surFermer:J.handler_fermerConnexion,surBasculerInscription:J.handler_basculerInscription})),q.afficherInscription&&t.appendChild(Lt.dom({login:q.login},{surInscription:J.handler_inscription,surFermer:J.handler_fermerInscription,surBasculerConnexion:J.handler_basculerConnexion})),e};function zt(){return J.init()}var Bt=`<section class="mx-auto max-w-3xl px-6 pt-10 pb-16 gap-2">
  <slot name="message"></slot>

  <div class="mx-auto max-w-lg rounded-lg border bg-surface-default p-6 shadow-xs border-border-default">
    <h2 data-zone="titre" class="mb-2 text-24 font-semibold tracking-tight text-text-primary">Connexion client</h2>
    <p class="mb-6 text-14 text-text-secondary">Connectez-vous à votre compte pour finaliser votre commande.</p>

    <form name="connexion" class="flex flex-col gap-4" novalidate>
      <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
        Adresse email
        <input name="login" type="email" autocomplete="username" required placeholder="votre.email@exemple.fr" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
      </label>

      <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
        Mot de passe
        <input name="mdp" type="password" autocomplete="current-password" required placeholder="••••••••" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
      </label>

      <button type="submit" class="mt-2 h-10 w-full rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text transition-opacity hover:opacity-90">
        Me connecter
      </button>

      <div class="mt-3 flex flex-col items-center gap-2 border-t pt-4 text-14 text-text-secondary border-border-default">
        <p>
          Pas encore de compte ?
          <button type="button" data-action="basculer-inscription" class="font-medium text-text-link underline hover:text-text-link">
            Créer un compte
          </button>
        </p>
      </div>
    </form>

    <form name="inscription" class="flex flex-col gap-4" novalidate hidden>
      <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
        Adresse email
        <input name="login" type="email" autocomplete="username" required placeholder="votre.email@exemple.fr" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
      </label>

      <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
        Mot de passe
        <input name="mdp" type="password" autocomplete="new-password" required placeholder="8 caractères minimum" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
      </label>

      <label class="flex flex-col gap-1.5 text-14 font-medium text-text-primary">
        Confirmer le mot de passe
        <input name="mdp_confirmation" type="password" autocomplete="new-password" required placeholder="Confirmez votre mot de passe" class="h-10 rounded-md border bg-surface-default px-3 text-14 font-normal text-text-primary transition-colors hover:border-border-default focus:border-border-default focus:outline-hidden border-border-default" />
      </label>

      <p class="text-12 text-text-secondary">
        Tous les champs sont obligatoires. Le mot de passe doit comporter au moins 8 caractères.
      </p>

      <button type="submit" class="mt-2 h-10 w-full rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text transition-opacity hover:opacity-90">
        Créer mon compte
      </button>

      <div class="mt-3 flex flex-col items-center gap-2 border-t pt-4 text-14 text-text-secondary border-border-default">
        <p>
          Déjà un compte ?
          <button type="button" data-action="basculer-connexion" class="font-medium text-text-link underline hover:text-text-link">
            Me connecter
          </button>
        </p>
      </div>
    </form>
  </div>
</section>
`,X={mode:`connexion`,login:``,message:null},Z={};Z.handler_connexion=async function(e,t){X.login=e;try{await F.login(e,t),X.message={type:`succes`,texte:`Vous êtes connecté.`},X.mode=`connexion`}catch(e){X.message={type:`erreur`,texte:e.message}}Q.rafraichir()},Z.handler_inscription=async function(e,t,n){X.login=e;try{await F.register(e,t,n),await F.login(e,t),X.message={type:`succes`,texte:`Compte créé, vous êtes connecté.`},X.mode=`connexion`}catch(e){X.message={type:`erreur`,texte:e.message}}Q.rafraichir()},Z.handler_basculerInscription=function(){X.mode=`inscription`,X.message=null,Q.rafraichir()},Z.handler_basculerConnexion=function(){X.mode=`connexion`,X.message=null,Q.rafraichir()},Z.init=async function(){return X.message=null,Q.init()};var Q={};Q.racine=null,Q.init=function(){let e=Q.createPageFragment();return Q.racine=e.firstElementChild,e},Q.rafraichir=function(){let e=Q.createPageFragment(),t=e.firstElementChild;Q.racine.replaceWith(e),Q.racine=t},Q.createPageFragment=function(){let e=r(Bt);e.querySelector(`slot[name="message"]`).replaceWith(T.dom(X.message));let t=X.mode===`connexion`,n=e.querySelector(`form[name="connexion"]`),i=e.querySelector(`form[name="inscription"]`);return n.hidden=!t,i.hidden=t,e.querySelector(`[data-zone="titre"]`).textContent=t?`Connexion client`:`Créer un compte client`,n.addEventListener(`submit`,e=>{e.preventDefault(),Z.handler_connexion(n.elements.login.value.trim(),n.elements.mdp.value)}),i.addEventListener(`submit`,e=>{e.preventDefault(),Z.handler_inscription(i.elements.login.value.trim(),i.elements.mdp.value,i.elements.mdp_confirmation?i.elements.mdp_confirmation.value:``)}),e.querySelectorAll(`[data-action="basculer-inscription"]`).forEach(e=>{e.addEventListener(`click`,Z.handler_basculerInscription)}),e.querySelectorAll(`[data-action="basculer-connexion"]`).forEach(e=>{e.addEventListener(`click`,Z.handler_basculerConnexion)}),e};function Vt(){return Z.init()}var Ht=`<section class="mx-auto max-w-5xl px-6 pt-10 pb-16">
  <h1 class="mb-6 text-2xl font-semibold tracking-tight">Page introuvable</h1>
  <p class="mb-6 text-sm text-zinc-500 dark:text-zinc-400">Cette page n'existe pas.</p>
  <a href="/" data-link class="text-sm font-medium underline underline-offset-4">Retour au catalogue</a>
</section>
`;function Ut(){return Ht}document.body.insertAdjacentHTML(`afterbegin`,`<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\r
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
</svg>`);var $=new e(`app`,{base:`/~ribatet1/SAE-3.01/Base/`});$.addLayout(`/`,me),$.addRoute(`/`,Le),$.addRoute(`/categorie/:slug`,Le),$.addRoute(`/produit/:slug`,$e),$.addRoute(`/panier`,zt),$.addRoute(`/connexion`,Vt),$.addRoute(`/admin`,st),$.addRoute(`/admin/categories`,vt),$.addRoute(`/admin/produits`,kt),$.addRoute(`*`,Ut),document.addEventListener(`admin:deconnexion-terminee`,()=>$.navigate(`/admin`)),document.addEventListener(`admin:session-change`,e=>{let t=e.detail===!0;document.querySelectorAll(`[data-zone="navigation-authentifie"]`).forEach(e=>{e.hidden=!t}),document.querySelectorAll(`[data-action="deconnexion"]`).forEach(e=>{e.hidden=!t})}),$.start();