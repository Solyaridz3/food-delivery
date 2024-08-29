FROM node:20

COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install


COPY . .

EXPOSE 3000

CMD ["./wait-for-it.sh", "db:5432", "--", "npm", "start"]