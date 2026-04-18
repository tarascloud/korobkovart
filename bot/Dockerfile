FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY index.js ./
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser --ingroup nodejs && \
    chown -R appuser:nodejs /app
USER appuser
CMD ["node", "index.js"]
