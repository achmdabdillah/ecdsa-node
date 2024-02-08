const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "045fe31db32d1b80e65c71f952df2b2cc70e5d4494c872a9f82c4549466873c3e07b84a8e30413a9847bec442c22c55b851303ecce2db455300045f662830c8afd": 100, // mine , private key:  2e969437f3230e7323acf4047685991ddc3f99e531d0282c74a05399ea2ab3e4
  "04f0f8bd06ca3f5bb2f7b3031dfe1e3dd4ca4039c261df2e401e0a7de65ca81cc854754ce83f43ddd019bb8b3f72f088fd0fd90b793822ad5bffa1c50928821b62": 50, // ben's, private key:  c9d0d2582d84970302292353426325f12f960374dc7372723b2f44f7f9ad7747
  "04c48bf4f29b4b22ad4d394f54e2aae83f6a3f95bf49dc0975d557d526a0ab307ed61058417613e6f97b36d7ae60f3cd182c75086607204400fd32be761084bed4": 75, // al's , private key:  1b10e447b8ff990f9ec76cc160402af45c36950c45eef6c79cd1c477705f5346
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the public address from the signature
  const { data, messageHash, sign } = req.body;

  // retrieve signature and recovery bit
  const [signature, recoveryBit] = sign;
  // convert signature to Uint8Array
  const formattedSignature = Uint8Array.from(Object.values(signature));

  // recover public key
  const publicKey = toHex(
    await secp.recoverPublicKey(messageHash, formattedSignature, recoveryBit)
  );

  // verify transaction
  const verifyTx = secp.verify(formattedSignature, messageHash, publicKey);
  if (!verifyTx) {
    res.status(400).send({ message: "Invalid Transaction" });
  }

  let amount = data.amount;
  let sender = publicKey;
  let recipient = data.recipient;
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
