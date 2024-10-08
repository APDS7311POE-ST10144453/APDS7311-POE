const crypto = require("crypto");

// Function to encrypt a given text
function encrypt(text) {
  const algorithm = "aes-256-gcm"; // Encryption algorithm
  const salt = crypto.randomBytes(16).toString("hex"); // Generate a random salt
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, salt, 32); // Derive a key using the salt and environment key
  const iv = crypto.randomBytes(16); // Generate a random initialization vector (IV)
  const cipher = crypto.createCipheriv(algorithm, key, iv); // Create a cipher using the algorithm, key, and IV
  
  // Add pepper to the text
  const pepperedText = text + process.env.MY_SECRET_PEPPER;
  
  // Encrypt the peppered text
  let encrypted = cipher.update(pepperedText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString('hex'); // Get the authentication tag
  
  // Return the concatenated string of salt, IV, encrypted text, and authentication tag
  return salt + ":" + iv.toString("hex") + ":" + encrypted + ":" + authTag;
}

// Function to decrypt a given encrypted text
function decrypt(text) {
  const algorithm = "aes-256-gcm"; // Encryption algorithm
  const [salt, iv, encrypted, authTag] = text.split(":"); // Split the input text into salt, IV, encrypted text, and authentication tag
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, salt, 32); // Derive a key using the salt and environment key
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  ); // Create a decipher using the algorithm, key, and IV
  decipher.setAuthTag(Buffer.from(authTag, 'hex')); // Set the authentication tag for the decipher
  
  // Decrypt the encrypted text
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  // Remove pepper from the decrypted text
  const pepperLength = process.env.MY_SECRET_PEPPER.length;
  const originalText = decrypted.slice(0, -pepperLength);
  
  // Return the original plaintext
  return originalText;
}

module.exports = { encrypt, decrypt }; // Export the encrypt and decrypt functions