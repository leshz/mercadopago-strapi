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

    strapi.log.info(`Webhook type: ${type}`);
    strapi.log.info(`Webhook action: ${action}`);

    switch (type) {
      case NOTIFICATION_TYPES.PAYMENT:
        try {
          await strapi
            .service("plugin::strapi-mercadopago.mercadopago")
            .paymentAction(payload, config);
          return ctx.send({
            message: "Webhook received",
          }, 200);
        } catch (error) {
          return ctx.internalServerError(error.message);
        }

      default:
        strapi.log.info(`Webhook type: ${type}`);
        strapi.log.info(`Webhook action: ${action}`);
        return ctx.send({
          message: "Webhook received",
        }, 200);
    }
  },
});
