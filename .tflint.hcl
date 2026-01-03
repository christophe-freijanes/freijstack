# Configuration tflint - Terraform Linter
# Documentation: https://github.com/terraform-linters/tflint

# Configuration générale
config {
  # Mode de validation (activer toutes les validations)
  module = true
  force = false
  disabled_by_default = false

  # Ignorer certains modules (si nécessaire)
  # ignore_module = {
  #   "terraform-aws-modules/vpc/aws" = true
  # }
}

# Plugins (charger automatiquement les plugins)
plugin "aws" {
  enabled = true
  version = "0.30.0"
  source  = "github.com/terraform-linters/tflint-ruleset-aws"
}

plugin "azurerm" {
  enabled = true
  version = "0.25.0"
  source  = "github.com/terraform-linters/tflint-ruleset-azurerm"
}

plugin "google" {
  enabled = true
  version = "0.27.0"
  source  = "github.com/terraform-linters/tflint-ruleset-google"
}

# Règles générales
rule "terraform_deprecated_interpolation" {
  enabled = true
}

rule "terraform_deprecated_index" {
  enabled = true
}

rule "terraform_unused_declarations" {
  enabled = true
}

rule "terraform_comment_syntax" {
  enabled = true
}

rule "terraform_documented_outputs" {
  enabled = true
}

rule "terraform_documented_variables" {
  enabled = true
}

rule "terraform_typed_variables" {
  enabled = true
}

rule "terraform_module_pinned_source" {
  enabled = true
  style = "semver"
}

rule "terraform_naming_convention" {
  enabled = true

  # Conventions de nommage
  variable {
    format = "snake_case"
  }

  locals {
    format = "snake_case"
  }

  output {
    format = "snake_case"
  }

  resource {
    format = "snake_case"
  }

  module {
    format = "snake_case"
  }

  data {
    format = "snake_case"
  }
}

rule "terraform_required_version" {
  enabled = true
}

rule "terraform_required_providers" {
  enabled = true
}

rule "terraform_standard_module_structure" {
  enabled = true
}

rule "terraform_workspace_remote" {
  enabled = true
}

# Règles AWS spécifiques (si plugin AWS activé)
rule "aws_instance_invalid_type" {
  enabled = true
}

rule "aws_instance_previous_type" {
  enabled = true
}

rule "aws_s3_bucket_name" {
  enabled = true
}

rule "aws_db_instance_invalid_type" {
  enabled = true
}

rule "aws_elasticache_cluster_invalid_type" {
  enabled = true
}

rule "aws_iam_policy_document_gov_friendly_arns" {
  enabled = true
}

rule "aws_iam_policy_gov_friendly_arns" {
  enabled = true
}

rule "aws_iam_role_policy_gov_friendly_arns" {
  enabled = true
}

# Règles Azure spécifiques (si plugin Azure activé)
rule "azurerm_resource_missing_tags" {
  enabled = true
  tags = ["environment", "project"]
}

# Règles Google Cloud spécifiques (si plugin GCP activé)
rule "google_project_iam_binding_members" {
  enabled = true
}

rule "google_project_iam_member_member" {
  enabled = true
}
