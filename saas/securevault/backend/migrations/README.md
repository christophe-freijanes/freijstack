# Migrations SecureVault

La persistance de SecureVault repose sur PostgreSQL. Toute évolution du schéma nécessite un script SQL versionné, un test sur une base non productive et un plan de retour arrière.

## État du répertoire

À la date de cette revue, **aucun fichier SQL de migration n'est présent dans ce répertoire sur `develop`**. Les noms `001_add_features.sql` et `002_pro_features.sql` mentionnés dans l'ancienne documentation n'ont pas été retrouvés ici.

Un exécuteur existe dans [`scripts/run-migrations.sh`](../../../../scripts/run-migrations.sh). Ne pas l'utiliser en production avant d'avoir confirmé les scripts SQL réellement disponibles et le répertoire source attendu.

## Avant toute migration

1. Identifier les versions de schéma et les scripts appliqués.
2. Tester la migration sur une copie de données sans secrets de production.
3. Vérifier les dépendances API et conserver une sauvegarde restaurable.
4. Documenter le contrôle post-migration et les conditions de restauration.

[SecureVault](../../README.md) · [Déploiement](../../../../docs/02-deployment/SECUREVAULT_DEPLOYMENT.md)
