(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(e,t={}){this.root=document.getElementById(e),this.routes=[],this.layouts={},this.base=(t.base??`/`).replace(/\/$/,``),this.navigation=0,window.addEventListener(`popstate`,()=>this.handleRoute()),document.addEventListener(`click`,e=>{let t=e.target.closest(`a[data-link]`);t!==null&&(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),this.navigate(this.routePath(t.pathname))))})}addLayout(e,t){return this.layouts[e]=t,this}findLayout(e){let t=null,n=0;for(let[r,i]of Object.entries(this.layouts))e.startsWith(r)&&r.length>n&&(t=i,n=r.length);return t}addRoute(e,t,n={}){return this.routes.push({path:e,regex:this.pathToRegex(e),keys:this.extractParams(e),handler:t,useLayout:n.useLayout!==!1}),this}pathToRegex(e){if(e===`*`)return/.*/;let t=e.replace(/\//g,`\\/`).replace(/:(\w+)/g,`([^\\/]+)`).replace(/\*/g,`.*`);return RegExp(`^`+t+`$`)}extractParams(e){let t=[];for(let n of e.matchAll(/:(\w+)/g))t.push(n[1]);return t}getParams(e,t){let n=t.match(e.regex);if(!n)return{};let r={};return e.keys.forEach((e,t)=>{r[e]=decodeURIComponent(n[t+1])}),r}routePath(e){return e===this.base?`/`:e.startsWith(this.base+`/`)?e.slice(this.base.length):e}url(e){return this.base+e}navigate(e){window.history.pushState(null,``,this.url(e)),this.handleRoute()}async handleRoute(){let e=++this.navigation,t=this.routePath(window.location.pathname),n=this.routes.find(e=>e.regex.test(t));if(!n)return;let r=await n.handler(this.getParams(n,t));e===this.navigation&&this.renderContent(r,n,t)}renderContent(e,t,n){let r=e;if(!(r instanceof DocumentFragment)){let e=document.createElement(`template`);e.innerHTML=r,r=e.content}let i=t.useLayout?this.findLayout(n):null;if(i){let e=i(n);e.querySelector(`slot:not([name])`).replaceWith(r),r=e}this.root.replaceChildren(r),this.updateLinks(n),window.scrollTo(0,0)}updateLinks(e){for(let t of this.root.querySelectorAll(`a[data-link]`)){let n=this.routePath(t.pathname);t.setAttribute(`href`,this.url(n)),n===e?t.setAttribute(`aria-current`,`page`):t.removeAttribute(`aria-current`)}}start(){this.handleRoute()}};function t(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}var n=function(e,n){let r=e;for(let e in n)r=r.replaceAll(`{{${e}}}`,()=>t(n[e]));return r};function r(e){let t=document.createElement(`template`);return t.innerHTML=e.trim(),t.content}function i(){let e=document.documentElement.classList.toggle(`theme-dark`);try{localStorage.setItem(`theme`,e?`sombre`:`clair`)}catch{}}var a=`/~ribatet1/SAE-3.01/Base/api/`,o=class extends Error{constructor(e,t){super(e),this.name=`ErreurApi`,this.statut=t}},s=async function(e,t){let n=await fetch(a+e,t),r=null;try{r=await n.json()}catch{throw new o(`Réponse illisible du serveur.`,n.status)}if(!n.ok)throw new o(r?.erreur??`Erreur ${n.status}`,n.status);return r},c=function(e,t,n){return s(e,{method:t,headers:{Accept:`application/json`,"Content-Type":`application/json`},body:JSON.stringify(n)})},l=function(e){return s(e,{method:`GET`,headers:{Accept:`application/json`}})},u=function(e,t={}){return s(e,{method:`POST`,headers:{Accept:`application/json`,"Content-Type":`application/json`},body:JSON.stringify(t)})},d=function(e,t={}){return c(e,`PUT`,t)},ee=function(e,t={}){return c(e,`DELETE`,t)};function f(e){return{id:e.id,nom:e.libelle,description:e.description??``,nbProduits:e.nb_produits??0}}var p={fetchAll:async function(){let e=await l(`categories`);return Array.isArray(e)?e:e.categories??[]},fetchAdminListe:async function(){return(await l(`admin/categories`)).categories.map(f)},creer:async function(e){return f((await u(`admin/categories`,e)).categorie)},modifier:async function(e,t){return f((await d(`admin/categories/${encodeURIComponent(e)}`,t)).categorie)},supprimer:async function(e,t=null){let n=t===null?{}:{cible_id:Number(t)};return ee(`admin/categories/${encodeURIComponent(e)}`,n)}},te=`<header class="sticky top-0 z-10 border-b bg-surface-default shadow-xs border-border-default c-header-client">\r
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
</header>`,ne=`<a href="{{lien}}" data-link class="inline-flex items-center gap-1.5 whitespace-nowrap text-text-secondary transition-colors hover:text-text-primary aria-[current=page]:font-semibold aria-[current=page]:text-text-link c-header-client--alternate">
  <span>{{nom}}</span>
  <span class="rounded-full bg-surface-subtle px-1.5 py-0.5 text-12 font-normal text-text-secondary">{{nb-produits}}</span>
</a>`,m=`/~ribatet1/SAE-3.01/Base/assets/logo-Cjz4wVmC.webp`,h={html:function(e={}){let t=document.documentElement.classList.contains(`theme-dark`)?`#icon-sun`:`#icon-moon`;return n(te,{nbArticles:e.nbArticles??e.totalArticles??0,"icon-theme":t,"logo-src":m})},dom:function(e={},t={}){let n=r(h.html(e)),a=n.querySelector(`slot[name="categories"]`);a&&(Array.isArray(e.categories)&&e.categories.length>0?a.replaceWith(...e.categories.map(h.creerLienCategorie)):h.chargerCategories(a));let o=n.querySelector(`[data-action="theme"]`);return o&&o.addEventListener(`click`,()=>{i();let e=document.documentElement.classList.contains(`theme-dark`),n=o.querySelector(`use`);n&&n.setAttribute(`href`,e?`#icon-sun`:`#icon-moon`),t.surChangerTheme&&t.surChangerTheme()}),n},creerLienCategorie:function(e){let t=`/categorie/${encodeURIComponent(e.slug)}`,i=`/~ribatet1/SAE-3.01/Base/`.replace(/\/$/,``),a=e.lien||`${i}${t}`,o=r(n(ne,{nom:e.nom||e.libelle||``,lien:a,"nb-produits":e.nb_produits??e.nbProduits??0})),s=o.firstElementChild;return window.location.pathname===a&&s.setAttribute(`aria-current`,`page`),o},chargerCategories:async function(e){try{let t=await p.fetchAll();if(!e.isConnected)return;let n=t.map(h.creerLienCategorie);e.replaceWith(...n)}catch{e?.isConnected&&e.remove()}}},re=`<header class="sticky top-0 z-10 border-b border-border-default bg-surface-default/95 backdrop-blur-xs c-header-admin">\r
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
    <figcaption class="w-full border-t bg-surface-subtle px-6 py-2 border-border-default">\r
      <!-- Le routeur pose aria-current="page" sur le lien de la page affichée. -->\r
      <nav class="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto text-14">\r
        <a href="/admin" data-link class="font-medium text-text-primary hover:text-text-link aria-[current=page]:text-text-link">\r
          Tableau de bord\r
        </a>\r
        <slot name="navigation"></slot>\r
      </nav>\r
    </figcaption>\r
  </figure>\r
</header>`,ie=`<a href="{{lien}}" data-link class="inline-flex items-center gap-1.5 whitespace-nowrap text-text-secondary transition-colors hover:text-text-primary aria-[current=page]:font-semibold aria-[current=page]:text-text-link c-header-admin--alternate">\r
  {{nom}}\r
</a>`,ae=[{lien:`/admin/produits`,nom:`Produits`},{lien:`/admin/categories`,nom:`Catégories`},{lien:`/admin/commandes`,nom:`Commandes`}],g={html:function(){return n(re,{"icon-theme":document.documentElement.classList.contains(`theme-dark`)?`#icon-sun`:`#icon-moon`,"logo-src":m})},dom:function(e={}){let t=r(g.html()),a=t.querySelector(`slot[name="navigation"]`);if(a){let e=ae.map(e=>r(n(ie,e)));a.replaceWith(...e)}let o=t.querySelector(`[data-action="theme"]`);o&&o.addEventListener(`click`,()=>{i();let e=document.documentElement.classList.contains(`theme-dark`),t=o.querySelector(`use`);t&&t.setAttribute(`href`,e?`#icon-sun`:`#icon-moon`)});let s=t.querySelector(`[data-action="deconnexion"]`);return s&&e.surDeconnexion&&s.addEventListener(`click`,()=>e.surDeconnexion()),t}},oe=`<div class="min-h-screen">
  <slot name="header"></slot>
  <main>
    <!-- Le slot sans nom reçoit la page affichée (voir lib/router.js). -->
    <slot></slot>
  </main>
</div>
`;function se(e=`/`){let t=r(oe),n=e===`/admin`||e.startsWith(`/admin/`),i=n?g:h,a=n?{surDeconnexion:()=>document.dispatchEvent(new Event(`admin:deconnexion`))}:{};return t.querySelector(`slot[name="header"]`).replaceWith(i.dom(a)),t}var ce=Object.assign({"../images/bricolage/boite-outils-keter-fermer.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-fermer-BCeyoHet.avif`,"../images/bricolage/boite-outils-keter-ouvert.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-ouvert-DHPzhAIY.avif`,"../images/bricolage/boite-outils-keter-seul.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-seul-DBg7fsyY.avif`,"../images/bricolage/boite-outils-keter.avif":`/~ribatet1/SAE-3.01/Base/assets/boite-outils-keter-DQbvFGvG.avif`,"../images/bricolage/lampe-travail-sans-fil-werckmann-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-sans-fil-werckmann-boite-KL58At6W.avif`,"../images/bricolage/lampe-travail-sans-fil-werckmann-detail.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-sans-fil-werckmann-detail-j_KN6pop.avif`,"../images/bricolage/lampe-travail-sans-fil-werckmann.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-sans-fil-werckmann-DBIycGbc.avif`,"../images/bricolage/lampe-travail-trepier-werckmann-allumee.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-trepier-werckmann-allumee-CQBA4dBf.avif`,"../images/bricolage/lampe-travail-trepier-werckmann-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-trepier-werckmann-boite-B1U6B7m2.avif`,"../images/bricolage/lampe-travail-trepier-werckmann.avif":`/~ribatet1/SAE-3.01/Base/assets/lampe-travail-trepier-werckmann-CBQTY0FS.avif`,"../images/bricolage/multiprise-pro-max-triple-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/multiprise-pro-max-triple-boite-DfDB75hT.avif`,"../images/bricolage/multiprise-pro-max-triple-detail.avif":`/~ribatet1/SAE-3.01/Base/assets/multiprise-pro-max-triple-detail-CHIPEjeb.avif`,"../images/bricolage/multiprise-pro-max-triple.avif":`/~ribatet1/SAE-3.01/Base/assets/multiprise-pro-max-triple-BPa04KDQ.avif`,"../images/habitat/boule-lumineuse-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/boule-lumineuse-boite-BzG9_fWl.avif`,"../images/habitat/boule-lumineuse-cable.png":`/~ribatet1/SAE-3.01/Base/assets/boule-lumineuse-cable-BdbxzmYB.png`,"../images/habitat/boule-lumineuse.avif":`/~ribatet1/SAE-3.01/Base/assets/boule-lumineuse-BKdLDzjB.avif`,"../images/habitat/couette-sans-housse-beige-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-beige-zoom-DLIJrnxN.avif`,"../images/habitat/couette-sans-housse-beige.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-beige-DyE4rrQ7.avif`,"../images/habitat/couette-sans-housse-blanche-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-blanche-zoom-Dczs4QaA.avif`,"../images/habitat/couette-sans-housse-blanche.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-blanche-COoqT0Df.avif`,"../images/habitat/couette-sans-housse-noire-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-noire-zoom-BFKrSxbj.avif`,"../images/habitat/couette-sans-housse-noire.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-noire-B9E-IJVb.avif`,"../images/habitat/couette-sans-housse-sac.avif":`/~ribatet1/SAE-3.01/Base/assets/couette-sans-housse-sac-DJnKY3JV.avif`,"../images/habitat/oreiller-mousse-memoire-forme-dessus.avif":`/~ribatet1/SAE-3.01/Base/assets/oreiller-mousse-memoire-forme-dessus-CmAwF7Ow.avif`,"../images/habitat/oreiller-mousse-memoire-forme-sachet.avif":`/~ribatet1/SAE-3.01/Base/assets/oreiller-mousse-memoire-forme-sachet-DCLiQeTC.avif`,"../images/habitat/oreiller-mousse-memoire-forme.avif":`/~ribatet1/SAE-3.01/Base/assets/oreiller-mousse-memoire-forme-XNN87-XU.avif`,"../images/habitat/rideaux-velours-beige-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-beige-boite-2F0lCa7v.avif`,"../images/habitat/rideaux-velours-beige-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-beige-zoom-DAMrAkI9.avif`,"../images/habitat/rideaux-velours-beige.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-beige-rkMrkhe8.avif`,"../images/habitat/rideaux-velours-rose-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-rose-boite-DT8x0SOi.avif`,"../images/habitat/rideaux-velours-rose-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-rose-zoom-T7Ny8J_8.avif`,"../images/habitat/rideaux-velours-rose.avif":`/~ribatet1/SAE-3.01/Base/assets/rideaux-velours-rose-CNkcMHz3.avif`,"../images/habitat/serviette-cuivre-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-cuivre-zoom-3iPaP7EM.avif`,"../images/habitat/serviette-cuivre.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-cuivre-D8Yz88Ej.avif`,"../images/habitat/serviette-invite-noire-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-noire-zoom-Bv1AaHhL.avif`,"../images/habitat/serviette-invite-noire.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-noire-CQYcjFoo.avif`,"../images/habitat/serviette-invite-orange-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-orange-zoom-CYD4M7Vk.avif`,"../images/habitat/serviette-invite-orange.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-orange-BW_j71D4.avif`,"../images/habitat/serviette-invite-verte-longueur.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-verte-longueur-CYmtp2-i.avif`,"../images/habitat/serviette-invite-verte-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-verte-zoom-D8bN77Xs.avif`,"../images/habitat/serviette-invite-verte.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-invite-verte-H380OaA4.avif`,"../images/habitat/serviette-noire-longueur.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-noire-longueur-CcaH3Jku.avif`,"../images/habitat/serviette-noire.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-noire-CmooFf5M.avif`,"../images/habitat/serviette-verte.avif":`/~ribatet1/SAE-3.01/Base/assets/serviette-verte-Cjt8Z8eK.avif`,"../images/habitat/taies-oreiller-hotel-royal-blanc.avif":`data:image/avif;base64,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`,"../images/habitat/taies-oreiller-hotel-royal-bleu-seul.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-bleu-seul-DCGqeneR.avif`,"../images/habitat/taies-oreiller-hotel-royal-bleu-zoom.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-bleu-zoom-C92Wi9t5.avif`,"../images/habitat/taies-oreiller-hotel-royal-bleu.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-bleu-NfJ5o17X.avif`,"../images/habitat/taies-oreiller-hotel-royal-rose-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-rose-boite-Cwgi5e-a.avif`,"../images/habitat/taies-oreiller-hotel-royal-rose.avif":`/~ribatet1/SAE-3.01/Base/assets/taies-oreiller-hotel-royal-rose-C9WZUMDM.avif`,"../images/hobby/crayons-aquarelle-van-bleiswijck-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/crayons-aquarelle-van-bleiswijck-boite-Do2k5YTH.avif`,"../images/hobby/crayons-aquarelle-van-bleiswijck-complet.avif":`/~ribatet1/SAE-3.01/Base/assets/crayons-aquarelle-van-bleiswijck-complet-DQMZByHG.avif`,"../images/hobby/crayons-aquarelle-van-bleiswijck.avif":`/~ribatet1/SAE-3.01/Base/assets/crayons-aquarelle-van-bleiswijck-CKdSf73d.avif`,"../images/hobby/paillettes-blanc-a-rose.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-blanc-a-rose-ByHqHq3F.avif`,"../images/hobby/paillettes-fushia-a-bleu.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-fushia-a-bleu-CKJFBOmJ.avif`,"../images/hobby/paillettes-rose-a-orange.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-rose-a-orange-BChwCw1E.avif`,"../images/hobby/paillettes-sac.avif":`/~ribatet1/SAE-3.01/Base/assets/paillettes-sac-H030CzW4.avif`,"../images/hobby/peinture-acrylique-van-bleiswijck-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/peinture-acrylique-van-bleiswijck-boite-fbr9r4GC.avif`,"../images/hobby/peinture-acrylique-van-bleiswijck.avif":`/~ribatet1/SAE-3.01/Base/assets/peinture-acrylique-van-bleiswijck-DA9rPbSx.avif`,"../images/hobby/pinceaux-van-bleiswijck-boite.avif":`/~ribatet1/SAE-3.01/Base/assets/pinceaux-van-bleiswijck-boite-CW3Tcveo.avif`,"../images/hobby/pinceaux-van-bleiswijck-fins.avif":`/~ribatet1/SAE-3.01/Base/assets/pinceaux-van-bleiswijck-fins-Dl4gXi2j.avif`,"../images/hobby/pinceaux-van-bleiswijck-larges.avif":`/~ribatet1/SAE-3.01/Base/assets/pinceaux-van-bleiswijck-larges-Bvn6adHJ.avif`,"../images/hobby/toile-peindre-van-bleiswijck.avif":`/~ribatet1/SAE-3.01/Base/assets/toile-peindre-van-bleiswijck-BEzOszMG.avif`,"../images/logo.webp":`/~ribatet1/SAE-3.01/Base/assets/logo-Cjz4wVmC.webp`});function _(e){return e?ce[`../images/${e}`]??``:``}var v={},y=function(e){return{...e,prix:Number(e.prix),prix_unitaire:e.prix_unitaire===null?null:Number(e.prix_unitaire),src:_(e.src)}},le=function(e){return{src:_(e.chemin),alt:e.texte_alternatif??``}};v.fetchPage=async function(e,t,n=null){let r=`produits?page=${e}`;n!=null&&n!==``&&(r+=`&categorie=${encodeURIComponent(n)}`),t!==void 0&&(r+=`&tri=${encodeURIComponent(t.tri)}&parPage=${t.parPage}`);let i=await l(r);return{...i,produits:i.produits.map(y)}},v.fetchBySlug=async function(e){let t=await l(`produits/${encodeURIComponent(e)}`);return{...t,produit:y(t.produit),galerie:(t.galerie??[]).map(le)}};var ue=`<div class="mb-6 flex flex-wrap items-end gap-4 rounded-lg border p-4 border-border-default c-barre-outils">\r
  <label class="flex flex-col gap-2 text-14 font-medium">\r
    Trier par\r
    <select name="tri" class="h-9 min-w-44 rounded-md border bg-surface-default px-3 font-normal transition-colors hover:border-border-default border-border-default">\r
      <option value="nom">Nom (A → Z)</option>\r
      <option value="prix">Prix (croissant)</option>\r
    </select>\r
  </label>\r
\r
  <label class="flex flex-col gap-2 text-14 font-medium">\r
    Produits par page\r
    <select name="parPage" class="h-9 min-w-44 rounded-md border bg-surface-default px-3 font-normal transition-colors hover:border-border-default border-border-default">\r
      <option value="12">12 produits</option>\r
      <option value="24">24 produits</option>\r
      <option value="48">48 produits</option>\r
    </select>\r
  </label>\r
\r
  <span class="ml-auto text-14 text-text-secondary">{{total}} produits</span>\r
</div>\r
`,de={html:function(e){return n(ue,e)},dom:function(e,t){let n=r(de.html(e)),i=n.querySelector(`select[name="tri"]`),a=n.querySelector(`select[name="parPage"]`);return i&&(i.value=e.tri,i.addEventListener(`change`,()=>t.surTri(i.value))),a&&(a.value=String(e.parPage),a.addEventListener(`change`,()=>t.surParPage(Number(a.value)))),n}},fe=`<nav aria-label="Fil d'Ariane" class="mb-4 c-fil-ariane">
  <ol data-zone="items" class="flex flex-wrap items-center gap-2 text-14"></ol>
</nav>`,pe={html:function(){return fe},dom:function(e=[]){let t=r(fe),n=t.querySelector(`[data-zone="items"]`);return e.forEach((t,r)=>{let i=r===e.length-1,a=document.createElement(`li`);if(a.className=`flex items-center gap-2`,i||!t.lien){let e=document.createElement(`span`);e.textContent=t.libelle,e.className=`font-medium text-zinc-900 dark:text-zinc-100`,i&&e.setAttribute(`aria-current`,`page`),a.appendChild(e)}else{let e=document.createElement(`a`);e.href=t.lien,e.dataset.link=``,e.textContent=t.libelle,e.className=`text-zinc-500 underline hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200`,a.appendChild(e)}if(!i){let e=document.createElement(`span`);e.textContent=`/`,e.setAttribute(`aria-hidden`,`true`),e.className=`text-zinc-400`,a.appendChild(e)}n.appendChild(a)}),t}},me=`<span class="inline-flex items-center gap-1.5 border px-2 py-0.5 text-12 font-medium backdrop-blur-xs shadow-2xs {{classes}} c-badge-stock">
  <svg class="h-3 w-3 shrink-0 {{iconClasse}}" aria-hidden="true">
    <use href="#{{id-icon}}"/>
  </svg>
  {{texte}}
</span>
`,b={"En stock":{classes:`border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/80 dark:text-emerald-300`,iconClasse:`fill-emerald-500 dark:fill-emerald-400`,idIcon:`icon-circle`},"Bientôt épuisé":{classes:`border-amber-200 bg-amber-50/90 text-amber-800 dark:border-amber-800/80 dark:bg-amber-950/80 dark:text-amber-300`,iconClasse:`fill-amber-500 dark:fill-amber-400 animate-pulse`,idIcon:`icon-alert-triangle`},Épuisé:{classes:`border-rose-200 bg-rose-50/90 text-rose-800 dark:border-rose-800/80 dark:bg-rose-950/80 dark:text-rose-300`,iconClasse:`fill-rose-500 dark:fill-rose-400`,idIcon:`icon-circle`}};function he(e={}){if(e?.etat){let t=String(e.etat).toLowerCase().trim();return t.includes(`bientot`)||t.includes(`faible`)||t.includes(`alerte`)?`Bientôt épuisé`:t.includes(`épuisé`)||t.includes(`epuise`)||t.includes(`rupture`)?`Épuisé`:`En stock`}return typeof e?.stock==`number`?e.stock<=0?`Épuisé`:e.stock<=(e.seuilAlerte??5)?`Bientôt épuisé`:`En stock`:`En stock`}var x={html:function(e={}){let t=he(e),r=b[t]||b[`En stock`];return n(me,{texte:t,classes:r.classes,iconClasse:r.iconClasse,"id-icon":r.idIcon})},dom:function(e={}){return r(x.html(e))}},ge=`<article class="flex flex-col justify-between overflow-hidden rounded-lg border bg-surface-default shadow-xs transition-shadow hover:shadow-md border-border-default c-carte-produit">\r
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
`,S={html:function(e={}){let t=typeof e.prix==`number`?e.prix.toFixed(2).replace(`.`,`,`):String(e.prix||`0,00`);return n(ge,{nom:e.nom||``,prix:t,src:e.src||e.image||``,alt:e.alt||e.nom||`Produit Action`,lien:e.lien||(e.slug?`/produit/${e.slug}`:e.id?`/produit/${e.id}`:`#`)})},dom:function(e={},t={}){let n=r(S.html(e)),i=n.querySelector(`slot[name="badge-stock"]`);i&&i.replaceWith(x.dom({etat:e.etat,stock:e.stock,seuilAlerte:e.seuilAlerte}));let a=n.querySelector(`[data-action="ajouter-panier"]`),o=e.etat===`Épuisé`||e.etat===`epuise`||e.stock===0;return a&&(o?(a.disabled=!0,a.textContent=`Épuisé`):t.surAjouterPanier&&a.addEventListener(`click`,()=>t.surAjouterPanier(e.id))),n}},_e=`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 c-grille-produits">
  <slot name="cartes"></slot>
</div>
`,ve=`<p class="text-14 text-text-secondary c-grille-produits__vide">
    Aucun produit à afficher.
</p>
`,ye={dom:function(e=[],t={}){if(!e||e.length===0)return r(ve);let n=r(_e),i=e.map(e=>S.dom(e,t)),a=n.querySelector(`slot[name="cartes"]`);return a&&a.replaceWith(...i),n}},be=`<p role="status" class="mb-6 rounded-md border px-4 py-3 text-14 {{couleurs}} c-message">{{texte}}</p>
`,C={erreur:`border-red-700 text-red-700 dark:border-red-400 dark:text-red-400`,succes:`border-green-700 text-green-700 dark:border-green-400 dark:text-green-400`,info:`border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-400`},w={html:function(e){return!e||!e.texte?``:n(be,{texte:e.texte,couleurs:C[e.type]||C.erreur})},dom:function(e){return r(w.html(e))}},xe=`<nav class="mt-10 flex items-center justify-center gap-4 c-pagination">
  <button type="button" data-action="precedente" class="h-9 rounded-md border px-4 text-14 font-medium transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent border-border-default">
    Précédent
  </button>

  <span class="text-14 text-text-secondary">Page {{page}} sur {{pagesTotal}}</span>

  <button type="button" data-action="suivante" class="h-9 rounded-md border px-4 text-14 font-medium transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent border-border-default">
    Suivant
  </button>
</nav>
`,T={html:function(e){return n(xe,{page:e.page||1,pagesTotal:e.pagesTotal||1})},dom:function(e,t={}){let n=r(T.html(e)),i=n.querySelector(`[data-action="precedente"]`),a=n.querySelector(`[data-action="suivante"]`);return i&&(i.disabled=e.page<=1,t.surPage&&i.addEventListener(`click`,()=>t.surPage(e.page-1))),a&&(a.disabled=e.page>=e.pagesTotal,t.surPage&&a.addEventListener(`click`,()=>t.surPage(e.page+1))),n}},Se=`<section class="mx-auto max-w-5xl px-6 pt-10 pb-16">
  <slot name="ariane"></slot>
  <h1 class="mb-6 text-2xl font-semibold tracking-tight">Catalogue</h1>

  <slot name="barre-outils"></slot>
  <slot name="message"></slot>
  <slot name="grille"></slot>
  <slot name="pagination"></slot>
</section>
`,E={catalogue:null,message:null,categorieSlug:null,categorieLibelle:null},D={};D.charger=async function(e,t,n=E.categorieSlug){try{E.catalogue=await v.fetchPage(e,t,n),E.message=null}catch(e){E.catalogue=null,E.message={type:`erreur`,texte:`Impossible de charger le catalogue : ${e.message}`}}},D.handler_changerTri=async function(e){await D.charger(1,{tri:e,parPage:E.catalogue.parPage},E.categorieSlug),O.rafraichir()},D.handler_changerParPage=async function(e){await D.charger(1,{tri:E.catalogue.tri,parPage:e},E.categorieSlug),O.rafraichir()},D.handler_changerPage=async function(e){await D.charger(e,{tri:E.catalogue.tri,parPage:E.catalogue.parPage},E.categorieSlug),O.rafraichir(),window.scrollTo({top:0,behavior:`smooth`})},D.init=async function(e=null){return E.categorieSlug=e!=null&&e!==``?e:null,await D.charger(1,void 0,E.categorieSlug),E.categorieLibelle=E.catalogue?.categorie?.libelle??E.categorieSlug,O.init()};var O={};O.racine=null,O.init=function(){let e=O.createPageFragment();return O.racine=e.firstElementChild,e},O.rafraichir=function(){let e=O.createPageFragment(),t=e.firstElementChild;O.racine.replaceWith(e),O.racine=t},O.createPageFragment=function(){let e=r(Se),t=E.categorieSlug===null?[{libelle:`Catalogue`}]:[{libelle:`Catalogue`,lien:`/`},{libelle:E.categorieLibelle}];if(e.querySelector(`slot[name="ariane"]`).replaceWith(pe.dom(t)),e.querySelector(`slot[name="message"]`).replaceWith(w.dom(E.message)),E.catalogue===null){for(let t of e.querySelectorAll(`slot`))t.remove();return e}return e.querySelector(`slot[name="barre-outils"]`).replaceWith(de.dom(E.catalogue,{surTri:D.handler_changerTri,surParPage:D.handler_changerParPage})),e.querySelector(`slot[name="grille"]`).replaceWith(ye.dom(E.catalogue.produits)),e.querySelector(`slot[name="pagination"]`).replaceWith(T.dom(E.catalogue,{surPage:D.handler_changerPage})),e};function k(e={}){return D.init(e.slug??e.Slug??e.categorie??null)}var A=`Click & Collect`;function j(e,t,n){if(!n)return;let r=document.head.querySelector(`meta[${e}="${t}"]`);r||(r=document.createElement(`meta`),r.setAttribute(e,t),document.head.appendChild(r)),r.setAttribute(`content`,n)}function Ce(e){if(!e)return;let t=document.head.querySelector(`link[rel="canonical"]`);t||(t=document.createElement(`link`),t.setAttribute(`rel`,`canonical`),document.head.appendChild(t)),t.setAttribute(`href`,e)}function we(e=`/`){let t=`/~ribatet1/SAE-3.01/Base/`.replace(/\/$/,``),n=e.startsWith(`/`)?e:`/${e}`;return`${window.location.origin}${t}${n}`}function Te(e){return e?/^https?:\/\//.test(e)?e:`${window.location.origin}${e}`:``}function M({titre:e,description:t,image:n,chemin:r,type:i=`website`}={}){let a=e?`${e} | ${A}`:A,o=r?we(r):window.location.href;if(document.title=a,j(`name`,`description`,t),j(`property`,`og:site_name`,A),j(`property`,`og:title`,a),j(`property`,`og:description`,t),j(`property`,`og:type`,i),j(`property`,`og:url`,o),j(`property`,`og:locale`,`fr_FR`),j(`name`,`twitter:card`,n?`summary_large_image`:`summary`),j(`name`,`twitter:title`,a),j(`name`,`twitter:description`,t),n){let e=Te(n);j(`property`,`og:image`,e),j(`name`,`twitter:image`,e)}Ce(o)}var N=`sae301:panier`,Ee=new Set;function P(){try{let e=window.localStorage.getItem(N);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}}function De(e){try{window.localStorage.setItem(N,JSON.stringify(e))}catch{}Ae();for(let t of Ee)t(e)}function Oe(){return P().reduce((e,t)=>e+(Number(t.quantite)||0),0)}function ke(e,t=1){let n=P(),r=Math.max(1,Math.floor(Number(t)||1)),i=e?.id;if(i==null)return n;let a=n.find(e=>String(e.id)===String(i));return a?a.quantite=(Number(a.quantite)||0)+r:n.push({id:i,slug:e.slug??``,nom:e.nom??``,prix:Number(e.prix)||0,quantite:r,src:e.src??``}),De(n),n}function Ae(){let e=Oe();for(let t of document.querySelectorAll(`[data-role="compteur-panier"]`))t.textContent=String(e)}var F=`<div class="w-fit inline-flex items-center rounded-md border border-border-default c-boutons-quantite">
    <button type="button" data-action="moins" aria-label="Diminuer la quantité" class="h-10 w-10 text-18 hover:bg-surface-subtle disabled:opacity-40">
    −
    </button>
    <input type="number" name="quantite" min="1" value="1" aria-label="Quantité" class="h-10 w-14 bg-transparent text-center text-14" />
    <button type="button" data-action="plus" aria-label="Augmenter la quantité" class="h-10 w-10 text-18 hover:bg-surface-subtle disabled:opacity-40">
    +
    </button>
</div>`,I={html:function(){return F},ajuster:function(e,t=1,n=1/0){let r=parseInt(e,10);return Number.isNaN(r)&&(r=t),Math.min(Math.max(r,t),n)},dom:function(e={},t={}){let n=e.min??1,i=e.max??1/0,a=r(F),o=a.querySelector(`input[name="quantite"]`),s=a.querySelector(`[data-action="moins"]`),c=a.querySelector(`[data-action="plus"]`);o.min=n,Number.isFinite(i)&&(o.max=i);let l=(e,r=!0)=>{let a=I.ajuster(e,n,i);o.value=a,s.disabled=a<=n,c.disabled=a>=i,r&&t.surChange&&t.surChange(a)};return o.value=I.ajuster(e.valeur??n,n,i),s.disabled=o.value<=n,c.disabled=o.value>=i,s.addEventListener(`click`,()=>l(Number(o.value)-1)),c.addEventListener(`click`,()=>l(Number(o.value)+1)),o.addEventListener(`change`,()=>l(o.value)),a}},L=`<figure class="flex flex-col gap-3 w-full c-galerie-images">
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
</figure>`,je={html:function(){return L},dom:function(e=[]){let t=r(L),n=t.querySelector(`[data-zone="principale"]`),i=t.querySelector(`[data-zone="miniatures"]`),a=t.querySelector(`[data-action="precedent"]`),o=t.querySelector(`[data-action="suivant"]`),s=0,c=[],l=t.querySelector(`[data-zone="index-image"]`),u=t.querySelector(`[data-zone="total-images"]`);u&&(u.textContent=String(e.length||1)),e.length<=1&&(a&&(a.hidden=!0),o&&(o.hidden=!0));let d=t=>{s=(t+e.length)%e.length,n.src=e[s].src,n.alt=e[s].alt||``,l&&(l.textContent=String(s+1)),c.forEach((e,t)=>e.setAttribute(`aria-current`,t===s?`true`:`false`))};return e.forEach((e,t)=>{let n=document.createElement(`button`);n.type=`button`,n.setAttribute(`aria-label`,`Voir l'image ${t+1}`),n.className=`h-16 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 aria-[current=true]:border-zinc-950 dark:aria-[current=true]:border-zinc-50`;let r=document.createElement(`img`);r.src=e.src,r.alt=``,r.className=`h-full w-full object-contain`,n.appendChild(r),n.addEventListener(`click`,()=>d(t)),i.appendChild(n),c.push(n)}),a&&a.addEventListener(`click`,()=>d(s-1)),o&&o.addEventListener(`click`,()=>d(s+1)),e.length>0&&d(0),t}},Me=`<a href="{{lien}}" data-link class="inline-flex items-center gap-1 text-14 text-text-secondary underline hover:text-text-primary hover:text-text-secondary c-lien-retour">← {{libelle}}</a>`,R={html:function(e={}){return n(Me,{libelle:e.libelle??`Retour`,lien:e.lien??`#`})},dom:function(e={}){return r(R.html(e))}},Ne=`<article class="flex flex-col gap-5 c-details-produit">\r
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
</article>`,z={html:function(e={}){let t=typeof e.prix==`number`?e.prix.toFixed(2).replace(`.`,`,`):String(e.prix||`0,00`);return n(Ne,{nom:e.nom||``,prix:t,description:e.description||``})},dom:function(e={},t={}){let n=r(z.html(e)),i=n.querySelector(`slot[name="badge-stock"]`);i&&i.replaceWith(x.dom({etat:e.etat,stock:e.stock,seuilAlerte:e.seuilAlerte}));let a=1,o=n.querySelector(`slot[name="quantite"]`);o&&o.replaceWith(I.dom({valeur:1,min:1,max:e.stock},{surChange:e=>{a=e}}));let s=n.querySelector(`slot[name="galerie"]`);s&&s.replaceWith(je.dom(e.images??[]));let c=n.querySelector(`slot[name="lien-retour-catalogue"]`);c&&c.replaceWith(R.dom({libelle:e.libelleCatalogue??`Tous les produits`,lien:e.lienCatalogue??`/`}));let l=n.querySelector(`slot[name="lien-retour-categorie"]`);l&&l.replaceWith(R.dom({libelle:e.libelleCategorie??`Catégorie`,lien:e.lienCategorie??`/`}));let u=n.querySelector(`[data-action="ajouter-panier"]`),d=e.etat===`Épuisé`||e.stock===0;return u&&(d?(u.disabled=!0,u.textContent=`Épuisé`):t.surAjouterPanier&&u.addEventListener(`click`,()=>{t.surAjouterPanier(e.id,a)})),n}},Pe=`<section class="mx-auto max-w-6xl px-6 pt-10 pb-16">
  <slot name="ariane"></slot>

  <div data-zone="message"></div>

  <slot name="produit"></slot>
</section>
`,B={slug:null,produit:null,galerie:[],message:null},V={};V.charger=async function(e){try{let t=await v.fetchBySlug(e);B.produit=t.produit,B.galerie=t.galerie,B.message=null}catch(e){B.produit=null,B.galerie=[],B.message={type:`erreur`,texte:e.statut===404?`Ce produit n'existe pas ou n'est plus disponible.`:`Impossible de charger ce produit : ${e.message}`}}},V.produitAffichage=function(){if(B.produit===null)return null;let e=B.produit.categorie??null;return{...B.produit,images:B.galerie,lienCatalogue:`/`,libelleCatalogue:`Tous les produits`,lienCategorie:e?.slug?`/categorie/${e.slug}`:`/`,libelleCategorie:e?.libelle??`Catégorie`}},V.filAriane=function(){let e=[{libelle:`Catalogue`,lien:`/`}],t=B.produit?.categorie;return t?.slug&&e.push({libelle:t.libelle,lien:`/categorie/${t.slug}`}),B.produit&&e.push({libelle:B.produit.nom}),e},V.handler_ajouterPanier=function(e,t){B.produit!==null&&(ke({id:e??B.produit.id,slug:B.produit.slug,nom:B.produit.nom,prix:B.produit.prix,src:B.galerie[0]?.src??``},t),B.message={type:`succes`,texte:`${B.produit.nom} a été ajouté au panier.`},H.majMessage())},V.majSeo=function(){if(B.produit===null){M({titre:`Produit introuvable`,description:`Ce produit n'existe pas ou n'est plus disponible.`,chemin:`/`});return}let e=(B.produit.description||``).slice(0,300).trim()||`Fiche produit : ${B.produit.nom}.`;M({titre:B.produit.nom,description:e,image:B.galerie[0]?.src??``,chemin:`/produit/${B.produit.slug}`,type:`product`})},V.init=async function(e){return B.slug=e??null,await V.charger(B.slug),V.majSeo(),H.init()};var H={};H.racine=null,H.zoneMessage=null,H.init=function(){let e=H.createPageFragment();return H.racine=e.firstElementChild,e},H.rafraichir=function(){let e=H.createPageFragment(),t=e.firstElementChild;H.racine.replaceWith(e),H.racine=t},H.majMessage=function(){H.zoneMessage!==null&&H.zoneMessage.replaceChildren(w.dom(B.message))},H.createPageFragment=function(){let e=r(Pe);e.querySelector(`slot[name="ariane"]`).replaceWith(pe.dom(V.filAriane())),H.zoneMessage=e.querySelector(`[data-zone="message"]`),H.zoneMessage.replaceChildren(w.dom(B.message));let t=e.querySelector(`slot[name="produit"]`);if(B.produit===null){for(let t of e.querySelectorAll(`slot`))t.remove();return e}return t.replaceWith(z.dom(V.produitAffichage(),{surAjouterPanier:V.handler_ajouterPanier})),e};function Fe(e={}){return V.init(e.slug??e.Slug??null)}var U={};U.login=async function(e,t){return u(`login`,{login:e,mdp:t})},U.logout=async function(){return u(`logout`)};var W={};W.fetch=async function(){return l(`admin/stats`)};var Ie=`<section class="mb-6 rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-formulaires-admin-connexionadmin">
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
`,G={html:function(e={}){return n(Ie,{login:e?.login||``})},dom:function(e={},t={}){let n=r(G.html(e)),i=n.querySelector(`form`);return i&&i.addEventListener(`submit`,e=>{e.preventDefault(),t.surConnexion&&t.surConnexion(i.elements.login.value.trim(),i.elements.mdp.value)}),n}},Le=`<section class="mb-6 rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-statistiques">
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
`,Re=`<li class="flex items-center justify-between py-2.5 c-statistiques__ligne-stats">
  <div class="flex items-center gap-2">
    <span class="font-medium text-text-primary">{{nom}}</span>
    <span class="text-12 text-text-secondary">({{detail}})</span>
  </div>
  <span class="font-semibold text-text-primary">{{valeur}}</span>
</li>
`,K={html:function(e={}){return n(Le,{revenus7j:typeof e.revenus7j==`number`?e.revenus7j.toFixed(2).replace(`.`,`,`):`0,00`,totalCommandes:e.totalCommandes??0,totalProduits:e.totalProduits??0,alertesStock:e.alertesStock??0})},dom:function(e={}){let t=r(K.html(e)),i=t.querySelector(`[data-zone="statuts-commandes"]`);i&&Array.isArray(e.statutsCommandes)&&e.statutsCommandes.forEach(e=>{let t=document.createElement(`div`);t.className=`flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950`,t.innerHTML=`
          <span class="capitalize text-zinc-600 dark:text-zinc-400">${e.statut}</span>
          <span class="font-bold text-zinc-900 dark:text-zinc-100">${e.nombre}</span>
        `,i.appendChild(t)});let a=t.querySelector(`[data-zone="graphique-stocks"]`);if(a&&Array.isArray(e.stocksParProduit)){let t=Math.max(...e.stocksParProduit.map(e=>e.stock||0),1);e.stocksParProduit.forEach(e=>{let n=Math.max(5,Math.round((e.stock||0)/t*100)),r=(e.stock||0)<=(e.seuilAlerte??5),i=document.createElement(`div`);i.className=`flex items-center gap-3 text-xs`;let o=document.createElement(`span`);o.className=`w-40 shrink-0 truncate text-zinc-700 dark:text-zinc-300`,o.textContent=e.nom,o.title=e.nom;let s=document.createElement(`div`);s.className=`h-4 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800`;let c=document.createElement(`div`);c.className=r?`h-full rounded-full bg-amber-500 transition-all duration-300`:`h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300`,c.style.width=`${n}%`;let l=document.createElement(`span`);l.className=`w-8 text-right font-medium text-zinc-900 dark:text-zinc-100`,l.textContent=e.stock,s.appendChild(c),i.append(o,s,l),a.appendChild(i)})}let o=t.querySelector(`[data-zone="top-ventes"]`);return o&&Array.isArray(e.topVentes)&&e.topVentes.forEach(e=>{let t=n(Re,{nom:e.nom||`Article`,detail:`${e.quantite||0} vendus`,valeur:e.totalVentes?`${Number(e.totalVentes).toFixed(2).replace(`.`,`,`)} €`:``});o.appendChild(r(t))}),t}},ze=`<section class="mx-auto max-w-2xl px-6 pt-10 pb-16">
  <slot name="connexion"></slot>
  <slot name="message"></slot>
  <slot name="statistiques"></slot>
</section>
`,q={login:``,stats:null,message:null},J={};J.chargerStats=async function(){try{q.stats=await W.fetch()}catch(e){q.stats=null;let t=e.message;e.statut===401&&(t=`Vous n'êtes pas connecté.`),e.statut===403&&(t=`Accès réservé aux administrateurs.`),q.message={type:`erreur`,texte:t}}},J.handler_connexion=async function(e,t){q.login=e;try{await U.login(e,t),q.message={type:`succes`,texte:`Connecté en tant que ${e}.`},await J.chargerStats()}catch(e){q.message={type:`erreur`,texte:e.message}}Y.rafraichir()},J.handler_deconnexion=async function(){try{await U.logout(),q.message=null,await J.chargerStats()}catch(e){q.message={type:`erreur`,texte:e.message}}Y.rafraichir()},document.addEventListener(`admin:deconnexion`,J.handler_deconnexion),J.init=async function(){return q.message=null,await J.chargerStats(),Y.init()};var Y={};Y.racine=null,Y.init=function(){let e=Y.createPageFragment();return Y.racine=e.firstElementChild,e},Y.rafraichir=function(){let e=Y.createPageFragment(),t=e.firstElementChild;Y.racine.replaceWith(e),Y.racine=t},Y.createPageFragment=function(){let e=r(ze);e.querySelector(`slot[name="connexion"]`).replaceWith(G.dom({login:q.login},{surConnexion:J.handler_connexion,surDeconnexion:J.handler_deconnexion})),e.querySelector(`slot[name="message"]`).replaceWith(w.dom(q.message));let t=e.querySelector(`slot[name="statistiques"]`);return q.stats===null?t.remove():t.replaceWith(K.dom(q.stats)),e};function Be(){return J.init()}var Ve=`<section aria-labelledby="titre-formulaire-categorie" class="mb-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
    <h2 id="titre-formulaire-categorie" class="mb-4 text-xl font-semibold text-zinc-950 dark:text-zinc-50">{{titre}}</h2>

    <form novalidate class="flex flex-col gap-4">
        <label class="flex flex-col gap-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Nom
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
`,He={html:function(e={}){return n(Ve,{titre:e.id?`Modifier la catégorie`:`Nouvelle catégorie`})},dom:function(e={},t={}){let n=r(He.html(e)),i=n.querySelector(`form`);return i.elements.libelle.value=e.nom??``,i.elements.description.value=e.description??``,i.addEventListener(`submit`,e=>{e.preventDefault(),t.surEnregistrer?.({libelle:i.elements.libelle.value,description:i.elements.description.value})}),n.querySelector(`[data-action="annuler"]`).addEventListener(`click`,()=>{t.surAnnuler?.()}),n}},Ue=`<section role="dialog" aria-modal="true" aria-labelledby="titre-suppr-categorie" class="mb-6 rounded-lg border bg-surface-default p-6 shadow-xs border-border-default c-formulaires-admin-suppressioncategorie">
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
</section>`,We={html:function(e={}){return n(Ue,{nom:e.nom??``})},dom:function(e={},t={}){let n=r(We.html(e)),i=n.querySelector(`[data-zone="info"]`),a=n.querySelector(`[data-zone="reaffectation"]`),o=a.querySelector(`select`),s=n.querySelector(`[data-zone="erreur"]`),c=n.querySelector(`[data-action="confirmer"]`),l=Number(e.nbProduits||0),u=e.categories||[];return l===0?(i.textContent=`Cette catégorie ne contient aucun produit.`,a.hidden=!0):(i.textContent=`Elle contient ${l} produit${l>1?`s`:``}.`,u.length===0?(s.textContent=`Impossible de supprimer : créez d'abord une autre catégorie pour y réaffecter ses produits.`,s.classList.remove(`hidden`),c.disabled=!0,a.hidden=!0):u.forEach(e=>{let t=document.createElement(`option`);t.value=e.id,t.textContent=e.nom,o.appendChild(t)})),c.addEventListener(`click`,()=>{let n=l>0?o.value:null;t.surConfirmer?.(e.id,n)}),n.querySelectorAll(`[data-action="fermer"]`).forEach(e=>e.addEventListener(`click`,()=>t.surFermer?.())),n}},Ge=`<section class="mb-6 overflow-x-auto rounded-lg border bg-surface-default shadow-xs border-border-default c-tableaux-recapitulatifs-admin-categories">
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
</section>`,Ke=`<tr class="text-zinc-900 dark:text-zinc-100">
  <td class="px-4 py-3 font-medium">{{nom}}</td>
  <td class="px-4 py-3 text-zinc-600 dark:text-zinc-400">{{description}}</td>
  <td class="px-4 py-3">{{nbProduits}}</td>
  <td class="whitespace-nowrap px-4 py-3 text-right">
    <button type="button" data-action="modifier" data-id="{{id}}" class="mr-3 text-blue-600 underline hover:text-blue-700 dark:text-blue-400">Modifier</button>
    <button type="button" data-action="supprimer" data-id="{{id}}" class="text-red-700 underline hover:text-red-900 dark:text-red-400">Supprimer</button>
  </td>
</tr>`,qe={html:function(){return Ge},dom:function(e=[],t={}){let i=r(Ge),a=i.querySelector(`[data-zone="lignes"]`);return a.innerHTML=e.length?e.map(e=>n(Ke,e)).join(``):`<tr><td colspan="4" class="px-4 py-6 text-center text-zinc-500">Aucune catégorie pour le moment.</td></tr>`,a.addEventListener(`click`,e=>{let n=e.target.closest(`[data-action]`);if(!n)return;let r=n.dataset.id;n.dataset.action===`modifier`&&t.surModifier?.(r),n.dataset.action===`supprimer`&&t.surSupprimer?.(r)}),i}},Je=`<section class="mx-auto max-w-4xl px-6 pt-10 pb-16">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 class="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Gestion des catégories</h1>
        <button type="button" data-action="creer" class="h-10 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900">Nouvelle catégorie</button>
    </div>

    <p data-zone="acces" hidden class="mb-6 text-sm text-zinc-600 dark:text-zinc-300">
        Cette page est réservée à l'administrateur.
        <a href="/admin" data-link class="font-medium text-blue-600 underline hover:text-blue-700 dark:text-blue-400">Se connecter</a>.
    </p>

    <slot name="message"></slot>
    <slot name="formulaire"></slot>
    <slot name="suppression"></slot>
    <slot name="tableau"></slot>
</section>
`,Ye=100,Xe=500,X={acces:null,categories:[],message:null,edition:null,suppression:null},Z={};Z.chargerCategories=async function(){try{X.categories=await p.fetchAdminListe(),X.acces=`ok`}catch(e){X.categories=[],e instanceof o&&e.statut===401?X.acces=`non-connecte`:e instanceof o&&e.statut===403?X.acces=`refuse`:X.message={type:`erreur`,texte:e.message}}},Z.trouverCategorie=function(e){return X.categories.find(t=>String(t.id)===String(e))??null},Z.validerFormulaire=function({libelle:e,description:t}){return e.trim()===``?`Le nom de la catégorie est obligatoire.`:e.trim().length>Ye?`Le nom ne doit pas dépasser ${Ye} caractères.`:t.trim().length>Xe?`La description ne doit pas dépasser ${Xe} caractères.`:null},Z.handler_ouvrirCreation=function(){X.edition={id:null,nom:``,description:``},X.suppression=null,X.message=null,Q.rafraichir()},Z.handler_ouvrirModification=function(e){let t=Z.trouverCategorie(e);t&&(X.edition={id:t.id,nom:t.nom,description:t.description},X.suppression=null,X.message=null,Q.rafraichir())},Z.handler_annulerFormulaire=function(){X.edition=null,Q.rafraichir()},Z.handler_enregistrer=async function(e){X.edition={...X.edition,nom:e.libelle,description:e.description};let t=Z.validerFormulaire(e);if(t){X.message={type:`erreur`,texte:t},Q.rafraichir();return}let n={libelle:e.libelle.trim(),description:e.description.trim()};try{X.edition.id===null?(await p.creer(n),X.message={type:`succes`,texte:`Catégorie « ${n.libelle} » créée.`}):(await p.modifier(X.edition.id,n),X.message={type:`succes`,texte:`Catégorie « ${n.libelle} » modifiée.`}),X.edition=null,await Z.chargerCategories()}catch(e){X.message={type:`erreur`,texte:e.message}}Q.rafraichir()},Z.handler_demanderSuppression=function(e){let t=Z.trouverCategorie(e);t&&(X.suppression=t,X.edition=null,X.message=null,Q.rafraichir())},Z.handler_annulerSuppression=function(){X.suppression=null,Q.rafraichir()},Z.handler_confirmerSuppression=async function(e,t){let n=Z.trouverCategorie(e)?.nom??``;try{await p.supprimer(e,t),X.suppression=null,X.message={type:`succes`,texte:`Catégorie « ${n} » supprimée.`},await Z.chargerCategories()}catch(e){X.message={type:`erreur`,texte:e.message}}Q.rafraichir()},Z.handler_deconnexion=async function(){if(Q.racine?.isConnected){try{await U.logout(),X.message={type:`info`,texte:`Vous êtes déconnecté.`}}catch(e){X.message={type:`erreur`,texte:e.message}}X.acces=`non-connecte`,X.categories=[],X.edition=null,X.suppression=null,Q.rafraichir()}},document.addEventListener(`admin:deconnexion`,Z.handler_deconnexion),Z.init=async function(){return X.message=null,X.edition=null,X.suppression=null,await Z.chargerCategories(),Q.init()};var Q={};Q.racine=null,Q.init=function(){let e=Q.createPageFragment();return Q.racine=e.firstElementChild,e},Q.rafraichir=function(){let e=Q.createPageFragment(),t=e.firstElementChild;Q.racine.replaceWith(e),Q.racine=t},Q.createPageFragment=function(){let e=r(Je),t=X.acces===`ok`;return e.querySelector(`[data-action="creer"]`).hidden=!t,e.querySelector(`[data-action="creer"]`).addEventListener(`click`,Z.handler_ouvrirCreation),e.querySelector(`[data-zone="acces"]`).hidden=t,e.querySelector(`slot[name="message"]`).replaceWith(w.dom(X.message)),e.querySelector(`slot[name="formulaire"]`).replaceWith(X.edition?He.dom(X.edition,{surEnregistrer:Z.handler_enregistrer,surAnnuler:Z.handler_annulerFormulaire}):``),e.querySelector(`slot[name="suppression"]`).replaceWith(X.suppression?We.dom({id:X.suppression.id,nom:X.suppression.nom,nbProduits:X.suppression.nbProduits,categories:X.categories.filter(e=>e.id!==X.suppression.id).map(e=>({id:e.id,nom:e.nom}))},{surConfirmer:Z.handler_confirmerSuppression,surFermer:Z.handler_annulerSuppression}):``),e.querySelector(`slot[name="tableau"]`).replaceWith(t?qe.dom(X.categories,{surModifier:Z.handler_ouvrirModification,surSupprimer:Z.handler_demanderSuppression}):``),e};function Ze(){return Z.init()}var Qe=`<section class="mx-auto max-w-5xl px-6 pt-10 pb-16">
  <h1 class="mb-6 text-2xl font-semibold tracking-tight">Page introuvable</h1>
  <p class="mb-6 text-sm text-zinc-500 dark:text-zinc-400">Cette page n'existe pas.</p>
  <a href="/" data-link class="text-sm font-medium underline underline-offset-4">Retour au catalogue</a>
</section>
`;function $e(){return Qe}document.body.insertAdjacentHTML(`afterbegin`,`<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  
  <!-- Circle -->
  <symbol id="icon-circle" viewBox="0 0 24 24" fill="currentColor">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z" />
  </symbol>

  <!-- Alert Triangle -->
  <symbol id="icon-alert-triangle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 9v4" />
    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
    <path d="M12 16h.01" />
  </symbol>

  <!-- Cross -->
  <symbol id="icon-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </symbol>

  <!-- Check -->
  <symbol id="icon-check" viewBox="0 0 24 24" fill="currentColor">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M20.707 6.293a1 1 0 0 1 0 1.414l-10 10a1 1 0 0 1 -1.414 0l-5 -5a1 1 0 0 1 1.414 -1.414l4.293 4.293l9.293 -9.293a1 1 0 0 1 1.414 0" />
  </symbol>

  <!-- User Circle -->
  <symbol id="icon-user-circle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
  </symbol>

  <!-- Shopping Bag -->
  <symbol id="icon-shopping-bag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304" />
    <path d="M9 11v-5a3 3 0 0 1 6 0v5" />
  </symbol>

  <!-- Sun -->
  <symbol id="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
  </symbol>

  <!-- Moon -->
  <symbol id="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008" />
  </symbol>

</svg>`);var $=new e(`app`,{base:`/~ribatet1/SAE-3.01/Base/`});$.addLayout(`/`,se),$.addRoute(`/`,k),$.addRoute(`/categorie/:slug`,k),$.addRoute(`/produit/:slug`,Fe),$.addRoute(`/admin`,Be),$.addRoute(`/admin/categories`,Ze),$.addRoute(`*`,$e),$.start();