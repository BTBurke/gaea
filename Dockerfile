FROM ubuntu:14.04
MAINTAINER Bryan Burke <btburke@fastmail.com>

RUN apt-get update && apt-get install -y nginx
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log
RUN rm -rf /etc/nginx/sites-enabled/default

EXPOSE 80 443

VOLUME /certs

COPY dist/ /usr/share/nginx/html/
COPY docker/nginx.conf /etc/nginx/nginx.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]
