import crypto from "crypto";

/**
 * Creates a secure lookup hash for a given account number.
 *
 * This function generates a SHA-256 hash by combining the provided account number
 * with an encryption key stored in an environment variable. The hash can be used
 * for securely identifying accounts without storing raw account numbers.
 *
 * @param {string} accountNumber - The account number to be hashed.
 * @returns {string} - A hexadecimal string representing the hash of the account number.
 * @throws {Error} - If the encryption key is missing or empty in the environment variables.
 */
export const createLookupHash = (accountNumber: string): string => {
  const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

  // Check for a valid encryption key in the environment
  if (ENCRYPTION_KEY == null) {
    throw new Error("REACT_APP_ENCRYPTION_KEY environment variable is not set");
  }

  if (ENCRYPTION_KEY.length === 0) {
    throw new Error("REACT_APP_ENCRYPTION_KEY environment variable is empty");
  }

  // Ensure accountNumber is a string and trim any whitespace
  const normalizedAccountNumber = String(accountNumber).trim();

  // Generate and return the SHA-256 hash
  return crypto
    .createHash("sha256")
    .update(normalizedAccountNumber + ENCRYPTION_KEY)
    .digest("hex");
};
