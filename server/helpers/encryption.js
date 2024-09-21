const crypto = require("crypto");

function encrypt(text) {
  const algorithm = "aes-256-cbc";
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, salt, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return salt + ":" + iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
  const algorithm = "aes-256-cbc";
  const [salt, iv, encrypted] = text.split(":");
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, salt, 32);
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };