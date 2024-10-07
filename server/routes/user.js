// Import necessary modules
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const { encrypt, decrypt } = require("../helpers/encryption");
const checkAuth = require("../check-auth")();
const ExpressBrute = require("express-brute");

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

const passwordComplexityRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
const sqlInjectionRegex =
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|WHERE)\b|;|--)/i;

// Rate limiter middleware to limit repeated requests to public APIs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

// User registration route using bcrypt to hash the password
router.post(
  "/register",
  [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .matches(sqlInjectionRegex)
      .withMessage(
        "SQL Injection detected. Please do not use SELECT, INSERT, UPDATE, DELETE, DROP, ALTER, EXEC, UNION OR WHERE"
      )
      .trim()
      .escape(),
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must be between 3 and 50 characters")
      .matches(sqlInjectionRegex)
      .withMessage(
        "SQL Injection detected. Please do not use SELECT, INSERT, UPDATE, DELETE, DROP, ALTER, EXEC, UNION OR WHERE"
      )
      .trim()
      .escape(),
    body("idNumber")
      .isLength({ min: 13, max: 13 })
      .withMessage("ID number is required and is 10 digits")
      .matches(sqlInjectionRegex)
      .withMessage(
        "SQL Injection detected. Please do not use SELECT, INSERT, UPDATE, DELETE, DROP, ALTER, EXEC, UNION OR WHERE"
      )
      .trim()
      .escape(),
    body("accountNumber")
      .isLength({ min: 10, max: 10 })
      .withMessage("Account number is required")
      .matches(sqlInjectionRegex)
      .withMessage(
        "SQL Injection detected. Please do not use SELECT, INSERT, UPDATE, DELETE, DROP, ALTER, EXEC, UNION OR WHERE"
      )
      .trim()
      .escape(),
    body("password")
      .isLength({ min: 8, max: 64 })
      .withMessage("Password is required")
      .matches(passwordComplexityRegex)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .matches(sqlInjectionRegex)
      .withMessage(
        "SQL Injection detected. Please do not use SELECT, INSERT, UPDATE, DELETE, DROP, ALTER, EXEC, UNION OR WHERE"
      )
      .trim()
      .escape(),
  ],
  async (req, res) => {
    try {
      const { username, name, idNumber, accountNumber, password, role } =
        req.body;

      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      if (
        sqlInjectionRegex.test(username) ||
        sqlInjectionRegex.test(password) ||
        sqlInjectionRegex.test(idNumber) ||
        sqlInjectionRegex.test(accountNumber)
      ) {
        return res.status(400).json({ message: "Invalid input detected" });
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
        balance: 75363,
      });

      // Save the new user to the database
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// User login route using username, account number, and password to find the user
router.post(
  "/login",
  limiter, // Apply rate limiter middleware to this route
  [
    // Validate and sanitize input fields
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .trim()
      .escape(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .trim()
      .escape(),
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

      // Check if the user's balance is null and set it to 75363 if it is
      if (user.balance === null) {
        user.balance = 75363;
        await user.save();
      }

      // If the password matches, generate a JWT token
      const token = jwt.sign(
        { username: user.username, userId: user._id },
        process.env.JWT_SECRET, // Use environment variable for secret
        { expiresIn: "30m" }
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

// Get the Decrypted Account details for the user
// Use the url: https://localhost:3000/api/user/account?id=addIdInPlaceOfThisText
router.get("/account", checkAuth, async (req, res) => {
  try {
    // User ID
    const userID = req.query.id;

    // Finding user
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's account number
    res.status(200).json({
      username: user.username,
      name: user.name,
      idNumber: decrypt(user.idNumber),
      accountNumber: decrypt(user.accountNumber),
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Get the user's name based on the JWT token
router.get("/getUserName", checkAuth, async (req, res) => {
  try {
    // Extract the userId from the token (provided by checkAuth middleware)
    const userId = req.user.userId;

    // Find the user by ID in the database
    const user = await User.findById(userId);

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's name
    res.status(200).json({ name: user.name });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Get the user's name based on the JWT token
router.get("/getaccountNum", checkAuth, async (req, res) => {
  try {
    // Extract the userId from the token (provided by checkAuth middleware)
    const userId = req.user.userId;

    // Find the user by ID in the database
    const user = await User.findById(userId);

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const decryptedAccountNumber = decrypt(user.accountNumber);

    // Respond with the user's accountNumber
    res.status(200).json({ accountNumber: decryptedAccountNumber });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Get the user's name based on the JWT token
router.get("/getBalance", checkAuth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const balance = user.balance.toString();
    console.log("User balance:", balance);

    res.status(200).json({ balance: balance });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
