# API du bot Portfolio : standard library, aucun SDK tiers.
FROM python:3.13-alpine

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY chat-api/server.py /app/server.py
COPY public/data/recruitment-knowledge.json /app/data/recruitment-knowledge.json

RUN addgroup -S app && adduser -S -G app app
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8080/health', timeout=2)" || exit 1
CMD ["python", "-u", "server.py"]
