# syntax=docker/dockerfile:1.7

FROM node:lts-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build


FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY ./dev/nginx.conf /etc/nginx/nginx.conf.template
COPY --from=build /app/dist/browser /usr/share/nginx/html

EXPOSE 80

CMD ["sh", "-c", "envsubst '$BACKEND_API_URL' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
