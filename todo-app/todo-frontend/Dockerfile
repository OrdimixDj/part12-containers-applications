# The first FROM is now a stage called build-stage
FROM node:20 AS base-stage 
WORKDIR /usr/src/app
COPY . .
RUN npm ci

FROM base-stage AS test-stage
RUN npm test

FROM test-stage AS build-stage
ENV VITE_BACKEND_URL=http://localhost:3000
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html