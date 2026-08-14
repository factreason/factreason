FROM node:22-slim

WORKDIR /app

COPY package.json index.js ./

RUN chmod +x index.js

CMD ["node", "index.js"]
