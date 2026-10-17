# Sécurité

## Périmètre

FreijStack comprend des configurations de déploiement, des applications et des workflows CI/CD. Cette documentation décrit les contrôles attendus ; elle ne constitue ni une attestation de conformité ni un audit de sécurité.

## Gestion des secrets

- Ne jamais versionner les fichiers `.env` réels, clés privées, jetons et mots de passe.
- Conserver les secrets dans les mécanismes prévus à cet effet et limiter leur exposition dans les logs.
- Utiliser des comptes à privilèges minimaux ; séparer l'accès GitHub Actions de l'administration système.
- En cas d'exposition, révoquer ou renouveler le secret et examiner les accès concernés.

## Changements en production

- Identifier le service Compose, les dépendances et les volumes persistants.
- Contrôler l'origine de l'image et son identifiant avant remplacement.
- Préserver les bases, certificats et données du Registry ; pas de suppression de volumes lors d'une mise à jour applicative.
- Valider localement, déployer le service ciblé, puis vérifier l'état HTTP et les logs.
- Préparer un retour arrière testé et documenter toute intervention manuelle.

Certains workflows de déploiement historiques sont encore en revue. Ne pas interpréter leur présence comme une chaîne CI/CD sécurisée et opérationnelle.

## Vérifications

Les définitions de lint, d'analyse statique et de scan de sécurité figurent dans [`.github/workflows/`](.github/workflows/). Leur exécution et leur succès doivent être confirmés pour chaque révision concernée.

## Signaler un problème

Ne pas publier d'identifiants ni de détails permettant une exploitation. Contacter le mainteneur via les coordonnées du [Portfolio](https://portfolio.freijstack.com/) pour convenir d'un canal privé de divulgation.
