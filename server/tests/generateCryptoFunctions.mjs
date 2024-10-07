import crypto from 'crypto';
import bcrypt from 'bcrypt';

export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

export function generatePepper() {
  return crypto.randomBytes(16).toString('hex');
}

export function hashPassword(password, salt, pepper, callback) {
  const combined = password + salt + pepper;
  bcrypt.hash(combined, 10, (err, hash) => {
    if (err) {
      return callback(err);
    }
    callback(null, hash);
  });
}