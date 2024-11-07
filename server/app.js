require("./helpers/checkEnv")();

const express = require("express");
const app = express();
const urlprefix = "/api";
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require("express-rate-limit");
const sanitizeXSS = require("./middleware/xssSanitizer");
const logger = require('./utils/logger');
const userRoutes = require("./routes/user");
const employeeRoutes = require("./routes/employee");
const transactionRoutes = require("./routes/transaction");

require("dotenv").config();

// SSL Configuration
const cert = fs.readFileSync("keys/certificate.pem");
const options = {
  sslCA: cert,
};

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// MongoDB Connection
const connstring = process.env.CONNECTION_STRING;
mongoose.set("debug", process.env.NODE_ENV === 'development');

mongoose
  .connect(connstring)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((err) => {
    logger.error("Error connecting to MongoDB", err);
  }, options);

// Security Middleware
app.use(globalLimiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(sanitizeXSS);

// Enhanced Helmet Configuration
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "https://localhost:3000", "data:"],
    connectSrc: ["'self'", "https://api.api-ninjas.com"],
    fontSrc: ["'self'", "https:", "data:"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
    formAction: ["'self'"],
    upgradeInsecureRequests: [],
  },
}));

// CORS Configuration
app.use(
  cors({
    origin: [
      "https://localhost:3000",
      "https://localhost:5173",
      "https://localhost:5173/api",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin", 
      "X-Requested-With", 
      "Content-Type", 
      "Accept", 
      "Authorization"
    ],
    credentials: true,
    maxAge: 86400
  })
);

// Body Parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ key }) => {
    logger.warn(`Attempted NoSQL injection: ${key}`);
  }
}));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token or no token provided'
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(409).json({
      status: 'error',
      message: 'Duplicate key error'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};

app.use(errorHandler);

// Insert routes here
app.use(urlprefix + "/user", userRoutes);

app.use(urlprefix + "/employee", employeeRoutes);

app.use(urlprefix + "/transaction", transactionRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((req, res, next) => {
  // HSTS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=()');
  
  // Remove powered by header
  res.removeHeader('X-Powered-By');
  
  next();
});

module.exports = app;
