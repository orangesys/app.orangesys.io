FROM node:latest

RUN git clone https://github.com/orangesys/orangesys.io.git /var/www \
    && cd /var/www \
    && npm install

EXPOSE 5000

WORKDIR /var/www
ENTRYPOINT ["npm", "start"]
