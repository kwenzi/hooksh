FROM node:7.5.0

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Install app dependencies
COPY . /usr/src/app/
RUN npm install
RUN npm run build

EXPOSE 3000

VOLUME /config

CMD [ "npm", "start", "/config/config.yaml" ]
