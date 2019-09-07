Run :
FLASK_APP=server.py flask run
    python3 ./server.py

Docker :
    
    Build container:
    
    docker build --rm -t rest-server:latest .
    
    Run container 
    docker run --rm -d -p 8081:8081 --name rest-server rest-server:latest
    
    Read logs from container
    docker logs rest-server