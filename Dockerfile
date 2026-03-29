FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Railway: set VITE_API_BASE in service Variables (enable for build)
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE
ARG CACHEBUST=1
RUN echo "bust=$CACHEBUST" && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
ENV PORT=8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
