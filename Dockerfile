FROM node:alpine as compile

LABEL maintainer="tq02ksu@gmail.com"
WORKDIR /app
COPY . ./
# RUN npm install express && npm run build
RUN npm install express --registry=https://registry.npm.taobao.org && npm run build

FROM nginx:stable-alpine

LABEL maintainer="tq02ksu@gmail.com"

COPY --from=compile build/ /usr/share/nginx/html/
