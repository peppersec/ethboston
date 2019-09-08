
from flask import Flask, jsonify, request, abort
from umbral import config, pre, keys, signing
from umbral.curve import SECP256K1
from flask_cors import CORS
import random
import json

config.set_default_curve(SECP256K1)

app = Flask(__name__)
CORS(app)

def getUmbralPublicFromHex(str):
    public_key_dirty = str 
    public_key_hex = "03" + public_key_dirty[-64:]
    public_key = keys.UmbralPublicKey.from_bytes(bytes.fromhex(public_key_hex))
    return public_key

def getUmbralPrivateFromHex(str):
    private_key_dirty = str 
    private_key_hex = public_key_dirty[-64:]
    private_key = keys.UmbralPrivateKey.from_bytes(bytes.fromhex(private_key_hex))
    return private_key

@app.route('/setup', methods=['POST'])
def setup_route():
    if not request.json :
        abort(400)

    # '0x16387146e0be3b7da18fc40e3c231c4d320d0e087c310ac49de1c178dde54398'
    alice_dirty_private_key = request.json['alices_private_key'] 
    alices_private_key_hex = alice_dirty_private_key[-64:]
    alices_private_key = keys.UmbralPrivateKey.from_bytes(bytes.fromhex(alices_private_key_hex))
    # bobs_private_key = keys.UmbralPrivateKey.gen_key()
    # "0xb6bb217955486f4cd9b2662fa909b0d4a207c8dae6f148be5e7ca94ed3fbdf0c"
    bobs_dirty_private_key = request.json['bobs_private_key']
    bobs_private_key_hex = bobs_dirty_private_key[-64:]
    bobs_private_key = keys.UmbralPrivateKey.from_bytes(bytes.fromhex(bobs_private_key_hex))

    # n = int(request.json['n'] || '3')
    n = int(request.json['n'])
    #m = int(request.json['m'] || '2')
    m = int(request.json['m'])

    alices_public_key, alices_signing_key, alices_verifying_key, bobs_public_key, kfrags = setup(alices_private_key, bobs_private_key, n, m)
    # print(result)

    serialized_kfrags = list()
    for kfrag in kfrags:
        serialized_kfrags.append(kfrag.to_bytes().hex())

    responce = json.dumps({
        "alices_public_key": alices_public_key.to_bytes().hex(), 
        "alices_signing_key": alices_signing_key.to_bytes().hex(),
        "alices_verifying_key": alices_verifying_key.to_bytes().hex(),
        "kfrags": serialized_kfrags
    })
    print(responce)

    return responce, 200


def setup(alices_private_key, bobs_private_key, n, m):
    #################
    # Generate Umbral keys for Alice.
    ################# []
    # alices_private_key = keys.UmbralPrivateKey.gen_key()
    alices_public_key = alices_private_key.get_pubkey()
    print("alices_private_key", alices_private_key)

    alices_signing_key = keys.UmbralPrivateKey.gen_key()
    alices_verifying_key = alices_signing_key.get_pubkey()
    # assert alices_public_key == alices_verifying_key # it souldn't
    alices_signer = signing.Signer(private_key=alices_signing_key)

    # Generate Umbral keys for Bob.
    ################# []
    # bobs_private_key = keys.UmbralPrivateKey.gen_key()
    bobs_public_key = bobs_private_key.get_pubkey()
    print("bobs_public_key", bobs_public_key)


    # Alice generates "M of N" re-encryption key fragments (or "KFrags") for Bob.
    # In this example, 10 out of 20.
    kfrags = pre.generate_kfrags(delegating_privkey=alices_private_key,
                                 signer=alices_signer,
                                 receiving_pubkey=bobs_public_key,
                                 threshold=m,
                                 N=n)

    return alices_public_key, alices_signing_key, alices_verifying_key, bobs_public_key, kfrags


@app.route('/en', methods=['POST'])
def en_route():
    if not request.json :
        abort(400)
    alices_public_key_dirty = request.json['alices_public_key']
    alices_public_key_hex = "03" + alices_public_key_dirty[-64:]
    alices_public_key = keys.UmbralPublicKey.from_bytes(bytes.fromhex(alices_public_key_hex))

    plaintext =  request.json['plaintext']
    ciphertext, capsule = en(alices_public_key, plaintext)
    print (ciphertext)
    return json.dumps({
        "ciphertext":ciphertext, 
        "ciphertext": capsule.to_bytes().hex()
        }), 200

