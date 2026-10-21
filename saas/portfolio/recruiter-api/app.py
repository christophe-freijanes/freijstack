"""API publique de recrutement, sans accès à Hermes ni aux données privées."""
import json
import os
import re
import time
import unicodedata
from collections import defaultdict, deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

FACTS = {
    "certifications": ("ITIL figure dans le CV public. Pour les badges à jour, consultez le profil Credly indiqué sur le portfolio.", "ITIL appears in the public CV. Check the Credly profile linked from the portfolio for current badges."),
    "languages": ("Le CV public indique le français (langue maternelle) et l’anglais (niveau professionnel).", "The public CV lists native French and professional English."),
    "linux": ("Oui. Linux fait partie des compétences présentées dans le CV public. La date exacte de début n’est pas documentée.", "Yes. Linux is listed in the public CV; the exact start date is not documented."),
    "backup": ("Le CV public mentionne Commvault et Clumio pour la protection et la restauration des données.", "The public CV mentions Commvault and Clumio for data protection and recovery."),
    "cloud": ("Christophe travaille sur AWS, l’automatisation et la sécurité cloud. Le CV public ne précise pas depuis quelle année il pratique le cloud.", "Christophe works on AWS, automation and cloud security. His public CV does not establish a cloud start year."),
    "agents": ("Le portfolio présente des compétences en LLM, MCP et Amazon Bedrock. Les réalisations précises en IA agentique nécessitent des preuves de projet supplémentaires.", "The portfolio lists LLM, MCP and Amazon Bedrock skills. Specific agentic AI accomplishments require additional project evidence."),
    "team": ("Son parcours comprend des missions de conseil, la standardisation et la gouvernance des plateformes. Le détail de ses responsabilités d’équipe n’est pas entièrement public.", "His experience includes consulting, platform standardization and governance. Detailed team responsibilities are not fully public."),
    "achievements": ("Le CV public décrit des modules Terraform réutilisables, l’automatisation CI/CD et l’industrialisation d’infrastructures AWS.", "The public CV describes reusable Terraform modules, CI/CD automation and AWS infrastructure standardization."),
    "strengths": ("Ses réalisations illustrent l’automatisation, la standardisation et la gestion des risques. Ses points faibles personnels ne sont pas documentés.", "His work highlights automation, standardization and risk management. Personal weaknesses are not documented."),
    "unknown": ("Les sources publiques disponibles ne permettent pas de confirmer ce point. Le CV et un échange peuvent apporter davantage de précisions.", "The public sources do not establish this point. The CV and a direct conversation can provide more details."),
}
PATTERNS = (
    ("certifications", r"certif|credly|badges?"),
    ("languages", r"langue|language|anglais|english|francais|french"),
    ("linux", r"linux|rhel|red hat"),
    ("backup", r"sauvegard|backup|commvault|clumio|restore|recovery"),
    ("agents", r"agentique|agentic|mcp|bedrock"),
    ("team", r"travail en equipe|collaborat|teamwork|team work"),
    ("achievements", r"realisat|achievement|accomplishment"),
    ("strengths", r"points? (fort|faible)|strength|weakness"),
    ("cloud", r"cloud|aws"),
)
SOURCES = {
    "certifications": ["cv-public.txt"],
    "languages": ["cv-public.txt"],
    "linux": ["cv-public.txt"],
    "backup": ["cv-public.txt"],
    "cloud": ["cv-public.txt"],
    "agents": ["recruiter-knowledge-rag.txt"],
    "team": ["cv-public.txt"],
    "achievements": ["cv-public.txt"],
    "strengths": ["cv-public.txt"],
    "unknown": [],
}


def answer(question, language="fr"):
    if not isinstance(question, str) or not question.strip() or len(question) > 500:
        raise ValueError("invalid question")
    cleaned = "".join(ch for ch in unicodedata.normalize("NFD", question.lower()) if unicodedata.category(ch) != "Mn")
    topic = next((name for name, pattern in PATTERNS if re.search(pattern, cleaned)), "unknown")
    idx = 1 if language == "en" else 0
    return {"answer": FACTS[topic][idx], "sources": SOURCES[topic]}


class Handler(BaseHTTPRequestHandler):
    _requests = defaultdict(deque)

    def log_message(self, fmt, *args):
        # Aucune question ni donnée personnelle dans les journaux.
        pass

    def respond(self, status, body):
        raw = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        if self.path == "/health":
            return self.respond(200, {"status": "ok"})
        self.respond(404, {"error": "not found"})

    def do_POST(self):
        if self.path != "/api/chat":
            return self.respond(404, {"error": "not found"})
        # Le déploiement doit ajouter une limite de débit par IP au reverse proxy.
        if self.headers.get("Content-Type", "").split(";")[0].strip().lower() != "application/json":
            return self.respond(415, {"error": "json required"})
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            return self.respond(400, {"error": "invalid length"})
        if length < 2 or length > 2048:
            return self.respond(413, {"error": "invalid body size"})
        try:
            data = json.loads(self.rfile.read(length))
            if not isinstance(data, dict):
                raise ValueError("invalid payload")
            result = answer(data.get("question"), data.get("language", "fr"))
        except (ValueError, UnicodeDecodeError, json.JSONDecodeError):
            return self.respond(400, {"error": "invalid request"})
        self.respond(200, result)


if __name__ == "__main__":
    host = os.environ.get("RECRUITER_HOST", "127.0.0.1")
    port = int(os.environ.get("RECRUITER_PORT", "8091"))
    if host not in ("127.0.0.1", "::1"):
        raise SystemExit("Public binding forbidden; use an authenticated reverse proxy")
    ThreadingHTTPServer((host, port), Handler).serve_forever()
