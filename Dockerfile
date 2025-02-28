# Use the official Node.js image as a base image
FROM node:14

# Set the working directory
WORKDIR /Text-to-Emoji-E-D

# Copy all project files
COPY . .

# Expose the port serve uses by default
EXPOSE 3000

# Command to run the static server
CMD ["npx", "serve", "-s", "-l", "3000"]
