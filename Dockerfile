# Image unique pour Cloud Run, Render, Railway ou tout hébergeur de conteneurs.
# Étape 1 : build (front Vite + serveur esbuild)
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : exécution, sans les dépendances de développement
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY agent ./agent
# Utilisateur non root
RUN mkdir -p output .data && chown -R node:node /app
USER node
# La plateforme fournit PORT ; 8080 par défaut (convention Cloud Run)
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/server.cjs"]
