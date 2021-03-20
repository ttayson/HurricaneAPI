FROM node:12

ADD . /app



RUN git clone https://github.com/ttayson/HurricaneAPI.git

WORKDIR HurricaneAPI



RUN npm i



CMD ["npm", "start"]


EXPOSE 3000
