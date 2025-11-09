# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all backend files
COPY . .

# Download wait-for-it.sh inside container
RUN curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x wait-for-it.sh

# Expose backend port
EXPOSE 5000

# Start backend only after DB is ready
CMD ["./wait-for-it.sh", "db:3306", "--", "node", "server.js"]
