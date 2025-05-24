FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm && \
    pnpm --version

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Bundle app source
COPY . .

# Create logs and uploads directories
RUN mkdir -p logs uploads

# Set proper permissions
RUN chmod -R 755 logs uploads

# Expose the port the app runs on
EXPOSE 5001

# Set NODE_ENV to production
ENV NODE_ENV=production

# Run the app
CMD ["pnpm", "start"] 