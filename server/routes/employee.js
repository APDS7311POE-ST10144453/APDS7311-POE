const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { encrypt, decrypt } = require("../helpers/encryption");
const Transaction = require("../models/transaction");
const checkAuth = require("../check-auth")();
const { loginLimiter, employeeActionLimiter } = require("../middleware/rateLimiter");


router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the employee by username and role
    const employee = await User.findOne({ 
      username: username,
      role: "employee"
    });

    if (!employee) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: employee.username, userId: employee._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: employee._id
    });

  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Get all pending transactions
router.get('/getPendingTransactions', employeeActionLimiter, checkAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      approvalStatus: { $in: ['pending', 'approved'] }
    }).sort({ transactionDate: -1 });;
    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Error in getPendingTransactions:", error);
    res.status(500).json({ message: error.message });
  }
});

// Verify a transaction
router.post('/verifyTransaction/:id', employeeActionLimiter, checkAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update status to verified
    transaction.approvalStatus = 'approved';
    await transaction.save();
    
    res.status(200).json({ message: 'Transaction verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit to SWIFT
router.post('/submitToSwift/:id', employeeActionLimiter, checkAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Find sender using encrypted account number
    const sender = await User.findOne({ accountNumber: transaction.senderAccountNumber });
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    // Find recipient using lookup hash
    const recipient = await User.findOne({ 
      accountLookupHash: transaction.recipientLookupHash 
    });
    
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found in our system' });
    }

    const transferAmount = parseFloat(transaction.transferAmount.toString());
    
    // Check if sender has sufficient balance
    if (sender.balance < transferAmount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Update balances
    sender.balance -= transferAmount;
    await sender.save();

    recipient.balance = parseFloat(recipient.balance.toString()) + transferAmount;
    await recipient.save();

    // Update transaction status
    transaction.approvalStatus = 'completed';
    await transaction.save();

    res.status(200).json({ message: 'Transaction processed successfully' });
  } catch (error) {
    console.error('SWIFT submission error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;