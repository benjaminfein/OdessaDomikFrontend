FROM node:22-alpine AS build

WORKDIR /app

COPY OD-frontend/package*.json ./

RUN npm install --legacy-peer-deps

COPY OD-frontend .

RUN npm run build

FROM nginx:alpine

# COPY ../nginx/nginx.conf /etc/nginx/conf.d/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]