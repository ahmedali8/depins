import { Keypair } from '@solana/web3.js';
import * as crypto from 'crypto';

/**
 * Creates a new Solana wallet
 * @returns An object containing the wallet's public key and secret key
 */
export function createNewSolanaWallet(): {
  publicKey: string;
  secretKey: string;
  encryptedSecretKey: string;
} {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toString();
  const secretKey = Buffer.from(keypair.secretKey).toString('base64');
  const encryptedSecretKey = encrypt(secretKey);
  return {
    publicKey,
    secretKey,
    encryptedSecretKey,
  };
}
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16
export function encrypt(text: string): string {
  const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;

  if (!ENCRYPTION_SECRET) {
    throw new Error(
      'ENCRYPTION_SECRET must be set and 32 bytes long in the .env file',
    );
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_SECRET),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}
export function decrypt(encryptedText: string): string {
  const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;

  if (!ENCRYPTION_SECRET) {
    throw new Error(
      'ENCRYPTION_SECRET must be set and 32 bytes long in the .env file',
    );
  }
  const [ivHex, encryptedHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_SECRET),
    iv,
  );
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
