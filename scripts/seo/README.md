# Veille technique automatisée

- **Fréquence** : chaque mardi à 13 h 17 UTC ; exécution manuelle possible.
- **Entrées** : flux officiels AWS What's New, AWS Security, CNCF et GitHub Blog.
- **Sélection** : 21 jours maximum, mots-clés métiers, 2 à 4 nouveautés, déduplication et liste des sources.
- **Sortie** : actualisation de \`saas/portfolio/public/veille/index.html\` via une **PR en brouillon** vers \`develop\`.
- **Aucune actualisation fictive** : pas de PR sans nouvelles sources pertinentes ; les dates affichées sont celles des sources.
- **Validation humaine** : vérifier les annonces et la pertinence avant de marquer la PR prête et de fusionner. Rien ne se publie directement en production.
- **Sécurité** : URLs HTTPS de domaines officiels uniquement, échappement HTML, limites de taille et de temps réseau, aucun LLM ni secret de production exposé.
- **Token** : priorité à \`SEO_PR_TOKEN\` (jeton dédié contents/pull requests), repli sur \`RELEASE_TOKEN\` existant, puis \`GITHUB_TOKEN\`. La création des PR par le jeton automatique dépend des permissions du dépôt.
- **Suite éditoriale** : un article d'analyse ou de retour d'expérience doit être rédigé et vérifié séparément ; cette veille ne se présente jamais comme une expérience de terrain.
