FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

RUN chmod +x docker-entrypoint.sh || true

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]

