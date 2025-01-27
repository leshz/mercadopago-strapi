/**
 *  controller
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType } from "../types";

import { NOTIFICATION_TYPES } from "../constants";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async notification(ctx) {
    const payload = ctx?.request?.body || {};
    const { config }: { config: ConfigType } = ctx.state;
    const { type = "", action = "" } = payload;

    strapi.log.info("Notification activated!");

    switch (type) {
      case NOTIFICATION_TYPES.PAYMENT:
        strapi.log.info("Payment Action");
        await strapi
          .service("plugin::strapi-mercadopago.mercadopago")
          .paymentHook(payload, config);
        return ctx.send();

      default:
        strapi.log.info(`Meli Webhook type: ${type}`);
        strapi.log.info(`Meli Webhook action: ${action}`);
        return ctx.send();
    }
  },
});
