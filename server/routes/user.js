// Import necessary modules
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const { encrypt, decrypt } = require("../helpers/encryption");
const checkAuth = require("../check-auth");
const brute = require("express-brute");
const ExpressBrute = require("express-brute");

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

// Rate limiter middleware to limit repeated requests to public APIs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

// User registration route using bcrypt to hash the password
router.post("/register", async (req, res) => {
  try {
    const { username, name, idNumber, accountNumber, password, role } =
      req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 10);

    //Encrypt the idNumber and accountNumber
    const encryptedIdNumber = encrypt(idNumber);
    const encryptedAccountNumber = encrypt(accountNumber);

    // Create a new user with the hashed password
    const newUser = new User({
      username,
      name,
      idNumber: encryptedIdNumber,
      accountNumber: encryptedAccountNumber,
      password: hash,
      role: role,
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User login route using username, account number, and password to find the user
router.post(
  "/login",
  limiter, // Apply rate limiter middleware to this route
  [
    // Validate and sanitize input fields
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("accountNumber")
      .isNumeric()
      .withMessage("Account number must be numeric"),
  ],
  bruteforce.prevent,
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password, accountNumber } = req.body;

      // Find the user by username and account number
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({
          message:
            "Error: Try using a different Username, Account number and Password",
        });
      }

      // Decrypt the account number
      const decryptedAccountNumber = decrypt(user.accountNumber);

      if (decryptedAccountNumber !== accountNumber) {
        return res.status(401).json({
          message:
            "Error: Try using a different Username, Account number and Password",
        });
      }

      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message:
            "Error: Try using a different Username, Account number and Password",
        });
      }

      // If the password matches, generate a JWT token
      const token = jwt.sign(
        { username: user.username, userId: user._id },
        process.env.JWT_SECRET, // Use environment variable for secret
        { expiresIn: "1h" }
      );

      // Send the JWT token and user information in the response
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: user._id,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error " + err.message });
    }
  }
);

// Get the Encrypted AccountNumber for a user
// Use the url: https://localhost:3000/api/user/accountNum?id=addIdInPlaceOfThisText
router.get("/accountNum", async (req, res) => {
  try {
    // User ID
    const userID = req.query.id;

    // Finding user
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's account number
    res.status(200).json({ accountNumber: user.accountNumber });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
