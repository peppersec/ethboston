FROM python:3

COPY ./ ./app
WORKDIR ./app

RUN pip3 install -r requirements.txt
EXPOSE 8081
CMD python3 ./rest-server.py