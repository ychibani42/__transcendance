FROM node:16-alpine

RUN apk add --update nodejs npm

WORKDIR /frontend

COPY nextjs .

RUN npm install

EXPOSE 3000

CMD npm run dev