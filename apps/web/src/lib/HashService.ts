import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
export class HashService {
  private static readonly secret = process.env.DECRYPT_SECRET || 'secret';
  // Generate a salt with the specified number of rounds
  static async generateSalt(rounds: number = 10): Promise<string> {
    return bcrypt.genSalt(rounds);
  }

  // Hash a password using a provided salt (or generate a new salt)
  static async hashPassword(password: string, salt?: string): Promise<string> {
    if (!salt) {
      salt = await HashService.generateSalt();
    }
    return bcrypt.hash(password, salt);
  }

  // Compare a password with a hashed password to check if they match
  static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // encrypt with AES
  static async encrypt(text: string) {
    const encrypted = CryptoJS.AES.encrypt(text, HashService.secret).toString();
    return encrypted;
  }

  // decrypt with AES
  static decrypt(encrypted: string) {
    const decrypted = CryptoJS.AES.decrypt(encrypted, HashService.secret).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
}
