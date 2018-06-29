FROM node:8

WORKDIR /src
COPY ../../nodeApi/ src/
RUN npm install

EXPOSE 3001

CMD node bin/www
