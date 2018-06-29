FROM node:0.10.38

RUN mkdir /src

RUN npm install express-generator -g

WORKDIR /src
ADD nodeApi/package.json /src/package.json
RUN npm install

EXPOSE 3001

CMD node nodeApi/bin/www
