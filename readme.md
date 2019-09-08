Run :
FLASK_APP=server.py flask run

Docker :
    
    Build container:
    
    docker build --rm -t rest-server:latest .
    
    Run container 
    docker run --rm -d -p 3000:3000 --name rest-server rest-server:latest
    
    Read logs from container
    docker logs rest-server