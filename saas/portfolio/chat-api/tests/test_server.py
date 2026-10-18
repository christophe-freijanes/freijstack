"""Tests hors réseau de l'API NVIDIA du Portfolio."""

import io
import json
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
os.environ["KNOWLEDGE_PATH"] = str(ROOT / "public/data/recruitment-knowledge.json")
sys.path.insert(0, str(ROOT / "chat-api"))
import server  # noqa: E402


class ChatTests(unittest.TestCase):
    """Contrôler les réponses sans appeler NVIDIA."""

    def test_theme_reconnu(self):
        item = server.topic_for("Parle-moi de Terraform et Ansible")
        self.assertEqual(item["id"], "automation")

    def test_sans_theme(self):
        self.assertIsNone(server.topic_for("Combien mesure la tour Eiffel ?"))

    def test_chiffre_non_justifie(self):
        self.assertFalse(server.grounded("J'ai 35 ans d'expérience.", "20 ans", "Ton expérience ?"))
        self.assertTrue(server.grounded("60 % de moins.", "60 % de moins", "Que s'est-il passé ?"))

    def test_generation_sans_reseau(self):
        payload = {
            "choices": [{"message": {"content": "J'utilise Terraform et Ansible pour automatiser AWS."}}]
        }
        with patch.object(server.request, "urlopen", return_value=io.BytesIO(
            json.dumps(payload).encode("utf-8")
        )) as call:
            with patch.object(server, "KEY", "cle-fictive-de-test"):
                answer = server.generate(
                    "Pourquoi automatiser avec Terraform ?", "fr",
                    server.topic_for("Terraform"),
                )
        self.assertIn("Terraform", answer)
        outbound = call.call_args.args[0]
        self.assertIn("Bearer cle-fictive-de-test", outbound.get_header("Authorization"))
        self.assertEqual(outbound.full_url, server.NVIDIA_URL)

    def test_fallback_reponse_inverifiable(self):
        payload = {"choices": [{"message": {"content": "J'ai 42 ans d'expérience."}}]}
        with patch.object(server.request, "urlopen", return_value=io.BytesIO(
            json.dumps(payload).encode("utf-8")
        )):
            self.assertIsNone(server.generate("Terraform ?", "fr", server.topic_for("Terraform")))

    def test_quota_global(self):
        with server.RATE_LOCK:
            server.GLOBAL.clear()
            server.PER_CLIENT.clear()
        for index in range(40):
            self.assertTrue(server.allowed(f"test-{index}"))
        self.assertFalse(server.allowed("test-extra"))
        with server.RATE_LOCK:
            server.GLOBAL.clear()
            server.PER_CLIENT.clear()


if __name__ == "__main__":
    unittest.main()
