FROM node as compile

ENV SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/
LABEL maintainer="tq02ksu@gmail.com"
WORKDIR /app
COPY . ./
# RUN apk get python2 && npm install express --registry=https://registry.npm.taobao.org && npm run build
RUN npm install --force --registry=https://registry.npm.taobao.org && npm run build

FROM nginx:stable-alpine

LABEL maintainer="tq02ksu@gmail.com"

COPY --from=compile /app/build/ /usr/share/nginx/html/
