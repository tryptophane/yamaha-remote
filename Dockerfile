FROM gmathieu/node-browsers:4.0.1 AS build

COPY package.json /usr/angular-workdir/
WORKDIR /usr/angular-workdir
RUN npm install

COPY ./ /usr/angular-workdir
RUN npm run build

FROM nginx:1.17.6-alpine

## Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY ./dev/nginx.conf /etc/nginx/nginx.conf

COPY --from=build  /usr/angular-workdir/dist /usr/share/nginx/html

RUN echo "envsubst '\$BACKEND_API_URL' < /etc/nginx/nginx.conf > nginx.tmp && \
          mv nginx.tmp  /etc/nginx/nginx.conf && nginx -g 'daemon off;'" > run.sh

ENTRYPOINT ["sh", "run.sh"]
