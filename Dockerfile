FROM node:alpine as compile

LABEL maintainer="tq02ksu@gmail.com"
WORKDIR /app
COPY . ./
# RUN apk get python2 && npm install express --registry=https://registry.npm.taobao.org && npm run build
RUN apk get python2 && npm install express && npm run build

FROM nginx:stable-alpine

LABEL maintainer="tq02ksu@gmail.com"

COPY --from=compile build/ /usr/share/nginx/html/
