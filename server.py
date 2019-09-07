
from flask import Flask, jsonify, request, abort
from umbral import config, pre
from umbral.curve import SECP256K1

config.set_default_curve(SECP256K1)

app = Flask(__name__)

@app.route('/encrypt', methods=['POST'])
def encrypt():
    if not request.json :
        abort(400)

    alice_public_key = request.json['sender']
    bob_public_key = request.json['recipient']
    signedtext = request.json['data']
    #signedText
    #0x1206df9aa1d4a0b924f01cc75aa4b2456c4490b77d72f955aa331a59ec8f5863024b94a686d1e4cdd5057f4d01eb6fa2431b5ad8a4041b7ab1f9f55b6f1cc6ac1b
    #encrypting
    print(alice_public_key)
    ciphertext, capsule = pre.encrypt(alice_public_key, plaintext)

    return jsonify(ciphertext), 200

@app.route('/encript', methods=['POST'])
def encript():
    if not request.json :
        abort(400)

    alice_public_key = request.json['sender']
    bob_public_key = request.json['recipient']
    data = request.json['data']

    return jsonify({'task': request.json['sender']}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)