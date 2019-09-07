from app import app
from flask import request

@app.route('/query-example')
def query_example():
    return 'Todo...'

@app.route('/form-example')
def formexample():
    return 'Todo...'

@app.route('/json-example')
def jsonexample():
    return 'Todo...'