
from flask import Flask, jsonify, request, abort
from umbral import config, pre, keys, signing
from umbral.curve import SECP256K1
import random

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
    alice = keys.UmbralPublicKey.from_hex(alice_public_key)
    bob = keys.UmbralPublicKey.from_hex(bob_public_key)
    ciphertext, capsule = pre.encrypt(alice, signedtext)

    #grants access to Bob
    
    kfrags = random.sample(kfrags, 10)      # M - Threshold
    capsule.set_correctness_keys(delegating=alice, receiving=bob, verifying=alice)
    cfrags = list()                 # Bob's cfrag collection
    for kfrag in kfrags:
        cfrag = pre.reencrypt(kfrag=kfrag, capsule=capsule)
        cfrags.append(cfrag)
    kfrags = random.sample(kfrags,10)

    return jsonify({"encrypted":ciphertext, "capsule":capsule}), 200

@app.route('/decrypt', methods=['POST'])
def decrypt():
    if not request.json :
        abort(400)

    bob_public_key = request.json['recipient']
    ciphertext = request.json['data']
    capsule = request.json['capsule']

    bob = keys.UmbralPublicKey.from_hex(bob_public_key)

    cleartext = pre.decrypt(ciphertext=ciphertext,
        capsule=capsule,
        decrypting_key=bob)

    return jsonify(cleartext), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)