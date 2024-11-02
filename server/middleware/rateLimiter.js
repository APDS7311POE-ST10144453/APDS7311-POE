const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

// Login rate limiter
const loginLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: 'login-rate-limits',
    expireTimeMs: 15 * 60 * 1000,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again after 15 minutes'
});

// Transaction rate limiter
const transactionLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: 'transaction-rate-limits',
    expireTimeMs: 60 * 60 * 1000,
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 transactions per hour
  message: 'Transaction limit reached, please try again later'
});

// Employee actions rate limiter
const employeeActionLimiter = rateLimit({
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: 'employee-rate-limits',
    expireTimeMs: 60 * 60 * 1000,
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 actions per hour
  message: 'Action limit reached, please try again later'
});

module.exports = {
  loginLimiter,
  transactionLimiter,
  employeeActionLimiter
};