#!/usr/bin/env python3
"""Proposer une veille technique à partir de sources officielles."""
import html
import json
import sys
from datetime import UTC, datetime, timedelta
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen

from defusedxml import ElementTree

BASE = "https://portfolio.freijstack.com"
ROOT = Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "saas/portfolio/public"
STATE = ROOT / "saas/portfolio/editorial/veille.json"
OUTPUT = PUBLIC / "veille/index.html"
FEEDS = (
    ("AWS News", "https://aws.amazon.com/about-aws/whats-new/recent/feed/"),
    ("AWS Security", "https://aws.amazon.com/blogs/security/feed/"),
    ("CNCF", "https://www.cncf.io/feed/"),
    ("GitHub Blog", "https://github.blog/feed/"),
)
HOSTS = {"aws.amazon.com", "www.cncf.io", "cncf.io", "github.blog"}
TOPICS = {
    "AWS": ("aws", "amazon ec2", "systems manager", "cloudformation", "vpc", "s3", "iam", "kms", "finops"),
    "DevSecOps": ("devsecops", "security", "vulnerab", "cve-", "codeql", "supply chain", "secrets", "container"),
    "SRE": ("sre", "reliability", "observability", "opentelemetry", "prometheus", "monitoring", "incident"),
    "AIOps": ("agentic", "mcp", "agents", "bedrock", "llm", "aiops", "agentcore", "guardrails"),
}
QUESTIONS = {
    "AWS": "Vérifier la disponibilité au Canada, les permissions IAM, les coûts et les limites de service.",
    "DevSecOps": "Examiner les risques, la chaîne CI/CD, les correctifs disponibles et les contrôles de sécurité.",
    "SRE": "Évaluer les conséquences sur les SLO, les alertes, la résilience et l'observabilité.",
    "AIOps": "Vérifier les garde-fous, la supervision humaine, les accès read-only et l'évaluation des agents.",
}
ATOM = "{http://www.w3.org/2005/Atom}"


def trusted_url(url):
    parsed = urlsplit(url.strip())
    if parsed.scheme != "https" or parsed.hostname not in HOSTS or parsed.username or parsed.password:
        return ""
    return urlunsplit(("https", parsed.netloc, parsed.path or "/", "", ""))


def published_date(raw):
    try:
        try:
            date = parsedate_to_datetime(raw)
        except ValueError:
            date = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        if date.tzinfo is None:
            return None
        return date.astimezone(UTC)
    except (TypeError, ValueError, OverflowError):
        return None


def classify(title, summary):
    title = title.casefold()
    summary = summary.casefold()
    points = {
        category: sum(3 for word in words if word in title) + sum(1 for word in words if word in summary)
        for category, words in TOPICS.items()
    }
    topic = max(points, key=points.get)
    return topic if points[topic] >= 3 else None


def parse_items(xml, source, now):
    root = ElementTree.fromstring(xml)
    entries = root.findall(".//item")
    atom = False
    if not entries:
        entries = root.findall(f".//{ATOM}entry")
        atom = True
    results = []
    for entry in entries[:100]:
        title = entry.findtext(f"{ATOM}title" if atom else "title", default="").strip()
        link = entry.findtext("link", default="")
        if atom:
            link = next(
                (node.get("href", "") for node in entry.findall(f"{ATOM}link")
                 if node.get("rel", "alternate") == "alternate"),
                "",
            )
        summary = entry.findtext(f"{ATOM}summary" if atom else "description", default="")
        raw_date = (
            entry.findtext(f"{ATOM}published") or entry.findtext(f"{ATOM}updated")
            if atom else entry.findtext("pubDate")
        )
        date = published_date(raw_date)
        clean = trusted_url(link)
        if not title or not clean or not date or not now - timedelta(days=21) <= date <= now:
            continue
        category = classify(title, summary)
        if category:
            results.append({
                "title": title[:150],
                "url": clean,
                "date": date.date().isoformat(),
                "source": source,
                "category": category,
            })
    return results


