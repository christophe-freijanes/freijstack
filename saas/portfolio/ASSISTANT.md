# Assistant recrutement RAG — intégration front-end

Le portfolio est un conteneur nginx statique. Le navigateur ne possède **aucune clé LLM**.
La page envoie `POST /api/chat` avec `{"question":"..."}` et attend
`{"answer":"..."}`, uniquement lorsque le backend public est routé.
Une erreur, un timeout ou une réponse HTML entraîne un **secours local explicitement signalé**.

## Conditions avant fusion vers master

1. Le service public d'agent est distinct de Hermes privé et ne lit que le profil public autorisé.
2. La route HTTPS `/api/chat` est configurée vers un backend interne isolé, sans port public, avec limites de débit, budget et contrôles d'entrée.
3. Vérifier depuis un poste externe (GET `/api/chat` est interdit par l'API ; `GET /api/chat/health` renvoie la page HTML du site et ne prouve pas la santé du RAG) :

   ```bash
   curl -sS -o /dev/null -w '%{http_code} %{content_type}\n' https://portfolio.freijstack.com/api/chat  # 403 attendu
   curl -i -X POST https://portfolio.freijstack.com/api/chat \
     -H 'Content-Type: application/json' \
     --data '{"question":"Quelles sont les compétences AWS publiques de Christophe ?"}'
   ```

4. Confirmer que les réponses ont `Content-Type: application/json` et ne renvoient aucune information confidentielle.
5. Ne pas modifier ni exposer Hermes, Telegram ou SecureVault pour faire fonctionner le chatbot.

**Aucune route Traefik, configuration VPS ou backend LLM n'est créée par cette PR.**
L'intégration de l'API doit être testée sur le VPS avant la publication en production.

## Voix et sources

L'assistant présente **Christophe Freijanes à la troisième personne** en français et en anglais. Il n'usurpe pas son identité. Les questions libres comme les boutons thématiques interrogent la même API RAG `/api/chat`. Les sources affichées sont des libellés autorisés.

Une réponse qui prétend être Christophe est refusée côté navigateur, sans réécriture des faits, et remplacée par un secours local **explicitement signalé**.

La même règle doit être implémentée dans le prompt système et les tests du backend RAG du VPS ; cette PR ne modifie pas le serveur.
