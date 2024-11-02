const rateLimit = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");

// All limiters should use the same MongoDB connection string
const mongoURI = process.env.CONNECTION_STRING;

// Login rate limiter
const loginLimiter = rateLimit({
  store: new MongoStore({
    uri: mongoURI,
    collectionName: "login-rate-limits",
    expireTimeMs: 15 * 60 * 1000,
    connectionOptions: {
      authSource: "admin",
      ssl: true,
      retryWrites: true,
      w: "majority",
    },
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // TODO: Change before submission 50 attempts
  message: "Too many login attempts, please try again after 15 minutes",
});

// Transaction rate limiter
const transactionLimiter = rateLimit({
  store: new MongoStore({
    uri: mongoURI,
    collectionName: "transaction-rate-limits",
    expireTimeMs: 60 * 60 * 1000,
    connectionOptions: {
      authSource: "admin",
      ssl: true,
      retryWrites: true,
      w: "majority",
    },
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 transactions per hour
  message: "Transaction limit reached, please try again later",
});

// Employee actions rate limiter
const employeeActionLimiter = rateLimit({
  store: new MongoStore({
    uri: mongoURI,
    collectionName: "employee-rate-limits",
    expireTimeMs: 60 * 60 * 1000,
    connectionOptions: {
      authSource: "admin",
      ssl: true,
      retryWrites: true,
      w: "majority",
    },
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 actions per hour
  message: "Action limit reached, please try again later",
});

module.exports = {
  loginLimiter,
  transactionLimiter,
  employeeActionLimiter,
};
