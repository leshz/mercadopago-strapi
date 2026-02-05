/**
 * Migration script to encrypt existing plain-text secrets in plugin store
 * Run automatically on bootstrap
 */
import type { Core } from '@strapi/strapi';
import { encrypt, isEncrypted } from '../utils/encryption';

export async function migrateConfigEncryption(strapi: Core.Strapi) {
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'plugin',
    name: 'strapi-mercadopago',
  });

  const config = await pluginStore.get({ key: 'mercadopagoSetting' }) as any;

  if (!config) {
    strapi.log.info('[MercadoPago] No configuration to migrate');
    return;
  }

  let updated = false;

  // Migrar mercadoPagoToken si no está cifrado
  if (config.mercadoPagoToken && !isEncrypted(config.mercadoPagoToken)) {
    strapi.log.info('[MercadoPago] Migrating mercadoPagoToken to encrypted format');
    config.mercadoPagoToken = encrypt(config.mercadoPagoToken, strapi);
    updated = true;
  }

  // Migrar webhookPass si no está cifrado
  if (config.webhookPass && !isEncrypted(config.webhookPass)) {
    strapi.log.info('[MercadoPago] Migrating webhookPass to encrypted format');
    config.webhookPass = encrypt(config.webhookPass, strapi);
    updated = true;
  }

  if (updated) {
    await pluginStore.set({
      key: 'mercadopagoSetting',
      value: config,
    });
    strapi.log.info('[MercadoPago] Configuration migration completed successfully');
  } else {
    strapi.log.debug('[MercadoPago] Configuration already encrypted, no migration needed');
  }
}
