/**
 *  controller
 */

import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async get(ctx) {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-mercadopago',
    });
    const response = await pluginStore.get({ key: 'mercadopagoSetting', });
    return ctx.send({ ok: true, data: response });
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
      isActiveVerification
    } = data;

    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-mercadopago',
    });


    const response = await pluginStore.set({
      key: 'mercadopagoSetting',
      value: {
        isActive,
        mercadoPagoToken,
        defaultCurrency,
        backUrls,
        webhookPass,
        notificationUrl,
        bussinessDescription,
        isActiveVerification
      },
    });

    return ctx.send({ ok: true, response });
  },
});
