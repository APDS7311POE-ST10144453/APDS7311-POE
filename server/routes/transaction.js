const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const User = require("../models/user");
const { encrypt, decrypt } = require("../helpers/encryption");
const user = require("../models/user");
const checkAuth = require("../check-auth")(); // Call the function to get the middleware
const crypto = require("crypto");
const hashHelper = require("../helpers/hashHelper");
const { transactionLimiter } = require("../middleware/rateLimiter");
const { body, validationResult } = require("express-validator");

const transactionValidation = [
  body('transferAmount')
    .isNumeric()
    .isFloat({ min: 0.01, max: 1000000 })
    .withMessage('Invalid transfer amount'),
  body('recipientAccountNumber')
    .isLength({ min: 10, max: 10 })
    .matches(/^\d{10}$/)
    .withMessage('Invalid account number format'),
  body('swiftCode')
    .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)
    .withMessage('Invalid SWIFT code format'),
  body('transactionDescription')
    .trim()
    .escape()
    .isLength({ max: 500 })
    .withMessage('Description too long'),
  body('recipientName')
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 })
    .withMessage('Invalid recipient name'),
  body('recipientBank')
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 })
    .withMessage('Invalid bank name')
];

router.post("/transact", [transactionLimiter, checkAuth, transactionValidation], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: errors.array() 
      });
    }
    // Get user ID from the JWT token
    const userID = req.user.userId;

    // Find the user to get their account number
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Getting transaction information from the body
    const {
      recipientName,
      recipientBank,
      recipientAccountNumber,
      transferAmount,
      currency,
      swiftCode,
      transactionDescription,
    } = req.body;

    // Store the encrypted account number directly
    const newTransaction = new Transaction({
      senderAccountNumber: user.accountNumber, // Store encrypted account number
      recipientName,
      recipientBank,
      recipientAccountNumber: encrypt(recipientAccountNumber),
      recipientLookupHash: hashHelper.createLookupHash(recipientAccountNumber.trim()), // Using plain account number
      senderLookupHash: hashHelper.createLookupHash(user.accountNumber.trim()), // Using plain account number
      transferAmount,
      currency,
      swiftCode,
      transactionDescription,
      transactionDate: new Date(),
      approvalStatus: "pending",
    });

    // Saving the transaction to the database
    console.log("Transaction:", newTransaction);
    await newTransaction.save();
    res.status(201).json({ message: "Transaction successfully recorded" });
  } catch (err) {
    console.error("Error during transaction:", err);
    res.status(400).json({ error: "Transaction failed: " + err.message });
  }
});

// Get the List of transactions for the user
// Use the URL: https://localhost:3000/api/transaction/getTransactions?id=addIdInPlaceOfThisText
router.get("/getTransactions", transactionLimiter, checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transactionList = await Transaction.find({
      senderAccountNumber: user.accountNumber,
      approvalStatus: { $in: ['pending', 'approved', 'denied'] }
    }).sort({ transactionDate: -1 });

    res.status(200).json({ transactionList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get the List of approved transactions (payments) for the authenticated user
router.get("/getPayments", transactionLimiter, checkAuth, async (req, res) => {
  try {
    const userID = req.user.userId;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find only completed transactions where the user's account number is the sender
    const transactions = await Transaction.find({
      senderAccountNumber: user.accountNumber,
      approvalStatus: "completed"
    }).sort({ transactionDate: -1 });

    res.status(200).json({ transactionList: transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approves a transaction
// Use the url: https://localhost:3000/api/transaction/approveTransaction?id=transactionIdPlaceholder
router.post("/approveTransaction", transactionLimiter, async (req, res) => {
  try {
    // Getting transactionid
    const transactionID = req.query.id;

    // Finding transaction
    const transaction = Transaction.findById(transactionID).then(
      (transaction) => {
        // Changing the approvalStatus to approved
        transaction.approvalStatus = "approved";

        // Save the updated transaction back to the database
        res.status(200).json({ message: "Transaction approved" });
        return transaction.save();
      }
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Denies a transaction
// Use the url: https://localhost:3000/api/transaction/denyTransaction?id=transactionIdPlaceholder
router.post("/denyTransaction", transactionLimiter, async (req, res) => {
  try {
    // Getting transactionid
    const transactionID = req.query.id;

    // Finding transaction
    const transaction = Transaction.findById(transactionID).then(
      (transaction) => {
        // Changing the approvalStatus to approved
        transaction.approvalStatus = "denied";

        // Save the updated transaction back to the database
        res.status(200).json({ message: "Transaction denied" });
        return transaction.save();
      }
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/transactFromReceipt", transactionLimiter, checkAuth, async (req, res) => {
  try {
    const userID = req.user.userId;
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const {
      recipientName,
      recipientBank,
      recipientAccountNumber,
      transferAmount,
      currency,
      swiftCode,
      transactionDescription,
    } = req.body;

    // Find recipient using the lookup hash from the original transaction
    const originalTransaction = await Transaction.findOne({
      recipientAccountNumber: recipientAccountNumber,
      approvalStatus: 'completed'
    });

    if (!originalTransaction) {
      return res.status(404).json({ error: "Original transaction not found" });
    }

    const newTransaction = new Transaction({
      senderAccountNumber: user.accountNumber,
      recipientName,
      recipientBank,
      recipientAccountNumber,
      recipientLookupHash: originalTransaction.recipientLookupHash,
      senderLookupHash: hashHelper.createLookupHash(user.accountNumber.trim()),
      transferAmount,
      currency,
      swiftCode,
      transactionDescription,
      transactionDate: new Date(),
      approvalStatus: "pending",
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaction successfully recorded" });
  } catch (err) {
    console.error("Error during transaction:", err);
    res.status(400).json({ error: "Transaction failed: " + err.message });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
