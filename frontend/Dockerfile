FROM node:22-alpine

# Set working directory
WORKDIR /app

# Expose Next.js default port
EXPOSE 3000

# Start in development mode, or wait if project is not yet initialized
CMD ["sh", "-c", "if [ ! -f package.json ]; then echo 'Next.js project not initialized. Waiting for initialization...'; tail -f /dev/null; else npm install && npm run dev; fi"]
