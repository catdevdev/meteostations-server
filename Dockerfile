FROM node:14-alpine

WORKDIR /workspace

COPY package.json yarn.lock /workspace/

RUN npm i

COPY . .

RUN npm run build

CMD ["npm", "start"]