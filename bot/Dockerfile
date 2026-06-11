FROM node:22-alpine@sha256:8ea2348b068a9544dae7317b4f3aafcdc032df1647bb7d768a05a5cad1a7683f
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY index.js ./
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser --ingroup nodejs && \
    chown -R appuser:nodejs /app
USER appuser
CMD ["node", "index.js"]
