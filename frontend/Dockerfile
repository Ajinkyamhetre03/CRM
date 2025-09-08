# --- Stage 1: Build ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Stage 2: Serve ---
# FROM node:18-alpine
# WORKDIR /app
# COPY --from=build /app/dist ./dist
# COPY package*.json ./
# RUN npm install --omit=dev
# EXPOSE 3005
# CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3005"]
