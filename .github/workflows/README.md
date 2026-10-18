# GitHub Actions

Les workflows présents dans ce répertoire couvrent qualité, sécurité, construction d'images, déploiement, supervision et maintenance.

| Domaine | Fichiers principaux |
| --- | --- |
| Qualité et sécurité | [Lint](01-quality-lint.yml), [CodeQL](01-security-codeql.yml), [socle sécurité](00-core-security-ci.yml) |
| Construction | [Portfolio](03-app-portfolio-build.yml), [SecureVault](03-app-securevault-build.yml) |
| Déploiement | [Socle historique](00-core-full-deploy.yml), [Portfolio](03-app-portfolio-deploy.yml), [SecureVault](03-app-securevault-deploy.yml), [Registry](03-app-registry-deploy.yml) |
| Santé et opérations | [Contrôle production](05-health-prod.yml), [backup](06-maint-backup.yml), [rotation des secrets](06-maint-rotate-secrets.yml) |
| Livraison et documentation | [Release](07-release-automation.yml), [documentation](08-support-docs-generate.yml), [vérification SSH](09-support-deploy-ssh-check.yml) |

## État opérationnel

Les workflows sont versionnés, mais cela ne garantit ni leur succès ni leur compatibilité avec les droits SSH actuels. Les procédures historiques peuvent notamment supposer un compte distant privilégié.

**Ne pas déclencher un déploiement de production sans avoir vérifié** le déclencheur, les permissions, les actions SSH, le service Compose concerné et la stratégie de retour arrière.

## Revue recommandée

1. Confirmer le contexte `push`, `workflow_run` ou `workflow_dispatch`.
2. Vérifier les secrets utilisés, les privilèges minimaux et les commandes exécutées sur le VPS.
3. Contrôler les dépendances avec Registry, SecureVault et les volumes persistants.
4. Valider l'image, les URL et les logs après déploiement.

Les fichiers YAML sont la source de vérité pour les déclencheurs et le comportement. [Politique de sécurité](../../SECURITY.md).
