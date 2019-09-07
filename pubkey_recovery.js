const secp256k1 = require('secp256k1')
const keccak256 = require('keccak256')

/**
 * ECDSA public key recovery from signature
 * @param {Buffer} msgHash
 * @param {Number} v
 * @param {Buffer} r
 * @param {Buffer} s
 * @return {Buffer} publicKey
 */
 function ecrecover (msgHash, v, r, s) {
  var signature = Buffer.concat([r, s], 64)
  var recovery = v - 27
  if (recovery !== 0 && recovery !== 1) {
    throw new Error('Invalid signature v value')
  }
  var senderPubKey = secp256k1.recover(msgHash, signature, recovery)
  return secp256k1.publicKeyConvert(senderPubKey, false).slice(1)
}

const privateKey = Buffer.from("d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3", "hex")
let msgHash = keccak256('hello')

var sig = secp256k1.sign(msgHash, privateKey)
var ret = {}
ret.r = sig.signature.slice(0, 32)
ret.s = sig.signature.slice(32, 64)
ret.v = sig.recovery + 27

console.log(ecrecover(msgHash, ret.v, ret.r, ret.s).toString("hex"));