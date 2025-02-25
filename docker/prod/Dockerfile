# Base image
FROM node:20-alpine AS builder

# Working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm package manager
RUN npm install -g pnpm@8.10.2

# Install dependencies
RUN pnpm install

# Working directory
WORKDIR /app

# Copy app files
COPY . .
COPY ./public ./public

# Build the app
RUN pnpm run build

# Start server
CMD ["npm", "run", "start"]