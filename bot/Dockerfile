FROM node:22-alpine
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeapp

COPY package.json ./
RUN npm install --production

COPY --chown=nodeapp:nodejs index.js ./

USER nodeapp
CMD ["node", "index.js"]
