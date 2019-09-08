FROM python:3

COPY ./ ./app
WORKDIR ./app

RUN pip3 install -r requirements.txt
EXPOSE 3000
CMD FLASK_APP=server.py flask run