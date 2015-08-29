FROM nginx
MAINTAINER Bryan Burke <btburke@fastmail.com>

VOLUME /certs

COPY build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf 
