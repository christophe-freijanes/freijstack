# API recruteur publique — version vérifiable

API HTTP Python sans dépendance tierce, liée à `127.0.0.1:8091` par défaut. Elle ne lit ni Hermes, ni Telegram, ni fichiers personnels. Aucune clé de modèle, aucune donnée privée.

## Exécution locale

```bash
python3 saas/portfolio/recruiter-api/app.py
curl -sS http://127.0.0.1:8091/health
curl -sS -X POST http://127.0.0.1:8091/api/chat -H 'Content-Type: application/json' \
  --data '{"question":"Certifications"}'
python3 -m unittest discover -s scripts/tests -p 'test_recruiter_api.py'
node --test scripts/tests/assistant.test.cjs
```

## Contrat

- `POST /api/chat` : `{"question":"...","language":"fr|en"}` ; résultat `{"answer":"...","sources":["cv-public.txt"]}`.
- `GET /health` : `{"status":"ok"}`, sans informations techniques.
- Entrée limitée à 500 caractères (2048 octets JSON), type JSON obligatoire, sortie limitée à des faits publics explicitement choisis.
- Les questions non documentées reçoivent une réponse d'incertitude, sans inventer de date, diplôme, employeur ni certification.
- Les intitulés des sources sont des noms autorisés et **ne constituent pas une validation documentaire automatique**. Vérifier les faits contre le CV approuvé avant publication.

## Mise en production : blocage obligatoire

Ne PAS exposer directement le port API. Vérifier d'abord la configuration effective nginx/Traefik sur le VPS puis router seulement `/api/chat` vers `127.0.0.1:8091`. Ajouter TLS, limite de débit par IP au proxy, limites de taille et supervision. Ce dépôt n'effectue pas ce routage ni le déploiement VPS.

Cette implémentation est un socle fiable **sans génération libre**. Elle n'est pas présentée comme un RAG/LLM complet : la génération contrôlée, le vrai retrieval, la preuve par passage et les contrôles anti-prompt-injection côté LLM restent à développer et à valider séparément. Le site continue à utiliser son API existante jusqu'au raccordement explicite.

Les tests Python et JavaScript doivent réussir avant fusion. Aucun accès aux systèmes privés n'est nécessaire ni autorisé.
