/**
 * Configuration Controller
 * Responsabilidad: CRUD de configuración del plugin con cifrado de secretos
 */
import type { Core } from '@strapi/strapi';
import { encrypt, decrypt } from '../utils/encryption';
import { configurationSchema } from '../validators/configuration.validator';

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

    let validated;
    try {
      validated = await configurationSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      // error.inner contiene los errores individuales con path cuando abortEarly: false
      const fieldErrors = error.inner?.length
        ? error.inner.map((e: any) => ({ path: e.path, message: e.message }))
        : [{ path: null, message: error.message }];
      return ctx.badRequest('Invalid configuration data', { errors: fieldErrors });
    }

    const {
      isActive,
      mercadoPagoToken,
      defaultCurrency,
      backUrls,
      webhookPass,
      notificationUrl,
      bussinessDescription,
      isActiveVerification,
    } = validated;

    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-mercadopago',
    });

    // Normalizar backUrls: si viene como string, expandir al objeto que MercadoPago espera
    const normalizedBackUrls = backUrls
      ? { success: backUrls, failure: backUrls, pending: backUrls }
      : undefined;

    // Cifrar secretos antes de guardar
    const response = await pluginStore.set({
      key: 'mercadopagoSetting',
      value: {
        isActive,
        mercadoPagoToken: mercadoPagoToken
          ? encrypt(mercadoPagoToken, strapi)
          : '',
        defaultCurrency,
        backUrls: normalizedBackUrls,
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
