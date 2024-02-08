const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

function generateKeys() {
  // public and private key object
  keys = {};

  for (let i = 0; i < 3; i++) {
    const privateKey = toHex(secp.utils.randomPrivateKey());
    const publicKey = toHex(secp.getPublicKey(privateKey));
    const address = publicKey.slice(-20);
    keys["key" + i] = [privateKey, publicKey, address];
  }
  return keys;
}
console.log(generateKeys());
/* 
{
  key0: [
    '2e969437f3230e7323acf4047685991ddc3f99e531d0282c74a05399ea2ab3e4',
    '045fe31db32d1b80e65c71f952df2b2cc70e5d4494c872a9f82c4549466873c3e07b84a8e30413a9847bec442c22c55b851303ecce2db455300045f662830c8afd',
    '55300045f662830c8afd'
  ],
  key1: [
    'c9d0d2582d84970302292353426325f12f960374dc7372723b2f44f7f9ad7747',
    '04f0f8bd06ca3f5bb2f7b3031dfe1e3dd4ca4039c261df2e401e0a7de65ca81cc854754ce83f43ddd019bb8b3f72f088fd0fd90b793822ad5bffa1c50928821b62',
    'ad5bffa1c50928821b62'
  ],
  key2: [
    '1b10e447b8ff990f9ec76cc160402af45c36950c45eef6c79cd1c477705f5346',
    '04c48bf4f29b4b22ad4d394f54e2aae83f6a3f95bf49dc0975d557d526a0ab307ed61058417613e6f97b36d7ae60f3cd182c75086607204400fd32be761084bed4',
    '4400fd32be761084bed4'
  ]
}
  */
