# saas/securevault/frontend/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build-time API URL (React/Vite/CRA compatible patterns)
ARG REACT_APP_API_URL
ARG VITE_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.27-alpine AS runner

# SPA-friendly nginx (optional but recommended)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
