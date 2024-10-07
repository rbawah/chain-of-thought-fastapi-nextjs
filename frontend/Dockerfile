FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy only the package files to install dependencies
COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install

COPY . .

EXPOSE 3000

# run Next.js in development mode
CMD ["pnpm", "run", "dev"]
