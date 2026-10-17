# Contribution

FreijStack est maintenu comme un projet d'infrastructure et d'applications conteneurisées.

## Principes

- Une modification ciblée par demande, avec un périmètre et un objectif explicites.
- Décrire les risques, les dépendances et les fichiers touchés.
- Commits en français, au format Conventional Commits (`fix:`, `feat:`, `docs:`, etc.).
- Ne jamais ajouter de secrets, de données de production ou de fichiers `.env` réels.
- Ajouter les vérifications utiles et conserver une procédure de retour arrière pour les changements d'exploitation.

## Revue

Créer une branche de travail depuis `develop` et ouvrir une pull request. Vérifier les différences, les résultats CI et les effets potentiels des workflows avant fusion.

Un changement dans `master` peut affecter les mécanismes historiques de production : ne pas l'utiliser comme simple branche de travail.

## Licence

Les contributions sont soumises aux dispositions applicables du fichier [LICENSE](LICENSE). Aucune cession de droits ou convention de contribution supplémentaire n'est présumée ici.
