FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

FROM node:alpine AS production

WORKDIR /usr/src/app

EXPOSE 3004

ARG NODE_ENV=prodctuion

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/post/main" ]





