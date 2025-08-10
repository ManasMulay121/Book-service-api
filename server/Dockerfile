FROM node:20-alpine
WORKDIR /server
COPY package*.json .         
RUN npm install
EXPOSE 8080
CMD [ "node","dist/index.js" ]