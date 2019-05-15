# Dockerfile to run sarui and sar (CLI)
FROM node

RUN apt-get update && apt-get -y install vim && apt-get -y install python3

RUN mkdir -p /sar
COPY ./sar/sar.py /sar
COPY ./sar/CatC-partslist.json /sar

RUN mkdir -p /sarui
WORKDIR /sarui
RUN npm install -g express
COPY ./sarui /sarui
RUN npm install

EXPOSE 3000
ENTRYPOINT npm start
