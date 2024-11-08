const crypto = require('crypto');

/**
 * Creates a secure lookup hash for a given account number.
 * 
 * This function combines the provided account number with an encryption key
 * from the environment to generate a SHA-256 hash, which can be used for
 * secure identification without exposing raw account numbers.
 *
 * @param {string} accountNumber - The account number to be hashed.
 * @returns {string} - A hexadecimal string representing the hash of the account number.
 * @throws {Error} - If the ENCRYPTION_KEY environment variable is not set.
 */
function createLookupHash(accountNumber) {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  // Ensure accountNumber is a string and trim any whitespace
  const normalizedAccountNumber = String(accountNumber).trim();

  // Generate and return the SHA-256 hash
  return crypto
    .createHash('sha256')
    .update(normalizedAccountNumber + process.env.ENCRYPTION_KEY)
    .digest('hex');
}

module.exports = { createLookupHash };