import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export class EncryptionService {
  static generateIV(): Buffer {
    return randomBytes(16);
  }

  static async generateKey(password: string, salt: string): Promise<Buffer> {
    const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;
    return key;
  }

  static encrypt(text: string, key: Buffer, iv: Buffer): Buffer {
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedText = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return encryptedText;
  }

  static decrypt(encryptedText: Buffer, key: Buffer, iv: Buffer): string {
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedText = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decryptedText.toString('utf8');
  }

  static checkEncryption(originalText: string, encryptedText: Buffer, key: Buffer, iv: Buffer): boolean {
    const decryptedText = EncryptionService.decrypt(encryptedText, key, iv);
    return decryptedText === originalText;
  }
}
