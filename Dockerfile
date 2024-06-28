# Build Angular app
FROM node:latest AS build
WORKDIR /app
COPY . /app
RUN npm install -g @angular/cli@latest
RUN npm install 
RUN ng build --configuration production

# Setup nginx  
FROM nginx:latest
COPY --from=build /app/dist/simple-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf