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
const { RateLimiterMemory } = require("rate-limiter-flexible");

// Rate limiter middleware to limit repeated requests to public APIs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

// Brute force protection using rate-limiter-flexible
const maxWrongAttemptsByIPPerDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

// Adjusted durations to fit within 32-bit signed integer limit
const oneDayInSeconds = 24 * 60 * 60; // 1 day in milliseconds
const oneHourInSeconds = 60 * 60; // 1 hour in milliseconds

const limiterSlowBruteByIP = new RateLimiterMemory({
  keyPrefix: "login_fail_ip_per_day",
  points: maxWrongAttemptsByIPPerDay,
  duration: oneDayInSeconds, // Store number for 1 day since first fail
  blockDuration: oneHourInSeconds, // Block for 1 hour if more than maxWrongAttemptsByIPPerDay points consumed
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMemory({
  keyPrefix: "login_fail_consecutive_username_and_ip",
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: oneDayInSeconds, // Store number for 1 day since first fail
  blockDuration: oneHourInSeconds, // Block for 1 hour if more than maxConsecutiveFailsByUsernameAndIP points consumed
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

const loginRoute = async (req, res) => {
  const { username, password, accountNumber } = req.body;
  const ipAddr = req.ip;

  const usernameIPkey = getUsernameIPkey(username, ipAddr);

  try {
    await limiterSlowBruteByIP.consume(ipAddr);
    await limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey);

    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("Invalid username or password");
    }

    const decryptedAccountNumber = decrypt(user.accountNumber);

    if (decryptedAccountNumber !== accountNumber) {
      throw new Error("Invalid username or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign(
      { username: user.username, userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      role: user.role,
      token,
    });

    await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
  } catch (rlRejected) {
    if (rlRejected instanceof Error) {
      res.status(401).json({ message: rlRejected.message });
    } else {
      res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }
  }
};

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

    // Encrypt the idNumber and accountNumber
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
  loginRoute
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
