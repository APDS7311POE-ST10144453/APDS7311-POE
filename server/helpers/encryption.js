const crypto = require("crypto");

function encrypt(text) {
  const algorithm = "aes-256-gcm";
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, salt, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  // Add pepper to the text
  const pepperedText = text + process.env.MY_SECRET_PEPPER;
  
  let encrypted = cipher.update(pepperedText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString('hex'); // Get authentication tag
  return salt + ":" + iv.toString("hex") + ":" + encrypted + ":" + authTag;
}

function decrypt(text) {
  const algorithm = "aes-256-gcm";
  const [salt, iv, encrypted, authTag] = text.split(":");
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, salt, 32);
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(authTag, 'hex')); // Set authentication tag
  
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  // Remove pepper from the decrypted text
  const pepperLength = process.env.MY_SECRET_PEPPER.length;
  const originalText = decrypted.slice(0, -pepperLength);
  
  return originalText;
}

module.exports = { encrypt, decrypt };