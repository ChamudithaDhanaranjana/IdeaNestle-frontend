# Use an official Node.js runtime as a parent image
FROM node:16 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install project dependencies
RUN npm install

# Copy the entire Angular project to the container
COPY . .

# Build the Angular application
RUN ng build --configuration=production

# Use an official Nginx image as the final image
FROM nginx:alpine

# Copy the built Angular app from the previous stage to the Nginx directory
COPY --from=build /app/dist/idea-nestle-frontend /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
