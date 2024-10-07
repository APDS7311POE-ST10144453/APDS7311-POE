const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const User = require("../models/user");
const { encrypt, decrypt  } = require("../helpers/encryption");
const user = require("../models/user");
const checkAuth = require("../check-auth")(); // Call the function to get the middleware

router.post("/transact", async (req, res) => {
  try {
    // Getting transaction information from the body
    const { senderAccountNumber, recipientName, recipientBank, recipientAccountNumber, transferAmount, currency, swiftCode,transactionDescription, transactionDate } = req.body;

    // Creating a new transaction (dbschema)
    const newTransaction = new Transaction({
      senderAccountNumber,
      recipientName,
      recipientBank,
      recipientAccountNumber: encrypt(recipientAccountNumber),
      transferAmount,
      currency,
      swiftCode,
      transactionDescription,
      transactionDate,
      approvalStatus: "pending"
    });

    // Saving the transaction to the database
    console.log("Transaction:", newTransaction);
    await newTransaction.save();
    res.status(201).json({ message: "Transaction successfully recorded" });

  } catch (err) {
    console.error("Error during transaction:", err); // Log error for better visibility
    res.status(400).json({ error: "Transaction failed: " + err.message});
  }
});


// Get the List of transactions for the user
// Use the URL: https://localhost:3000/api/transaction/getTransactions?id=addIdInPlaceOfThisText
router.get("/getTransactions", checkAuth, async (req, res) => {
  try {
    // Extracting user ID from the authenticated request
    const userID = req.user.id;

    // Finding the user by ID
    const user = await User.findById(userID);


    const decryptedAccountNumber = decrypt(user.accountNumber);
    // Find all transactions where the user's account number is the senderAccountNumber
    const transactions = await Transaction.find({ senderAccountNumber: decryptedAccountNumber });

    // Respond with the list of transactions
    res.status(200).json({ transactionList: transactions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get the List of approved transactions (payments) for the authenticated user
router.get("/getPayments", checkAuth, async (req, res) => {
  try {
    // Get user ID from the JWT token (added via checkAuth middleware)
    const userID = req.user.userId;

    // Find user by ID
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all approved transactions where the user's account number is the sender
    const transactions = await Transaction.find({
      senderAccountNumber: user.accountNumber,
      approvalStatus: "approved"
    });

    // Respond with the list of approved transactions
    res.status(200).json({ transactionList: transactions });

  } catch (err) {
    res.status(500).json({ error: err.message });
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