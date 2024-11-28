const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const saltedPepperedPassword = password + salt + process.env.MY_SECRET_PEPPER;
    const hash = await bcrypt.hash(saltedPepperedPassword, 12);
    return { salt, hash };
}

async function verifyPassword(password, hashedPassword, salt) {
    const saltedPepperedPassword = password + salt + process.env.MY_SECRET_PEPPER;
    return await bcrypt.compare(saltedPepperedPassword, hashedPassword);
}

module.exports = { hashPassword, verifyPassword };