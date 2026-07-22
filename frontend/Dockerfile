FROM node:22-alpine

# Set working directory
WORKDIR /app

# Expose Next.js default port
EXPOSE 3000

CMD ["sh", "-c", "if [ ! -f package.json ]; then echo 'Next.js project not initialized. Waiting for initialization...'; tail -f /dev/null; else corepack enable && pnpm install && pnpm dev; fi"]
