#!/usr/bin/env python3
import json
import os
import subprocess
import tempfile
import urllib.request
from datetime import datetime
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo


STATE = Path("/opt/freijstack-monitor/state.json")
BASE = "https://portfolio.freijstack.com"
ZONE = ZoneInfo("America/Toronto")
ALERT_THRESHOLD = 3


ALLOWED_HOSTS = {
    "portfolio.freijstack.com",
    "vault.freijstack.com",
    "registry.freijstack.com",
    "api.telegram.org",
}


def open_https(request, timeout):
    url = request.full_url if isinstance(request, urllib.request.Request) else request
    parsed = urlsplit(url)

    if (
        parsed.scheme != "https"
        or parsed.hostname not in ALLOWED_HOSTS
        or parsed.port not in (None, 443)
        or parsed.username is not None
        or parsed.password is not None
    ):
        raise ValueError("URL HTTPS non autorisée")

    class SafeRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            target = urlsplit(newurl)
            if (
                target.scheme != "https"
                or target.hostname not in ALLOWED_HOSTS
                or target.port not in (None, 443)
                or target.username is not None
                or target.password is not None
            ):
                raise ValueError("Redirection HTTPS non autorisée")
            return super().redirect_request(
                req, fp, code, msg, headers, newurl,
            )

    opener = urllib.request.build_opener(
        urllib.request.HTTPSHandler(),
        SafeRedirect(),
    )
    return opener.open(request, timeout=timeout)


def http(path, expected, content_type=None):
    try:
        with open_https(BASE + path, timeout=10) as response:
            return (
                response.status == expected
                and (
                    content_type is None
                    or content_type in response.headers.get("Content-Type", "")
                )
            )
    except Exception:
        return False



def http_url(url, expected):
    try:
        with open_https(url, timeout=10) as response:
            return response.status in expected
    except urllib.error.HTTPError as error:
        return error.code in expected
    except Exception:
        return False


def chat_route():
    try:
        open_https(BASE + "/api/chat", timeout=10)
    except urllib.error.HTTPError as error:
        return error.code in (403, 405)
    except Exception:
        return False
    else:
        return False


def healthy(container):
    try:
        result = subprocess.run(
            ["docker", "inspect", "--format",
             "{{.State.Health.Status}}", container],
            check=False, capture_output=True, text=True, timeout=10,
        )
        return result.returncode == 0 and result.stdout.strip() == "healthy"
    except Exception:
        return False


def send(message):
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    chat = os.environ["TELEGRAM_CHAT_ID"]

    payload = json.dumps({
        "chat_id": chat,
        "text": message,
    }).encode()

    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with open_https(req, timeout=15) as response:
            success = json.load(response).get("ok")
    except Exception:
        raise RuntimeError("Échec de notification Telegram") from None

    if not success:
        raise RuntimeError("Échec de notification Telegram")


def main():
    checks = {
        "Portfolio": http("/", 200, "text/html"),
        "SecureVault": http_url(
            "https://vault.freijstack.com/api/health", (200,),
        ),
        "Registry": http_url(
            "https://registry.freijstack.com/v2/", (200, 401),
        ),
        "Chatbot RAG": (
            chat_route()
            and healthy("freijstack-chat-rag")
        ),
        "Umami": (
            http("/stats.js", 200, "javascript")
            and healthy("freijstack-analytics-umami-1")
            and healthy("freijstack-analytics-db-1")
        ),
    }

    if "--test" in os.sys.argv:
        for name, ok in checks.items():
            os.sys.stdout.write(f"{name}: {'OK' if ok else 'ÉCHEC'}\n")
        return

    state = json.loads(STATE.read_text()) if STATE.exists() else {}
    now = datetime.now(ZONE).strftime("%d/%m/%Y %H:%M")

    for name, ok in checks.items():
        item = state.get(name, {"failures": 0, "alerted": False})

        if ok:
            if item["alerted"]:
                send(f"FreijStack — RÉTABLI\n{name}\n{now}")
            item = {"failures": 0, "alerted": False}
        else:
            item["failures"] += 1
            if item["failures"] >= ALERT_THRESHOLD and not item["alerted"]:
                send(
                    f"FreijStack — ALERTE\n"
                    f"{name} indisponible\n"
                    f"3 contrôles échoués\n{now}",
                )
                item["alerted"] = True

        state[name] = item

    with tempfile.NamedTemporaryFile(
        mode="w", dir=STATE.parent, delete=False,
    ) as output:
        json.dump(state, output)
        temp = output.name

    Path(temp).replace(STATE)


if __name__ == "__main__":
    main()
