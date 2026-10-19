#!/usr/bin/env python3
import json
import os
import subprocess
import tempfile
import urllib.request
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo

STATE = Path("/opt/freijstack-monitor/state.json")
BASE = "https://portfolio.freijstack.com"
ZONE = ZoneInfo("America/Toronto")


def http(path, expected, content_type=None):
    req = urllib.request.Request(BASE + path, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
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
    req = urllib.request.Request(url, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.status in expected
    except urllib.error.HTTPError as error:
        return error.code in expected
    except Exception:
        return False


def chat_route():
    try:
        urllib.request.urlopen(BASE + "/api/chat", timeout=10)
        return False
    except urllib.error.HTTPError as error:
        return error.code in (403, 405)
    except Exception:
        return False


def healthy(container):
    try:
        result = subprocess.run(
            ["docker", "inspect", "--format",
             "{{.State.Health.Status}}", container],
            capture_output=True, text=True, timeout=10
        )
        return result.returncode == 0 and result.stdout.strip() == "healthy"
    except Exception:
        return False


def send(message):
    token = os.environ["TELEGRAM_BOT_TOKEN"]
    chat = os.environ["TELEGRAM_CHAT_ID"]

    payload = json.dumps({
        "chat_id": chat,
        "text": message
    }).encode()

    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            if not json.load(response).get("ok"):
                raise RuntimeError()
    except Exception:
        raise RuntimeError("Échec de notification Telegram") from None


def main():
    checks = {
        "Portfolio": http("/", 200, "text/html"),
        "SecureVault": http_url(
            "https://vault.freijstack.com/api/health", (200,)
        ),
        "Registry": http_url(
            "https://registry.freijstack.com/v2/", (200, 401)
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
            print(f"{name}: {'OK' if ok else 'ÉCHEC'}")
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
            if item["failures"] >= 3 and not item["alerted"]:
                send(
                    f"FreijStack — ALERTE\n"
                    f"{name} indisponible\n"
                    f"3 contrôles échoués\n{now}"
                )
                item["alerted"] = True

        state[name] = item

    with tempfile.NamedTemporaryFile(
        mode="w", dir=STATE.parent, delete=False
    ) as output:
        json.dump(state, output)
        temp = output.name

    os.replace(temp, STATE)


if __name__ == "__main__":
    main()
