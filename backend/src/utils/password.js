import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

// Genera un hash con salt para no guardar contrasenas en texto plano.
export const hashPassword = async (password) => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64);

  return `${salt}:${Buffer.from(derivedKey).toString('hex')}`;
};

// Compara la contrasena enviada con el hash guardado de forma segura.
export const verifyPassword = async (password, storedHash) => {
  if (!storedHash?.includes(':')) {
    return false;
  }

  const [salt, key] = storedHash.split(':');
  const derivedKey = await scrypt(password, salt, 64);
  const keyBuffer = Buffer.from(key, 'hex');

  if (keyBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(keyBuffer, Buffer.from(derivedKey));
};
