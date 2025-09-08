import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { config as loadEnv } from 'dotenv';

loadEnv();

export function generateRandomString(length: number) {
  return randomBytes(length).toString('base64').slice(0, length);
}
