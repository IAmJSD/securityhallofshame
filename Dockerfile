FROM node:10
WORKDIR /var/build
COPY . .
RUN npm i
RUN npm run build-frontend
CMD node .
