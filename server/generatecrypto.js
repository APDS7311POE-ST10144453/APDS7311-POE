const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Generate a secure encryption key
const encryptionKey = crypto.randomBytes(32).toString("hex");
//console.log("ENCRYPTION_KEY:", encryptionKey);

// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(32).toString("hex");
//console.log("JWT_SECRET:", jwtSecret);

// Generate a secure password salt
// const salt = crypto.randomBytes(16).toString("hex");
//console.log("SALT:", salt);

//Generate secure pepper
const pepper1 = crypto.randomBytes(16).toString("hex");
console.log("PEPPER:", pepper1);

// Generate a secure password salt
const salt = crypto.randomBytes(16).toString("hex");
console.log("Generated Salt:", salt);

// Define a pepper (a secret value stored securely, not in the database)
const pepper = process.env.MY_SECRET_PEPPER="SuperSecretPepper";
console.log("Pepper:", pepper);

// An example of a password being hashed
const password = 'mySecurePassword';
console.log('Password:', password);

// Combine password, salt, and pepper
const saltedPepperedPassword = password + salt + pepper;
console.log('Salted and Peppered Password:', saltedPepperedPassword);

// Hash the combined password
bcrypt.hash(saltedPepperedPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log('Salted, Peppered, and Hashed Password:', hash);
});