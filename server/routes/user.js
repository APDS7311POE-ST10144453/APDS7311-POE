// Import necessary modules
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const { encrypt, decrypt } = require("../helpers/encryption");
const { hashPassword, verifyPassword } = require("../helpers/passwordHelper");
const checkAuth = require("../check-auth")();
const hashHelper = require("../helpers/hashHelper");

//Migrated from ExpressBrute to rate-limit-mongo because of unfixable critical vulnerabilities
const { loginLimiter, employeeActionLimiter } = require("../middleware/rateLimiter");


const passwordComplexityRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
const sqlInjectionRegex =
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|WHERE)\b|;|--)/i;


// User registration route using bcrypt to hash the password
router.post(
  "/register",
  loginLimiter,
  [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .custom(value => {
        if (sqlInjectionRegex.test(value)) {
          throw new Error("SQL Injection detected. Please do not use SQL keywords");
        }
        return true;
      })
      .trim()
      .escape(),
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must be between 3 and 50 characters")
      .custom(value => {
        if (sqlInjectionRegex.test(value)) {
          throw new Error("Invalid input detected");
        }
        return true;
      })
      .trim()
      .escape(),
    body("idNumber")
      .isLength({ min: 13, max: 13 })
      .withMessage("ID number must be 13 digits")
      .custom(value => {
        if (sqlInjectionRegex.test(value)) {
          throw new Error("Invalid input detected");
        }
        return true;
      })
      .trim()
      .escape(),
    body("accountNumber")
      .isLength({ min: 10, max: 10 })
      .withMessage("Account number must be 10 digits")
      .custom(value => {
        if (sqlInjectionRegex.test(value)) {
          throw new Error("Invalid input detected");
        }
        return true;
      })
      .trim()
      .escape(),
    body("password")
      .isLength({ min: 8, max: 64 })
      .withMessage("Password must be between 8 and 64 characters")
      .matches(passwordComplexityRegex)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .custom(value => {
        if (sqlInjectionRegex.test(value)) {
          throw new Error("Invalid input detected");
        }
        return true;
      })
      .trim()
      .escape(),
  ],
  async (req, res) => {
    try {
      const { username, name, idNumber, accountNumber, password, role } =
        req.body;

      // Add detailed validation logging
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: errors.array() 
        });
      }

      // Check existing user
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        console.log("Username already exists:", username);
        return res.status(400).json({ message: "Username already exists" });
      }

      // SQL Injection check
      if (
        sqlInjectionRegex.test(username) ||
        sqlInjectionRegex.test(password) ||
        sqlInjectionRegex.test(idNumber) ||
        sqlInjectionRegex.test(accountNumber)
      ) {
        console.log("SQL Injection detected in input");
        return res.status(400).json({ message: "Invalid input detected" });
      }

      // Hash the password
      const { salt, hash } = await hashPassword(password);

      //Encrypt the idNumber and accountNumber
      const encryptedIdNumber = encrypt(idNumber);
      const encryptedAccountNumber = encrypt(accountNumber);

      // Create a new user with the hashed password
      const newUser = new User({
        username,
        name,
        idNumber: encryptedIdNumber,
        accountNumber: encryptedAccountNumber,
        accountLookupHash: hashHelper.createLookupHash(accountNumber.trim()),
        password: hash,
        passwordSalt: salt,
        role: role || "customer",
        balance: 75363,
      });

      // Save the new user to the database
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(400).json({ 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  }
);

// User login route using username, account number, and password to find the user
router.post(
  "/login",
  loginLimiter, // Apply rate limiter middleware to this route
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
      const isMatch = await verifyPassword(password, user.password, user.passwordSalt);

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
router.get("/getUserName", employeeActionLimiter, checkAuth, async (req, res) => {
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
router.get("/getaccountNum", employeeActionLimiter, checkAuth, async (req, res) => {
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
router.get("/getBalance", employeeActionLimiter, checkAuth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const balance = user.balance.toString();

    res.status(200).json({ balance: balance });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// Export the router to be used in other parts of the application
module.exports = router;
