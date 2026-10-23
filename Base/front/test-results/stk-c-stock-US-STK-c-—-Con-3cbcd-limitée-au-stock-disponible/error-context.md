# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stk-c-stock.spec.js >> US STK-c — Contraintes de stock >> CA — La quantité maximum est limitée au stock disponible
- Location: tests/stk-c-stock.spec.js:67:3

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
        - link "Bricolage 29" [ref=f1e35] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/bricolage
          - generic [ref=f1e36]: Bricolage
          - generic [ref=f1e37]: "29"
        - link "Catégorie test 1792746213732 0" [ref=f1e38] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/categorie-test-1792746213732
          - generic [ref=f1e39]: Catégorie test 1792746213732
          - generic [ref=f1e40]: "0"
        - link "Catégorie modif 1792746214441 mod 0" [ref=f1e41] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/categorie-modif-1792746214441
          - generic [ref=f1e42]: Catégorie modif 1792746214441 mod
          - generic [ref=f1e43]: "0"
  - main [ref=f1e44]:
    - generic [ref=f1e45]:
      - navigation "Fil d'Ariane" [ref=f1e46]:
        - list [ref=f1e47]:
          - listitem [ref=f1e48]:
            - link "Catalogue" [ref=f1e49] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/
            - generic [aria-hidden] [ref=f1e50]: /
          - listitem [ref=f1e51]:
            - link "Multimédia" [ref=f1e52] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/categorie/multimedia
            - generic [aria-hidden] [ref=f1e53]: /
          - listitem [ref=f1e54]:
            - generic [ref=f1e55]: Kit de nettoyage multimédia
      - article [ref=f1e56]:
        - list [ref=f1e57]:
          - listitem [ref=f1e58]:
            - link "← Tous les produits" [ref=f1e59] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/
          - listitem [ref=f1e60]:
            - link "← Multimédia" [ref=f1e61] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/categorie/multimedia
        - figure "Kit de nettoyage multimédia Épuisé 1,89 € Spray, microfibre et brosse pour un entretien optimal des téléphones et écrans. Options du produit Quantité Diminuer la quantité 1 Augmenter la quantité Épuisé" [ref=f1e62]:
          - figure [ref=f1e63]:
            - paragraph [ref=f1e66]: "{{numero-img}} / 1"
          - generic [ref=f1e67]:
            - generic [ref=f1e68]:
              - heading "Kit de nettoyage multimédia" [level=1] [ref=f1e69]
              - generic [ref=f1e70]: Épuisé
            - paragraph [ref=f1e73]: 1,89 €
            - paragraph [ref=f1e74]: Spray, microfibre et brosse pour un entretien optimal des téléphones et écrans.
            - group "Options du produit"
            - generic [ref=f1e76]:
              - text: Quantité
              - generic [ref=f1e77]:
                - button "Diminuer la quantité" [disabled] [ref=f1e78]: −
                - spinbutton "Quantité" [ref=f1e79]: "0"
                - button "Augmenter la quantité" [disabled] [ref=f1e80]: +
            - button "Épuisé" [disabled] [ref=f1e81]
```