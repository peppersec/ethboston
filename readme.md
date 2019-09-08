Run :
FLASK_APP=server.py flask run

Docker :
    
    Build container:
    
    docker build --rm -t rest-server:latest .
    
    Run container -d
    docker run --rm  -p 5000:5000 --name rest-server rest-server:latest
    
    Read logs from container
    docker logs rest-server