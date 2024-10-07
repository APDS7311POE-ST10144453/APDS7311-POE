const crypto = require("crypto");
const bcrypt = require("bcrypt");

console.log("\nCopy the below and paste into the .env file\n");
// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(32).toString("hex");
console.log("JWT_SECRET="+jwtSecret);

// Generate a secure encryption key
const encryptionKey = crypto.randomBytes(32).toString("hex");
console.log("ENCRYPTION_KEY="+encryptionKey);

// Generate a secure pepper
const pepper = crypto.randomBytes(16).toString("hex");
console.log("MY_SECRET_PEPPER="+pepper);

console.log(`\n-------------------------------------------\n`);
console.log(`Password security process:`);

// An example of a password being hashed
const password = 'mySecurePassword';
console.log('Password:', password);

// Generate a secure password salt
const salt = crypto.randomBytes(16).toString("hex");
console.log("Generated Salt=", salt);

// Combine password, salt, and pepper
const saltedPepperedPassword = password + salt + pepper;
console.log('Salted and Peppered Password:', saltedPepperedPassword);

// Hash the combined password
bcrypt.hash(saltedPepperedPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log('Salted, Peppered, and Hashed Password:', hash);
});