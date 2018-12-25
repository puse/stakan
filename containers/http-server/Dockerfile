FROM node:latest

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --production

# Run

COPY . .

# EXPOSE runtime
CMD ["npm", "start"]
