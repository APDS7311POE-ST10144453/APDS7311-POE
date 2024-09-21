const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const { encrypt } = require("../helpers/encryption");

router.post("/transact", async (req, res) => {
  try {
    // Getting transaction information from the body
    const {senderAccountNumber, recipientName, recipientBank, recipientAccountNumber, transferAmount, currency, swiftCode} = req.body;

    // Creating a new transaction (dbschema)
    const newTransaction = new Transaction({
      senderAccountNumber,
      recipientName,
      recipientBank,
      recipientAccountNumber: encrypt(recipientAccountNumber),
      transferAmount,
      currency,
      swiftCode
    });

    // Saving the transaction to the database
    await newTransaction.save();
    res.status(201).json({ message: "Transaction successfully recorded" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;