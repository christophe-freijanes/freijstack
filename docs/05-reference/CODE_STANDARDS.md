# Conventions de code — FreijStack

Ces règles s'appliquent aux contributions de la stack : scripts, IaC et workflows. Objectif : code lisible, changements limités et vérifications reproductibles.

## Principes

- **Une intention, un changement.** Corriger une ligne plutôt que réécrire un module.
- Privilégier les outils natifs, la configuration et les fonctions déjà présentes. Pas d'abstraction sans usage démontré.
- Noms explicites, commentaires courts, sans décoration ni promesse de résultat non testé.
- Une fonction = un rôle identifiable ; ajouter un commentaire d'une phrase uniquement si son intention n'est pas évidente.
- Les README restent **sous 200 lignes** et comportent, lorsque pertinent, un tableau de navigation.
- Conserver les comportements existants et les données ; tout changement mutatif exige une validation et un retour arrière.

## Scripts impératifs

Ordre attendu, adapté au langage :

1. **Titre et description courte** dans l'en-tête ; déclarations initiales requises (shebang, `param`, imports).
2. **Variables / constantes** : paramètres d'entrée, chemins et options.
3. **Fonctions** : noms orientés action, effets documentés, erreurs visibles.
4. **Appels / main** : point d'entrée identifiable, jamais d'effet de bord à l'import Python.

Exemple Bash :

```bash
#!/usr/bin/env bash
# Vérification d'un service
# Contrôle l'état sans modifier Docker.
set -euo pipefail

# 1. Variables
SERVICE="${1:-portfolio}"

# 2. Fonctions
# Afficher l'état du conteneur ciblé.
check_service() {
  docker inspect --format '{{.State.Status}}' "$SERVICE"
}

# 3. Point d'entrée
main() {
  check_service
}
main "$@"
```

Pour Python : imports, constantes, fonctions, puis `if __name__ == "__main__": main()`. Pour PowerShell : `[CmdletBinding()]` et `param()` **avant** les variables, puis fonctions et point d'entrée. Ne pas encapsuler artificiellement un script trivial.

**Contrôles** : ShellCheck et `bash -n`, Ruff, PSScriptAnalyzer, tests avec mocks et smoke tests non destructifs. Une correction ciblée ne justifie pas la réécriture d'une fonction complète.

## CloudFormation

Ordre recommandé : `AWSTemplateFormatVersion`, `Description`, `Metadata` (si utile), `Parameters`, `Mappings`, `Conditions`, `Resources`, `Outputs`.

- Identifier les paramètres et ressources ; commentaires uniquement pour un choix non évident.
- Préférer les fonctions natives CloudFormation : `Ref`, `Fn::Sub`, `Fn::If`, etc. Pas de Lambda pour un simple assemblage de valeurs.
- Valider avec `cfn-lint`, puis créer un change set non exécuté pour inspection si un compte sandbox est disponible.
- Aucun template CloudFormation n'est actuellement présent sur `develop` : ne pas créer de ressource pour satisfaire une convention.

## Terraform

Ordre par responsabilité : `terraform` et `required_providers`, `provider`, `variable`, `locals`, `data`, `resource` / `module`, `output`.

- Suivre les conventions `main.tf`, `variables.tf`, `outputs.tf` uniquement quand le module le justifie.
- Préférer des expressions `locals` aux scripts externes ; ne pas multiplier les modules pour quelques lignes.
- Valider avec `terraform fmt -check -recursive`, `terraform validate` après `init -backend=false` dans un environnement isolé ; plan sandbox **sans apply**.
- Aucun `.tf` n'est actuellement présent sur `develop`.

## GitHub Actions

Ordre logique : commentaire d'intention, `name`, déclencheurs `on`, `permissions`, `concurrency` si nécessaire, `jobs`, étapes.

- Nommer les jobs et étapes par leur action réelle, sans badges ni emojis décoratifs.
- Minimiser les permissions ; épingler les actions selon la politique du dépôt.
- Toute modification d'un nom de workflow doit mettre à jour ses dépendances `workflow_run.workflows`.
- Vérifier YAML, actionlint, secrets/références et conditions avant fusion.
- **Ne jamais** tester un workflow de production en modifiant des volumes ou en exécutant `docker compose down -v`.

## Validation avant livraison

| Domaine | Vérification |
| --- | --- |
| Bash | `bash -n`, `shellcheck` |
| Python | `ruff check`, `python -m compileall`, tests ciblés |
| PowerShell | `Invoke-ScriptAnalyzer`, analyse de syntaxe |
| CloudFormation | `cfn-lint`, change set sandbox non exécuté |
| Terraform | `terraform fmt -check`, `validate`, `plan` sandbox |
| Workflows | `yamllint`, `actionlint`, tests de déclencheurs |
| Documentation | `markdownlint-cli2`, contrôle README ≤ 200 lignes |
| Livraison | Diff réduit, smoke test, preuve et retour arrière |

Une vérification indisponible est notée **non exécutée**, jamais déclarée réussie.
