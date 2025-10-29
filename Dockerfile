# Multi-stage build pour optimiser la taille de l'image finale
FROM node:18-alpine AS base

# Installation des dépendances système nécessaires pour Prisma et ffmpeg
RUN apk add --no-cache \
    openssl \
    ffmpeg \
    python3 \
    make \
    g++

WORKDIR /app

# Copie des fichiers de configuration des dépendances
COPY package*.json ./
COPY src/models/prisma/schema.prisma ./prisma/schema.prisma

# Installation des dépendances
RUN npm ci --only=production && npm cache clean --force

# Génération du client Prisma
RUN npx prisma generate

# Stage de production
FROM node:18-alpine AS production

# Installation des dépendances runtime nécessaires
RUN apk add --no-cache \
    openssl \
    ffmpeg \
    dumb-init \
    curl

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copie des dépendances installées depuis le stage base
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/prisma/schema.prisma ./prisma/schema.prisma

# Copie du code source
COPY --chown=nextjs:nodejs . .

# Création du répertoire uploads avec les bonnes permissions
RUN mkdir -p public/uploads && chown -R nextjs:nodejs public/uploads

# Passage à l'utilisateur non-root
USER nextjs

# Exposition du port
EXPOSE 5000

# Utilisation de dumb-init pour une gestion propre des signaux
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage avec migration automatique
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]