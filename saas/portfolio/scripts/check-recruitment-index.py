#!/usr/bin/env python3
"""Vérifie les mots-clés du CV et du portfolio avant publication de l'index IA."""
import argparse
import json
import re
import unicodedata
from html.parser import HTMLParser
from pathlib import Path

PUBLIC = Path(__file__).resolve().parents[1] / "public"
INDEX = PUBLIC / "data" / "recruitment-knowledge.json"
CV = PUBLIC / "pages" / "resume.html"
PORTFOLIO = PUBLIC / "index.html"


class VisibleText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style") and self.skip:
            self.skip -= 1

    def handle_data(self, text):
        if not self.skip:
            self.parts.append(text)


def normalize(value):
    text = unicodedata.normalize("NFD", value.lower())
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9+]+", " ", text).strip()


def extract(path):
    parser = VisibleText()
    parser.feed(path.read_text(encoding="utf-8"))
    return normalize(" ".join(parser.parts))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--report", action="store_true", help="Afficher les mots-clés présents")
    parser.add_argument("--write", action="store_true", help="Ajouter les labels constatés")
    args = parser.parse_args()
    knowledge = json.loads(INDEX.read_text(encoding="utf-8"))
    cv, portfolio = extract(CV), extract(PORTFOLIO)
    errors = []
    for item in knowledge["items"]:
        if not (item.get("fr") and item.get("en") and item.get("tags")):
            errors.append(f"{item.get('id', 'sans id')}: réponse ou mots-clés manquants")
        found = [tag for tag in item["tags"] if normalize(tag) in cv or normalize(tag) in portfolio]
        if args.write:
            item["observed_labels"] = sorted(set(found), key=str.casefold)
        if args.report:
            print(f"{item['id']}: {len(found)} labels présents dans CV/portfolio")
        if not found:
            errors.append(f"{item['id']}: aucun label retrouvé dans le CV ou portfolio")
    if errors:
        raise SystemExit("\n".join(errors))
    if args.write:
        INDEX.write_text(json.dumps(knowledge, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"INDEX OK : {len(knowledge['items'])} domaines vérifiés contre CV ATS et portfolio")


if __name__ == "__main__":
    main()