def en(alices_public_key, plaintext):
    ################# ENCRYPT
    # Encrypt data with Alice's public key.
    ################# []
    # plaintext = b'Proxy Re-Encryption is cool!'
    ciphertext, capsule = pre.encrypt(alices_public_key, str.encode(plaintext))
    return ciphertext, capsule


@app.route('/de', methods=['POST'])
def de_route():
    if not request.json:
        abort(400)
    capsule_raw = request.json['capsule']
    capsule = Capsule.from_bytes(bytes.fromHex(capsule_raw))

    alices_public_key = getUmbralPublicFromHex(request.json['alices_public_key'])
    alices_verifying_key = getUmbralPublicFromHex(request.json['alices_verifying_key']) # ? maybe without 03
    ciphertext = request.json['ciphertext']
    bobs_private_key = getUmbralPrivateFromHex(request.json['bobs_private_key'])
    # kfrags
    serialized_kfrags = request.json['kfrags']
    kfrags = []
    for skfrag in serialized_kfrags:
        kfrags.append(KFrag.from_bytes(bytes.fromHex(skfrag)))

    de(capsule, alices_public_key, alices_verifying_key, ciphertext, bobs_private_key, kfrags)

    return "", 200

def de(capsule, alices_public_key, alices_verifying_key, ciphertext, bobs_private_key, kfrags):
    bobs_public_key = bobs_private_key.get_pubkey()
    # Several Ursulas perform re-encryption, and Bob collects the resulting `cfrags`.
    # He must gather at least `threshold` `cfrags` in order to activate the capsule.

    capsule.set_correctness_keys(delegating=alices_public_key,
                                 receiving=bobs_public_key,
                                 verifying=alices_verifying_key)

    cfrags = list()           # Bob's cfrag collection
    for kfrag in kfrags:
      cfrag = pre.reencrypt(kfrag=kfrag, capsule=capsule)
      cfrags.append(cfrag)    # Bob collects a cfrag

    for cfrag in cfrags:
      capsule.attach_cfrag(cfrag)

    bob_cleartext = pre.decrypt(ciphertext=ciphertext,
                                capsule=capsule,
                                decrypting_key=bobs_private_key)

    return bob_cleartext
   


@app.route('/demo2', methods=['POST'])
def demo2():
    print("demo2!")
    #################
    # Generate Umbral keys for Alice.
    ################# []
    # alices_private_key = keys.UmbralPrivateKey.gen_key()
    alice_dirty_private_key = '0x16387146e0be3b7da18fc40e3c231c4d320d0e087c310ac49de1c178dde54398'
    alices_private_key_hex = alice_dirty_private_key[-64:]
    alices_private_key = keys.UmbralPrivateKey.from_bytes(bytes.fromhex(alices_private_key_hex))
    # bobs_private_key = keys.UmbralPrivateKey.gen_key()
    bobs_dirty_private_key = "0xb6bb217955486f4cd9b2662fa909b0d4a207c8dae6f148be5e7ca94ed3fbdf0c"
    bobs_private_key_hex = bobs_dirty_private_key[-64:]
    bobs_private_key = keys.UmbralPrivateKey.from_bytes(bytes.fromhex(bobs_private_key_hex))
    n = 3
    m = 2
    alices_public_key, alices_signing_key, alices_verifying_key, bobs_public_key, kfrags = setup(alices_private_key, bobs_private_key, n, m)


    ################# ENCRYPT
    # Encrypt data with Alice's public key.
    ################# []
    plaintext = b'Proxy Re-Encryption is cool!'
    ciphertext, capsule = en(alices_public_key, plaintext)


    # Decrypt data with Alice's private key.
    cleartext = pre.decrypt(ciphertext=ciphertext,
                            capsule=capsule,
                            decrypting_key=alices_private_key)

    try:
        bob_cleartext = de(capsule, alices_public_key, alices_verifying_key, ciphertext, bobs_private_key, kfrags[:m])
    except:
        return "can't decrypt", 400

    assert bob_cleartext == plaintext

    return 'demo2', 200



