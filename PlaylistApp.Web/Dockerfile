FROM node:24-alpine AS build
WORKDIR /app

COPY PlaylistApp.Web/package*.json ./
RUN npm ci

COPY PlaylistApp.Web/ ./
RUN npm run build

FROM nginx:alpine
COPY PlaylistApp.Web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]