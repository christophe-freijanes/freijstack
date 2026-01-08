FROM nginx:1.27-alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all files from the portfolio directory to nginx html directory
COPY . /usr/share/nginx/html/

# Remove Docker-related files that were copied
RUN rm -f /usr/share/nginx/html/Dockerfile \
          /usr/share/nginx/html/docker-compose.yml \
          /usr/share/nginx/html/docker-compose.prod.yml \
          /usr/share/nginx/html/nginx.conf \
          /usr/share/nginx/html/.dockerignore \
          /usr/share/nginx/html/.gitignore \
          /usr/share/nginx/html/README.md

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
