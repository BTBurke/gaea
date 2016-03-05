FROM ubuntu:14.04
MAINTAINER Bryan Burke <btburke@fastmail.com>

RUN apt-get update && apt-get upgrade -y
RUN wget https://github.com/mholt/caddy/releases/download/v0.8.2/caddy_linux_amd64.tar.gz
RUN tar -xvzf caddy_linux_amd64.tar.gz
RUN mv caddy /usr/local/bin

RUN mkdir -p /code
RUN mkdir -p /images
VOLUME /images

EXPOSE 80 443
COPY Caddyfile /code/
COPY dist/ /code/
WORKDIR /code

ENTRYPOINT ["caddy"]
