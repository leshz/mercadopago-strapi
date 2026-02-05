import type { Core } from '@strapi/strapi';
/**
 * Cifra un valor sensible usando AES-256-GCM
 * @returns Texto cifrado en formato: iv + authTag + encrypted (todo en hex)
 */
export declare function encrypt(text: string, strapi: Core.Strapi): string;
/**
 * Descifra un valor previamente cifrado
 * @returns Texto plano descifrado
 */
export declare function decrypt(encryptedText: string, strapi: Core.Strapi): string;
/**
 * Verifica si un valor parece estar cifrado
 */
export declare function isEncrypted(value: string): boolean;
