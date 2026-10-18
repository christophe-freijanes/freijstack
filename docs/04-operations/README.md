# Exploitation et diagnostic

- [Procédures de dépannage](TROUBLESHOOTING.md)
- [Erreurs de passerelle (504)](TROUBLESHOOTING_GATEWAY_TIMEOUT.md)
- [Déploiement et retour arrière](../02-deployment/README.md)

## Séquence de diagnostic

1. Identifier le service impacté et son état Docker.
2. Vérifier les routes HTTP(S), les logs récents et les dépendances.
3. Confirmer l'origine du problème avant de modifier la configuration.
4. Si une intervention est nécessaire, cibler un service et préserver ses données.
5. Vérifier le résultat et consigner le retour arrière possible.

Éviter les réinitialisations de checkout, suppressions de volumes ou redémarrages globaux sans inventaire préalable.
