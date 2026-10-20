#!/usr/bin/env python3
"""Contrôler les URLs publiques du portfolio avant publication."""
import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from urllib.robotparser import RobotFileParser
from xml.etree import ElementTree

BASE = "https://portfolio.freijstack.com"
ROOT = Path(__file__).resolve().parents[2] / "saas/portfolio/public"
REQUIRED = {f"{BASE}/", f"{BASE}/pages/resume.html"}
NAMESPACE = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.og_urls = []
        self.noindex = False
        self.in_jsonld = False
        self.jsonld = []
        self.current_jsonld = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and "canonical" in attrs.get("rel", "").lower().split():
            self.canonicals.append(attrs.get("href", ""))
        if tag == "meta" and attrs.get("property", "").lower() == "og:url":
            self.og_urls.append(attrs.get("content", ""))
        if tag == "meta" and attrs.get("name", "").lower() in {"robots", "googlebot"}:
            self.noindex |= "noindex" in attrs.get("content", "").lower()
        if tag == "script" and attrs.get("type", "").lower() == "application/ld+json":
            self.in_jsonld = True
            self.current_jsonld = ""

    def handle_data(self, data):
        if self.in_jsonld:
            self.current_jsonld += data

    def handle_endtag(self, tag):
        if tag == "script" and self.in_jsonld:
            self.jsonld.append(json.loads(self.current_jsonld))
            self.in_jsonld = False


def check():
    errors = []

    def require(condition, message):
        if not condition:
            errors.append(message)

    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    parser = RobotFileParser()
    parser.parse(robots.splitlines())
    require(f"Sitemap: {BASE}/sitemap.xml" in robots, "Sitemap absent de robots.txt")
    for bot in ("Googlebot", "Bingbot", "OAI-SearchBot"):
        for path in ("/", "/index.html", "/pages/resume.html", "/css/style.css", "/js/script.js"):
            require(parser.can_fetch(bot, f"{BASE}{path}"), f"robots.txt bloque {bot}: {path}")

    tree = ElementTree.parse(ROOT / "sitemap.xml")
    urls = [node.text for node in tree.findall("s:url/s:loc", NAMESPACE)]
    require(len(urls) == len(set(urls)), "URL en double dans sitemap.xml")
    require(REQUIRED.issubset(urls), "Page d'accueil ou CV absente du sitemap")
    require(f"{BASE}/index.html" not in urls, "Index dupliqué (/index.html)")
    require(bool(urls), "Sitemap vide")

    for url in urls:
        parts = urlsplit(url or "")
        require(parts.scheme == "https" and parts.netloc == "portfolio.freijstack.com"
                and not parts.query and not parts.fragment, f"URL externe/invalide : {url}")
        if parts.scheme != "https" or parts.netloc != "portfolio.freijstack.com":
            continue
        path = parts.path or "/"
        file = ROOT / ("index.html" if path == "/" else path.lstrip("/"))
        require(file.is_file(), f"Page du sitemap absente : {url}")
        require(file.suffix == ".html", f"URL non HTML dans le sitemap : {url}")
        if not file.is_file() or file.suffix != ".html":
            continue

        metadata = Metadata()
        try:
            metadata.feed(file.read_text(encoding="utf-8"))
        except (ValueError, json.JSONDecodeError) as exc:
            errors.append(f"Métadonnées illisibles {url}: {exc}")
            continue
        require(metadata.canonicals == [url], f"URL canonique incorrecte : {url}: {metadata.canonicals}")
        require(metadata.og_urls == [url], f"og:url incohérent : {url}: {metadata.og_urls}")
        require(not metadata.noindex, f"Page marquée noindex : {url}")
        for block in metadata.jsonld:
            pages = block.get("@graph", []) if isinstance(block, dict) else []
            if isinstance(pages, dict):
                pages = [pages]
            for page in pages:
                if page.get("@type") == "WebPage":
                    require(page.get("url") == url, f"WebPage JSON-LD incohérent : {url}")
                    require(page.get("@id") == f"{url}#webpage", f"@id WebPage incohérent : {url}")

    if errors:
        print("SEO: ECHEC", file=sys.stderr)
        print("\n".join(f"- {error}" for error in errors), file=sys.stderr)
        raise SystemExit(1)
    print(f"SEO: OK ({len(urls)} pages canoniques, robots et sitemap valides)")


if __name__ == "__main__":
    check()
