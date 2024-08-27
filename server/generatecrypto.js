const crypto = require("crypto");

// Generate a secure encryption key
const encryptionKey = crypto.randomBytes(32).toString("hex");
console.log("ENCRYPTION_KEY:", encryptionKey);

// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(32).toString("hex");
console.log("JWT_SECRET:", jwtSecret);

// Generate a secure password salt
const salt = crypto.randomBytes(16).toString("hex");
console.log("SALT:", salt);
