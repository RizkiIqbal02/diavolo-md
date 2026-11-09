FROM node:22-bookworm-slim

ENV NODE_ENV=production \
    TZ=Asia/Makassar \
    npm_config_update_notifier=false \
    npm_config_fund=false

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    ffmpeg \
    fontconfig \
    fonts-dejavu-core \
    tzdata \
    python3 \
    make \
    g++ \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY . .

RUN mkdir -p storage database temp tmp bin

EXPOSE 3600

CMD ["npm", "start"]
