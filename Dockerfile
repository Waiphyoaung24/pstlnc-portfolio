FROM node:22-alpine AS build
WORKDIR /app
ARG SITE_PASSPHRASE
ENV SITE_PASSPHRASE=${SITE_PASSPHRASE}
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN test -n "$SITE_PASSPHRASE" || (echo "SITE_PASSPHRASE build arg is required" && exit 1)
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
ENV PORT=82
EXPOSE 82
CMD ["serve", "-s", "dist", "-l", "82"]
