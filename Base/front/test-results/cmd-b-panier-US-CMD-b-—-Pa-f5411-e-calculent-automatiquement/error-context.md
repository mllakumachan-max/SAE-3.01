# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cmd-b-panier.spec.js >> US CMD-b — Panier d'achat >> CA — Les totaux se calculent automatiquement
- Location: tests/cmd-b-panier.spec.js:81:3

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - figure [ref=f1e5]:
      - generic [ref=f1e6]:
        - link "Logo de l'application Click & Collect" [ref=f1e7] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/
          - img "Logo de l'application" [ref=f1e8]
          - generic [ref=f1e9]: Click & Collect
        - generic [ref=f1e10]:
          - button "Changer de thème" [ref=f1e11] [cursor=pointer]
          - link "Mon compte" [ref=f1e14] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/compte
          - link "Panier 0" [ref=f1e18] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/panier
            - generic [ref=f1e21]: Panier
            - generic [ref=f1e22]: "0"
      - navigation [ref=f1e24]:
        - link "Tous les produits" [ref=f1e25] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/
        - link "Multimédia 23" [ref=f1e26] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/multimedia
          - generic [ref=f1e27]: Multimédia
          - generic [ref=f1e28]: "23"
        - link "Habitat 24" [ref=f1e29] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/habitat
          - generic [ref=f1e30]: Habitat
          - generic [ref=f1e31]: "24"
        - link "Hobby 25" [ref=f1e32] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/hobby
          - generic [ref=f1e33]: Hobby
          - generic [ref=f1e34]: "25"
        - link "Bricolage 26" [ref=f1e35] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/bricolage
          - generic [ref=f1e36]: Bricolage
          - generic [ref=f1e37]: "26"
  - main [ref=f1e38]:
    - generic [ref=f1e39]:
      - navigation "Fil d'Ariane" [ref=f1e40]:
        - list [ref=f1e41]:
          - listitem [ref=f1e42]:
            - link "Catalogue" [ref=f1e43] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/
            - generic [aria-hidden] [ref=f1e44]: /
          - listitem [ref=f1e45]:
            - link "Multimédia" [ref=f1e46] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/categorie/multimedia
            - generic [aria-hidden] [ref=f1e47]: /
          - listitem [ref=f1e48]:
            - generic [ref=f1e49]: Amplificateur Wi-Fi
      - article [ref=f1e50]:
        - list [ref=f1e51]:
          - listitem [ref=f1e52]:
            - link "← Tous les produits" [ref=f1e53] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/
          - listitem [ref=f1e54]:
            - link "← Multimédia" [ref=f1e55] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/categorie/multimedia
        - figure "Amplificateur Wi-Fi Épuisé 19,95 € Étend la couverture réseau pour éliminer les zones mortes dans la maison. Options du produit Quantité Diminuer la quantité 1 Augmenter la quantité Épuisé" [ref=f1e56]:
          - figure [ref=f1e57]:
            - paragraph [ref=f1e60]: "{{numero-img}} / 1"
          - generic [ref=f1e61]:
            - generic [ref=f1e62]:
              - heading "Amplificateur Wi-Fi" [level=1] [ref=f1e63]
              - generic [ref=f1e64]: Épuisé
            - paragraph [ref=f1e67]: 19,95 €
            - paragraph [ref=f1e68]: Étend la couverture réseau pour éliminer les zones mortes dans la maison.
            - group "Options du produit"
            - generic [ref=f1e70]:
              - text: Quantité
              - generic [ref=f1e71]:
                - button "Diminuer la quantité" [disabled] [ref=f1e72]: −
                - spinbutton "Quantité" [ref=f1e73]: "0"
                - button "Augmenter la quantité" [disabled] [ref=f1e74]: +
            - button "Épuisé" [disabled] [ref=f1e75]
```