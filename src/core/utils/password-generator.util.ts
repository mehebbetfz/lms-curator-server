import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { config as loadEnv } from 'dotenv';

loadEnv();

export function generateRandomString(length: number) {
  return randomBytes(length).toString('base64').slice(0, length);
}

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');

// Проверка длины ключа
if (key.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be a 32-byte hex string.');
}

// Функция для шифрования пароля
export function encryptPassword(password: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

// Функция для расшифровки пароля
export function decryptPassword(encryptedPassword: string): string {
  const [ivHex, encrypted] = encryptedPassword.split(':');
  const decipher = createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
