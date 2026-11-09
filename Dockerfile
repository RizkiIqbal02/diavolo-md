
FROM node:24-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV TZ=Asia/Jakarta

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    ffmpeg \
    tesseract-ocr \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]
