# Portfolio

Site professionnel bilingue, responsive, servi par nginx. Le contenu web se trouve dans `public/`.

## Structure

| Chemin | Rôle |
| --- | --- |
| `public/index.html` | Page principale |
| `public/css/style.css` | Styles |
| `public/js/script.js` | Interactions et traductions |
| `public/pages/` | Pages annexes, dont le CV HTML |
| `public/cv/` | Documents CV téléchargeables |
| `public/config/nginx.conf` | Configuration nginx |
| `Dockerfile` | Construction de l'image statique |
| `docker-compose.prod.yml` | Définition du service de production |

## Tester localement

Depuis la racine du dépôt :

```bash
docker build -t freijstack/portfolio:test ./saas/portfolio
docker run --rm -p 127.0.0.1:8080:80 freijstack/portfolio:test
```

Accès : http://localhost:8080.

## Contrôles avant publication

1. Vérifier les liens, les traductions FR/EN et l'affichage mobile.
2. Tester les ressources servies par nginx, y compris les PDF et les fichiers JSON utilisés par les interactions.
3. Contrôler la configuration HTTP, la construction Docker et les erreurs navigateur.
4. Publier une image identifiable et conserver une version précédente pour le retour arrière.

Le déploiement de production ne doit pas être déclenché à partir d'une branche non validée. Les anciens workflows SSH sont en cours de revue ; leur présence ne constitue pas une garantie de mise en ligne.

[Application en ligne](https://portfolio.freijstack.com/) · [Workflows](../../.github/workflows/README.md)
