# syntax=docker/dockerfile:1
# Portfolio container (static site) — hardened for Traefik
# - Nginx listens on 8080 (non-root)
# - TLS is terminated by Traefik (no certs inside this container)
# - Minimal attack surface + safe runtime dirs

FROM nginx:1.27-alpine

# Remove default site
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy reverse-proxy-friendly nginx config
COPY nginx.conf.prod /etc/nginx/conf.d/default.conf

# Copy static website content
COPY . /usr/share/nginx/html

# Optional: remove build/dev artifacts if present (non-fatal)
RUN rm -rf \
      /usr/share/nginx/html/.git \
      /usr/share/nginx/html/.github \
      /usr/share/nginx/html/node_modules \
      /usr/share/nginx/html/Dockerfile \
      /usr/share/nginx/html/docker-compose*.yml \
      /usr/share/nginx/html/nginx*.conf \
      /usr/share/nginx/html/README.md || true

RUN mkdir -p /var/cache/nginx /var/run /run && \
  chown -R nginx:nginx /var/cache/nginx /var/run /run /usr/share/nginx/html /etc/nginx/conf.d

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
