# saas/securevault/frontend/Dockerfile

FROM node:20-alpine AS build
WORKDIR /app

# Install deps (needs lockfile)
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm run build

# Runtime
FROM nginx:1.27-alpine AS runner
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
