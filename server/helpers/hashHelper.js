const crypto = require('crypto');

function createLookupHash(accountNumber) {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  // Ensure accountNumber is a string and trim any whitespace
  const normalizedAccountNumber = String(accountNumber).trim();
  return crypto
    .createHash('sha256')
    .update(normalizedAccountNumber + process.env.ENCRYPTION_KEY)
    .digest('hex');
}

module.exports = { createLookupHash };