@app.route('/demo', methods=['POST'])
def demo():
    print("demo!")
    #################
    # Generate Umbral keys for Alice.
    ################# []
    alices_private_key = keys.UmbralPrivateKey.gen_key()
    alices_public_key = alices_private_key.get_pubkey()
    print("alices_private_key", alices_private_key)

    alices_signing_key = keys.UmbralPrivateKey.gen_key()
    alices_verifying_key = alices_signing_key.get_pubkey()
    alices_signer = signing.Signer(private_key=alices_signing_key)

    # Generate Umbral keys for Bob.
    ################# []
    bobs_private_key = keys.UmbralPrivateKey.gen_key()
    bobs_public_key = bobs_private_key.get_pubkey()
    print("bobs_public_key", bobs_public_key)

    ################# [][]
    n = 3
    m = 2

    # Alice generates "M of N" re-encryption key fragments (or "KFrags") for Bob.
    # In this example, 10 out of 20.
    kfrags = pre.generate_kfrags(delegating_privkey=alices_private_key,
                                 signer=alices_signer,
                                 receiving_pubkey=bobs_public_key,
                                 threshold=m,
                                 N=n)

    ################# ENCRYPT
    # Encrypt data with Alice's public key.
    ################# []
    plaintext = b'Proxy Re-Encryption is cool!'
    ciphertext, capsule = pre.encrypt(alices_public_key, plaintext)



    # Decrypt data with Alice's private key.
    cleartext = pre.decrypt(ciphertext=ciphertext,
                            capsule=capsule,
                            decrypting_key=alices_private_key)


    # Several Ursulas perform re-encryption, and Bob collects the resulting `cfrags`.
    # He must gather at least `threshold` `cfrags` in order to activate the capsule.

    capsule.set_correctness_keys(delegating=alices_public_key,
                                 receiving=bobs_public_key,
                                 verifying=alices_verifying_key)

    cfrags = list()           # Bob's cfrag collection
    for kfrag in kfrags[:2]:
      cfrag = pre.reencrypt(kfrag=kfrag, capsule=capsule)
      cfrags.append(cfrag)    # Bob collects a cfrag


    # Bob activates and opens the capsule
    for cfrag in cfrags:
      capsule.attach_cfrag(cfrag)

    bob_cleartext = pre.decrypt(ciphertext=ciphertext,
                                capsule=capsule,
                                decrypting_key=bobs_private_key)
    assert bob_cleartext == plaintext



    return 'demo', 200

@app.route('/encrypt', methods=['POST'])
def encrypt():
    if not request.json :
        abort(400)
    
    bob_public_key = request.json['recipient']
    pop_correct_public_key_hex = "03" + bob_public_key[-64:]
    print(pop_correct_public_key_hex)
    signedtext = request.json['data']

    alices_signing_key = keys.UmbralPrivateKey.gen_key()
    alices_verifying_key = alices_signing_key.get_pubkey()
    alices_signer = signing.Signer(private_key=alices_signing_key)

    #signedText

    bob = keys.UmbralPublicKey.from_bytes(bytes.fromhex(pop_correct_public_key_hex))
    ciphertext, capsule = pre.encrypt(bob, str.encode(signedtext))
#grants access to Bob
    
    # kfrags = pre.generate_kfrags(delegating_privkey=alices_signing_key,
    # signer=alices_signer,
    # receiving_pubkey=bob,
    # threshold=10,
    # N=20)
#, "capsule":capsule
    return jsonify(ciphertext = ciphertext.hex(), capsule = capsule.to_bytes().hex()), 200

@app.route('/decrypt', methods=['POST'])
def decrypt():
    if not request.json :
        abort(400)

    bob_private_key = request.json['recipient']
    pop_correct_private_key_hex = bob_private_key[-64:]
    ciphertext = request.json['data']
    capsule = request.json['capsule']

    bobs = keys.UmbralPrivateKey.from_bytes(bytes.fromhex(pop_correct_private_key_hex))
    cleartext = pre.decrypt(ciphertext=bytes.fromhex(ciphertext),
        capsule=bytes.fromhex(capsule),
        decrypting_key=bobs)

    return jsonify(cleartext), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)