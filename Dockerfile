FROM node:22-alpine AS build
WORKDIR /app
ENV SITE_PASSPHRASE=NOMOREMASTERS/NOMORESLAVES
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
ENV PORT=82
EXPOSE 82
CMD ["serve", "-s", "dist", "-l", "82"]
