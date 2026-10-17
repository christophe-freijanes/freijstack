# Services applicatifs

Trois services sont regroupés dans ce répertoire.

| Service | Description | Détails |
| --- | --- | --- |
| Portfolio | Site statique FR/EN servi par nginx | [README](portfolio/README.md) |
| SecureVault | Application de gestion de secrets avec API et base de données | [README](securevault/README.md) |
| Registry | Registre privé d'images Docker avec interface web | [README](registry/README.md) |

Les services disposent de configurations Docker Compose distinctes. Le réseau partagé et le routage HTTP(S) sont définis dans l'infrastructure.

Les fichiers d'environnement réels, clés privées et données applicatives persistantes ne doivent pas être versionnés. Pour une intervention, vérifier d'abord le Compose effectivement utilisé sur le serveur.

[Infrastructure](../base-infra/README.md) · [Documentation](../docs/README.md) · [Sécurité](../SECURITY.md)
