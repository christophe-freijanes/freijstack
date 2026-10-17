# Assistant recrutement et CV (Portfolio)

## Sources de vérité

- CV principal : `public/cv/CV-Christophe-FREIJANES.pdf`.
- CV ATS téléchargeable : `public/cv/CV-Christophe-FREIJANES-ATS.pdf`.
- CV ATS HTML (imprimable) : `public/pages/resume.html`.
- Index de réponses FR/EN : `public/data/recruitment-knowledge.json`.

Les deux PDF doivent être mis à jour sur **la branche de cette PR** avant fusion.
Le CV HTML et les réponses sont basés sur le CV de 2026 fourni par l'auteur. Réviser les trois ensemble lors de chaque changement de CV.

## Moteur de recherche conversationnelle

L'assistant fonctionne entièrement côté navigateur : aucun LLM, API distante ou historique serveur des questions. Les réponses sont prévalidées et recherchées par mots-clés, synonymes, labels et intention. Plusieurs formulations, relances cliquables et prise de rendez-vous améliorent l'interaction sans inventer de compétences.

Test de cohérence de l'index avec les labels du CV/portfolio :

```bash
python3 saas/portfolio/scripts/check-recruitment-index.py --report
```

Pour enregistrer la liste des labels observés après une mise à jour du CV HTML :

```bash
python3 saas/portfolio/scripts/check-recruitment-index.py --write
```

Test de syntaxe JavaScript :

```bash
node --check saas/portfolio/public/js/script.js
```

## Mise en ligne

La branche `master` comporte encore un ancien workflow de déploiement non sécurisé. **Ne pas fusionner ni relancer l'ancien workflow avant validation du déploiement contrôlé.** Prévisualiser d'abord la branche dans une image Docker isolée, vérifier le bouton IA, le bouton retour en haut, les liens PDF et les réponses FR/EN.

Ce composant ne modifie pas les services Registry, SecureVault ni leurs volumes.
