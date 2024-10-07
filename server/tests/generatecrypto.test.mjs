import { expect } from 'chai';
import { generateSalt, generatePepper, hashPassword } from '../tests/generateCryptoFunctions.mjs';

describe('generateCryptoFunctions', () => {
  it('should generate a salt', () => {
    const salt = generateSalt();
    expect(salt).to.be.a('string');
    expect(salt).to.have.lengthOf(32);
  });

  it('should hash a password with salt and pepper', (done) => {
    const password = 'password123';
    const salt = generateSalt();
    const pepper = generatePepper();
    hashPassword(password, salt, pepper, (err, hash) => {
      expect(err).to.be.null;
      expect(hash).to.be.a('string');
      done();
    });
  });
});