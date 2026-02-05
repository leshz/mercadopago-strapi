import type { Core } from '@strapi/strapi';
import { migrateConfigEncryption } from './scripts/migrate-encryption';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  // Migrar configuración existente a formato cifrado
  try {
    await migrateConfigEncryption(strapi);
  } catch (error) {
    strapi.log.warn('[MercadoPago] Encryption migration skipped', {
      error: error.message,
    });
  }

  strapi.log.info('[MercadoPago] Plugin initialized');
};

export default bootstrap;
