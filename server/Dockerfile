FROM node:20-alpine
WORKDIR /app
COPY package*.json .         
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 8080
CMD [ "node","/app/dist/index.js" ]