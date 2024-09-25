# Use an official Node.js runtime as a parent image
FROM node:lts-slim

# Create a working directory
WORKDIR /jcmc

# Copy the current directory contents into the container at /workspace
COPY . .

# Run npm install to install dependencies
RUN npm install

# Command to run the app
CMD ["npm", "start"]
