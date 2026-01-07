# syntax=docker/dockerfile:1
# Portfolio container (static site) — hardened
# - Uses Nginx on 8080 and runs as non-root (nginx user)
# - Copies only required assets (reduces attack surface)

FROM nginx:1.27-alpine

# Remove default config and install our hardened config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy nginx configuration (prod and dev should be identical; keep one source of truth)
COPY nginx.conf.prod /etc/nginx/conf.d/default.conf

# Copy site files
COPY . /usr/share/nginx/html/

# Remove Docker/CI files that should never be served
RUN rm -f \
    /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/docker-compose.yml \
    /usr/share/nginx/html/docker-compose.prod.yml \
    /usr/share/nginx/html/docker-compose.staging.yml \
    /usr/share/nginx/html/nginx.conf \
    /usr/share/nginx/html/nginx.conf.prod \
    /usr/share/nginx/html/.dockerignore \
    /usr/share/nginx/html/.gitignore \
    /usr/share/nginx/html/README.md || true

# Prepare runtime dirs so we can drop root
RUN mkdir -p /var/cache/nginx /var/run && \
    chown -R nginx:nginx /var/cache/nginx /var/run /usr/share/nginx/html /etc/nginx/conf.d

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
