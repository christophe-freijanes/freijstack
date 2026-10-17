# Pilote Portfolio — installation sans activation

Le script `scripts/vps-portfolio-launcher.py` est un prototype limité à Portfolio. Il utilise uniquement un Compose approuvé, copié sous `/etc/freijstack/portfolio/`, propriété root. L'option `--apply` effectue `pull` et `up -d --no-deps portfolio`; **ne pas l'utiliser avant validation de la chaîne complète et d'une fenêtre de déploiement**.

## Préparation VPS (sans déploiement)

```bash
sudo install -d -o root -g root -m 700 /etc/freijstack/portfolio
sudo install -o root -g root -m 600 \
  /srv/www/portfolio/saas/portfolio/docker-compose.prod.yml \
  /etc/freijstack/portfolio/docker-compose.prod.yml
sudo sha256sum /etc/freijstack/portfolio/docker-compose.prod.yml
```

La somme doit être `12bbcf20be21948374ec4cc1d372ab1ef198c44be681d7524037250c9e954ab1`.
Installer le script à `/usr/local/sbin/vps-portfolio-launcher.py` en root:root avec mode `700`, puis lancer sans option pour vérifier.

## Limitations bloquantes

- Aucune règle sudoers ni workflow de déploiement n'est ajoutée dans cette PR.
- L'image `latest` n'est pas liée cryptographiquement au SHA Git approuvé : migration vers un digest immuable requise avant déploiement CI.
- Le script vérifie l'identité initiale du conteneur, pas encore l'état complet du service après déploiement.
- Le projet Compose original était dans `/srv/www/portfolio/saas/portfolio` ; vérifier avec `docker compose config` que la copie hors dépôt conserve les réseaux et labels désirés.
- Ne pas réutiliser ce prototype pour Registry ou SecureVault, qui ont des secrets et volumes persistants.