def fetch(source, url, now):
    request = Request(url, headers={"User-Agent": "FreijStack-SEO-Veille/1.0"})
    with urlopen(request, timeout=15) as response:
        if urlsplit(response.geturl()).hostname not in HOSTS:
            raise ValueError("Redirection hors source officielle")
        xml = response.read(1_000_001)
        if len(xml) > 1_000_000:
            raise ValueError("Flux trop volumineux")
    return parse_items(xml, source, now)


def render(items):
    groups = []
    for topic, question in QUESTIONS.items():
        links = []
        for item in items:
            if item["category"] == topic:
                label = html.escape(item["title"], quote=True)
                url = html.escape(item["url"], quote=True)
                source = html.escape(item["source"], quote=True)
                links.append(
                    f'<li><a href="{url}" rel="noopener noreferrer">{label}</a>'
                    f' <small>— {source} · {item["date"]}</small></li>'
                )
        listing = "<ul>" + "\n".join(links) + "</ul>" if links else "<p>Aucune annonce retenue pour ce domaine.</p>"
        groups.append(f"<section><h2>{topic}</h2><p>{html.escape(question)}</p>{listing}</section>")
    body = "\n".join(groups)
    page_url = f"{BASE}/veille/index.html"
    return f"""<!doctype html>
<html lang="fr-CA">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Veille technique AWS, DevSecOps, SRE et AIOps | FreijStack</title>
  <meta name="description" content="Sélection de nouveautés techniques officielles : AWS, DevSecOps, SRE et AIOps, avec des points à vérifier avant adoption.">
  <link rel="canonical" href="{page_url}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Veille technique | FreijStack">
  <meta property="og:url" content="{page_url}">
  <style>
    body {{font:16px/1.6 system-ui,sans-serif;max-width:850px;margin:2rem auto;padding:0 1.25rem;color:#172236}}
    a {{color:#145caa}} section {{padding:1rem 0;border-top:1px solid #ccd5e0}}
    li {{margin:.8rem 0}} small {{color:#4e5969}} h1,h2 {{line-height:1.25}}
  </style>
</head>
<body>
  <nav><a href="/">← Portfolio de Christophe Freijanes</a></nav>
  <main>
    <h1>Veille technique : AWS, DevSecOps, SRE et AIOps</h1>
    <p>Une sélection ciblée d'annonces issues de sources officielles. Ce contenu de veille
    ne constitue pas un retour d'expérience ni une validation des fonctionnalités annoncées.</p>
    {body}
    <p><strong>Méthode :</strong> collecte et filtrage automatisés, publication après revue
    d'une pull request. Dates indiquées : dates des annonces originales.</p>
  </main>
</body>
</html>
"""


def update(now):
    state = json.loads(STATE.read_text(encoding="utf-8"))
    seen = set(state["seen"])
    candidates = {}
    successful = 0
    for source, url in FEEDS:
        try:
            for item in fetch(source, url, now):
                if item["url"] not in seen:
                    candidates[item["url"]] = item
            successful += 1
        except (OSError, ValueError, ElementTree.ParseError) as exc:
            sys.stderr.write(f"Flux indisponible ({source}) : {exc}\n")
    if not successful:
        raise RuntimeError("Aucune source officielle accessible")
    selected = []
    counts = {}
    for item in sorted(candidates.values(), key=lambda i: (i["date"], i["title"]), reverse=True):
        if counts.get(item["category"], 0) >= 2:
            continue
        selected.append(item)
        counts[item["category"]] = counts.get(item["category"], 0) + 1
        if len(selected) == 4:
            break
    if len(selected) < 2:
        sys.stdout.write("Aucune sélection nouvelle suffisante : pas de modification.\n")
        return
    merged = selected + [item for item in state["items"] if item["url"] not in {i["url"] for i in selected}]
    merged = sorted(merged, key=lambda i: (i["date"], i["title"]), reverse=True)[:12]
    state["seen"] = (state["seen"] + [i["url"] for i in selected])[-300:]
    state["items"] = merged
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUTPUT.write_text(render(merged), encoding="utf-8")
    sys.stdout.write(f"Veille : {len(selected)} annonces nouvelles proposées en revue.\n")


if __name__ == "__main__":
    update(datetime.now(UTC))
