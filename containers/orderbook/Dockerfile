FROM node:latest

RUN npm install pm2 -g

# Setup monorepo

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --production

# Run

COPY . .

CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
