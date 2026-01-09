
FROM nginx:1.27-alpine

# Copy nginx configuration
COPY public/config/nginx.conf /etc/nginx/conf.d/default.conf

# Copy only the public site files
COPY public/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
