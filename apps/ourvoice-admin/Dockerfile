# Start with a node 18 image with package info
# Installs *all* npm packages and runs build script
FROM node:18.12.1-alpine as workspace
WORKDIR /workspace
RUN npm install -g pnpm
COPY ["../../package.json", "../../pnpm-lock.yaml", "./"]
RUN pnpm install

COPY . .

FROM workspace as build
WORKDIR /app
RUN pnpm --filter ourvoice-admin --prod deploy .
ENV NODE_ENV=production
RUN pnpm build

# # startup and copy the sources
FROM nginx:stable-alpine as production
WORKDIR /app
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf         
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]