// Dependencies for Node.js.
// In browsers, use a <script> tag instead.
if (typeof module !== "undefined") {
  // gotta use var here because const/let are block-scoped to the if statement.
  var xrpl = require('xrpl')
}

// Example credentials
const wallet = xrpl.Wallet.fromSeed("sn3nxiW7v8KXzPzAqzyHXbSSKNuN9")

// Connect -------------------------------------------------------------------
async function main() {
  console.log("Connecting to Testnet...")
  const api = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
  await api.connect()

  // Get credentials from the Testnet Faucet -----------------------------------
  console.log("Getting a wallet from the Testnet faucet...")
  const {wallet, balance} = await api.fundWallet()

  // Prepare transaction -------------------------------------------------------
  const prepared = await api.autofill({
    "TransactionType": "Payment",
    "Account": wallet.address,
    "Amount": xrpl.xrpToDrops("22"),
    "Destination": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"
  })
  const max_ledger = prepared.LastLedgerSequence
  console.log("Prepared transaction instructions:", prepared)
  console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
  console.log("Transaction expires after ledger:", max_ledger)

  // Sign prepared instructions ------------------------------------------------
  const signed = wallet.sign(prepared)
  console.log("Identifying hash:", signed.hash)
  console.log("Signed blob:", signed.tx_blob)

  // Submit signed blob --------------------------------------------------------
  const tx = await api.submitSignedReliable(signed.tx_blob)
  // This raises an exception if the transaction isn't confirmed.

  // Wait for validation -------------------------------------------------------
  // submitSignedReliable() handles this automatically, but it can take 4-7s.

  // Check transaction results -------------------------------------------------
  console.log("Transaction result:", tx.result.meta.TransactionResult)
  console.log("Balance changes:", JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))

  // End of main()
  api.disconnect()
}

main()
