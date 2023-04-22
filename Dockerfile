# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies in the container
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port on which the app will listen
EXPOSE 3000

# Start the app when the container is run
CMD [ "npm", "start" ]
