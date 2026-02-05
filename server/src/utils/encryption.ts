/**
 * Encryption utilities for sensitive data in plugin store
 * Uses AES-256-GCM for authenticated encryption
 */
import crypto from 'crypto';
import type { Core } from '@strapi/strapi';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Obtiene la clave de cifrado desde la configuración de Strapi
 */
function getEncryptionKey(strapi: Core.Strapi): Buffer {
  const encryptionKey = strapi.config.get('admin.secrets.encryptionKey') as string | undefined;

  if (!encryptionKey || typeof encryptionKey !== 'string') {
    throw new Error(
      'ENCRYPTION_KEY not configured. Add it to .env and config/admin.ts'
    );
  }

  if (encryptionKey.length < 32) {
    throw new Error(
      'ENCRYPTION_KEY must be at least 32 characters. Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"'
    );
  }

  // Derivar clave de 32 bytes usando SHA-256
  return crypto.createHash('sha256').update(encryptionKey).digest();
}

/**
 * Cifra un valor sensible usando AES-256-GCM
 * @returns Texto cifrado en formato: iv + authTag + encrypted (todo en hex)
 */
export function encrypt(text: string, strapi: Core.Strapi): string {
  if (!text || text.trim() === '') {
    return text;
  }

  try {
    const key = getEncryptionKey(strapi);
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Formato: iv (32 chars hex) + authTag (32 chars hex) + encrypted
    return iv.toString('hex') + authTag.toString('hex') + encrypted;
  } catch (error) {
    console.error(error);
    strapi.log.error('Encryption failed', {
      error: error.message,
    });
    throw new Error('Failed to encrypt sensitive data');
  }
}

/**
 * Descifra un valor previamente cifrado
 * @returns Texto plano descifrado
 */
export function decrypt(encryptedText: string, strapi: Core.Strapi): string {
  if (!encryptedText || encryptedText.trim() === '') {
    return encryptedText;
  }

  try {
    const key = getEncryptionKey(strapi);

    // Parsear el formato: iv (32 chars) + authTag (32 chars) + encrypted
    const ivHex = encryptedText.slice(0, IV_LENGTH * 2);
    const authTagHex = encryptedText.slice(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2);
    const encryptedHex = encryptedText.slice((IV_LENGTH + AUTH_TAG_LENGTH) * 2);

    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    // Si falla, puede ser texto plano (migración) o clave cambiada
    strapi.log.warn('Decryption failed - data may be in plain text', {
      error: error.message,
      dataLength: encryptedText?.length,
    });

    // Retornar tal cual para backward compatibility
    return encryptedText;
  }
}

/**
 * Verifica si un valor parece estar cifrado
 */
export function isEncrypted(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }

  // Longitud mínima: iv (32) + authTag (32) + al menos algo de datos cifrados
  if (value.length < (IV_LENGTH + AUTH_TAG_LENGTH) * 2 + 2) {
    return false;
  }

  // Verificar que sea hexadecimal válido
  return /^[0-9a-f]+$/i.test(value);
}
