# Portfolio container (secure baseline)
# - Nginx unprivileged (non-root)
# - Runs behind Traefik (TLS terminated at Traefik)
# - Serves static assets + SPA routing

FROM nginxinc/nginx-unprivileged:alpine

# Replace default server config
RUN rm -f /etc/nginx/conf.d/default.conf

# Use the same hardened config for dev/staging/prod
COPY nginx.conf.prod /etc/nginx/conf.d/default.conf

# Copy site
COPY . /usr/share/nginx/html

# Expose unprivileged port
EXPOSE 8080

# Healthcheck (wget is available on alpine)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
