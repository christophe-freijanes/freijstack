#!/usr/bin/env python3
"""Résumer les alertes Code Scanning ouvertes sans divulguer les messages."""
import json
import sys
from collections import Counter
from pathlib import Path

SEVERITY_ORDER = {"critical": 0, "high": 1, "error": 2, "medium": 3,
                  "warning": 4, "low": 5, "note": 6, "unknown": 7}


def normalize(record):
    rule = record.get("rule") or {}
    inst = record.get("most_recent_instance") or {}
    location = inst.get("location") or {}
    severity = (rule.get("security_severity_level") or rule.get("severity")
                or "unknown").lower()
    return {
        "number": record.get("number"),
        "tool": (record.get("tool") or {}).get("name") or "inconnu",
        "severity": severity,
        "rule": rule.get("id") or "inconnue",
        "file": location.get("path") or "inconnu",
        "line": location.get("start_line"),
        "url": record.get("html_url") or "",
    }


def main(raw, destination):
    pages = json.loads(Path(raw).read_text(encoding="utf-8"))
    if not isinstance(pages, list) or any(not isinstance(p, list) for p in pages):
        raise ValueError("Format GitHub --slurp invalide")
    alerts = [normalize(record) for page in pages for record in page]
    alerts.sort(key=lambda a: (SEVERITY_ORDER.get(a["severity"], 8),
                               a["tool"], a["rule"], a["file"], a["number"] or 0))
    destination = Path(destination)
    destination.mkdir(parents=True, exist_ok=True)
    (destination / "code-scanning-open.json").write_text(
        json.dumps(alerts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    def table(title, labels, counter, limit=30):
        lines = [f"### {title}", "| " + " | ".join(labels) + " |",
                 "| " + " | ".join(["---"] * (len(labels) - 1) + ["---:"]) + " |"]
        for key, total in counter.most_common(limit):
            vals = key if isinstance(key, tuple) else (key,)
            safe = [str(value).replace("|", "\\|").replace(chr(96), "'").replace("\n", " ")
                    for value in vals]
            lines.append("| " + " | ".join([*safe, str(total)]) + " |")
        return "\n".join(lines)

    report = ["## FreijStack — Alertes Code Scanning ouvertes", "",
              f"**Total : {len(alerts)}**", "",
              "Ce rapport ne contient ni secrets détectés ni messages d'analyse bruts.", "",
              table("Outils", ["Outil", "Alertes"], Counter(a["tool"] for a in alerts)), "",
              table("Gravités", ["Gravité", "Alertes"], Counter(a["severity"] for a in alerts)), "",
              table("Règles prioritaires", ["Outil", "Gravité", "Règle", "Alertes"],
                    Counter((a["tool"], a["severity"], a["rule"]) for a in alerts)), "",
              table("Fichiers les plus touchés", ["Fichier", "Alertes"],
                    Counter(a["file"] for a in alerts)), "",
              "Les alertes ne sont pas automatiquement supprimées ou reclassées.", ""]
    text = "\n".join(report)
    (destination / "summary.md").write_text(text, encoding="utf-8")
    print(text)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Utilisation : code_scanning_report.py pages.json repertoire")
    main(sys.argv[1], sys.argv[2])
