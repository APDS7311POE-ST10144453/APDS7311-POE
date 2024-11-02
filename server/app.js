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
    styleSrc: ["'self'"],
    imgSrc: ["'self'", "https://localhost:3000"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
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

// Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Insert routes here

app.use(urlprefix + "/user", userRoutes);


app.use(urlprefix + "/employee", employeeRoutes);


app.use(urlprefix + "/transaction", transactionRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app;
