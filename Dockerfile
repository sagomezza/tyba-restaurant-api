FROM node:13.13
RUN mkdir -p /var/www/tyba
WORKDIR /var/www/tyba
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000 

CMD ["npm", "start"] 