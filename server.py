
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

    
    bob_public_key = request.json['recipient']
    signedtext = request.json['data']

    alices_signing_key = keys.UmbralPrivateKey.gen_key()
    alices_verifying_key = alices_signing_key.get_pubkey()
    alices_signer = signing.Signer(private_key=alices_signing_key)

    #signedText
    #0x1206df9aa1d4a0b924f01cc75aa4b2456c4490b77d72f955aa331a59ec8f5863024b94a686d1e4cdd5057f4d01eb6fa2431b5ad8a4041b7ab1f9f55b6f1cc6ac1b
    bob = keys.UmbralPublicKey.from_bytes(bytes.fromhex('03' + bob_public_key[:64]))
    ciphertext, capsule = pre.encrypt(alices_verifying_key, str.encode(signedtext))
#grants access to Bob
    
    kfrags = pre.generate_kfrags(delegating_privkey=alices_signing_key,
    signer=alices_signer,
    receiving_pubkey=bob,
    threshold=10,
    N=20)
#, "capsule":capsule
    return jsonify(ciphertext = ciphertext.hex(), capsule = capsule.to_bytes().hex()), 200

@app.route('/decrypt', methods=['POST'])
def decrypt():
    if not request.json :
        abort(400)

    bob_private_key = request.json['recipient']
    ciphertext = request.json['data']
    capsule = request.json['capsule']
    
    cleartext = pre.decrypt(ciphertext=ciphertext,
        capsule=capsule,
        decrypting_key=bob_private_key)

    return jsonify(cleartext), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)