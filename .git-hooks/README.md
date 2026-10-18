# Hooks Git

Ce dossier contient les scripts `pre-commit` et `install.sh`. Les hooks `commit-msg`, `pre-push` et `post-merge` mentionnés dans d'anciens guides ne sont pas présents ici.

## Installer le contrôle local

Depuis la racine du dépôt, sur un environnement de développement personnel :

```bash
git config core.hooksPath .git-hooks
chmod +x .git-hooks/pre-commit
```

Le hook `pre-commit` examine notamment les noms de fichiers sensibles et certains motifs dans les changements indexés. Il peut produire des faux positifs et **ne remplace pas** les scans de secrets et les contrôles CI.

Le script `install.sh` copie les hooks dans `.git/hooks/` ; choisir une seule méthode d'installation. Vérifier le contenu avant exécution et ne pas désactiver un contrôle pour contourner un signalement non compris.
