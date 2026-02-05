/**
 * Configuration Controller
 * Responsabilidad: CRUD de configuración del plugin con cifrado de secretos
 */
import type { Core } from '@strapi/strapi';
import { encrypt, decrypt } from '../utils/encryption';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async get(ctx) {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-mercadopago',
    });

    const config = await pluginStore.get({ key: 'mercadopagoSetting' }) as any;

    if (!config) {
      return ctx.send({ ok: true, data: null });
    }

    // Descifrar secretos antes de enviar al admin
    const decryptedConfig = {
      ...config,
      mercadoPagoToken: config.mercadoPagoToken
        ? decrypt(config.mercadoPagoToken, strapi)
        : '',
      webhookPass: config.webhookPass
        ? decrypt(config.webhookPass, strapi)
        : '',
    };

    return ctx.send({ ok: true, data: decryptedConfig });
  },

  async update(ctx) {
    const { data } = ctx.request.body;
    const {
      isActive,
      mercadoPagoToken,
      defaultCurrency,
      backUrls,
      webhookPass,
      notificationUrl,
      bussinessDescription,
      isActiveVerification,
    } = data;

    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-mercadopago',
    });

    // Cifrar secretos antes de guardar
    const response = await pluginStore.set({
      key: 'mercadopagoSetting',
      value: {
        isActive,
        mercadoPagoToken: mercadoPagoToken
          ? encrypt(mercadoPagoToken, strapi)
          : '',
        defaultCurrency,
        backUrls,
        webhookPass: webhookPass
          ? encrypt(webhookPass, strapi)
          : '',
        notificationUrl,
        bussinessDescription,
        isActiveVerification,
      },
    });

    return ctx.send({ ok: true, response });
  },
});
