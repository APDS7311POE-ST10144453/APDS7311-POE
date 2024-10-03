const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const User = require("../models/user");
const { encrypt } = require("../helpers/encryption");
const user = require("../models/user");

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
      swiftCode,
      approvalStatus: "pending"
    });

    // Saving the transaction to the database
    await newTransaction.save();
    res.status(201).json({ message: "Transaction successfully recorded" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get the List of transactions for the user
// Use the url: https://localhost:3000/api/transaction/getTransactions?id=addIdInPlaceOfThisText
router.get("/getTransactions", async (req, res) => {
  try {
  // User ID
  const userID = req.query.id;

  // Finding user
  const user = await User.findById(userID);

  // Find all transactions with this account number as senderAccountNumber
  const transactions = await Transaction.find({ senderAccountNumber: user.accountNumber });
  
  res.status(200).json({ transactionList: transactions });
  
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get the List of approved transactions (payments) for the user
// Use the url: https://localhost:3000/api/transaction/getPayments?id=addidInPlaceOfThisText
router.get("/getPayments", async (req, res) => {
  try {
  // User ID
  const userID = req.query.id;

  // Finding user
  const user = await User.findById(userID);

  // Find all approved transactions with this account number as senderAccountNumber
  const transactions = await Transaction.find({ 
    senderAccountNumber: user.accountNumber,
    approvalStatus: "approved"
  });
  
  res.status(200).json({ transactionList: transactions });
  
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Approves a transaction
// Use the url: https://localhost:3000/api/transaction/approveTransaction?id=transactionIdPlaceholder
router.post("/approveTransaction", async (req, res) => {
  try {
    // Getting transactionid
    const transactionID = req.query.id;

    // Finding transaction
    const transaction = Transaction.findById(transactionID)
    .then(transaction => {

      // Changing the approvalStatus to approved
    transaction.approvalStatus = "approved";

    // Save the updated transaction back to the database
    res.status(200).json({ message: "Transaction approved" });
    return transaction.save();
    });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Denies a transaction
// Use the url: https://localhost:3000/api/transaction/denyTransaction?id=transactionIdPlaceholder
router.post("/denyTransaction", async (req, res) => {
  try {
    // Getting transactionid
    const transactionID = req.query.id;

    // Finding transaction
    const transaction = Transaction.findById(transactionID)
    .then(transaction => {

      // Changing the approvalStatus to approved
    transaction.approvalStatus = "denied";

    // Save the updated transaction back to the database
    res.status(200).json({ message: "Transaction denied" });
    return transaction.save();
    });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;