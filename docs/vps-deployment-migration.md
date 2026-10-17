# Déploiements Freijstack — migration contrôlée

## État

Le compte `deploy` possède une clé SSH validée localement, mais aucun droit sudo ni Docker.
Le workflow existant exécute encore `git reset --hard`, `git clean -fd` et Docker directement.
**Ne pas relancer GitHub Actions. Cette PR ne déploie rien.**

## Vérifications avant activation

1. Installer `scripts/vps-deploy-preflight.py` sur le VPS sous un chemin root-owned, mode 0755.
2. Tester en lecture seule : `sudo python3 /usr/local/sbin/vps-deploy-preflight.py portfolio production --branch master`.
3. Préserver les modifications locales du Registry : `.htpasswd` et `docker-compose.prod.yml` ; ne pas les réinitialiser.
4. Isoler les configurations locales, secrets et volumes des checkouts Git.
5. Remplacer les appels SSH aux scripts arbitraires par une commande fixe, à paramètres validés.
6. N'ajouter une règle sudoers restreinte et le déploiement effectif qu'après revue des chemins, Docker Compose et accès au registre.
7. Vérifier que la clé **GitHub** correspond à la clé publique de `deploy` ; le test localhost ne le prouve pas.
8. Vérifier la présence des changements sur `master` avant déploiement production.

## Politique

Production = master ; staging = develop. Répertoires applicatifs fixes et liste d'applications autorisées.
Les fichiers de production modifiés provoquent un refus, jamais un `reset --hard` automatique.
Le compte `deploy` n'appartient ni à `docker` ni à `sudo`.
Le contrôle proposé ne réalise aucun fetch, checkout, build ou redémarrage.
