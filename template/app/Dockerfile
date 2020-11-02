FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install --save

COPY .  .

EXPOSE 3000

ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /

RUN ["chmod", "+x", "/wait-for-it.sh"]

CMD [ "npm", "start" ]