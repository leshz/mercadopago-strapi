/**
 *  controller
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType, CheckoutBody } from "../types";
import { INVOICES_STATUS } from "../constants";


export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async checkout(ctx) {
    const { config }: { config: ConfigType } = ctx.state;
    const { items = [], customer, fulfillment }: CheckoutBody = ctx.request.body || {};
    if (items.length === 0) return ctx.badRequest();

    try {

      const rawProducts = await strapi
        .service("plugin::strapi-mercadopago.product")
        .getProducts(items);

      const initInvoice = await strapi
        .service("plugin::strapi-mercadopago.order")
        .createInitialOrder({
          fulfillment,
          customer,
          rawProducts,
        });

      if (!initInvoice) {
        ctx.internalServerError("Creating invoice Error", {
          controller: "createInvoice",
        });
      }

      const customerParsed = await strapi
        .service("plugin::strapi-mercadopago.mercadopago")
        .parserCustomer(customer, fulfillment);

      const fulfillmentParsed = await strapi
        .service("plugin::strapi-mercadopago.mercadopago")
        .parserFulfillment(fulfillment);

      const preference = await strapi
        .service("plugin::strapi-mercadopago.mercadopago")
        .createPreference(
          {
            rawProducts,
            payer: customerParsed,
            fulfillmentParsed,
            internalInvoiceId: initInvoice.id,
          },
          config
        );

      const { id, init_point, collector_id } = preference;
      const updatedInvoice = await strapi
        .service("plugin::strapi-mercadopago.order")
        .updateOrder({
          id: initInvoice.id,
          data: {
            ...initInvoice,
            payment_status: INVOICES_STATUS.IN_PROCESS,
            collector_id: `${collector_id}`,
            preference_id: id,
            payment_link: init_point,
          },
        });

      return ctx.send({
        init_point,
        preferenceId: id,
        collector_id,
        invoiceId: updatedInvoice.id,
      });
    } catch (error) {
      return ctx.internalServerError(error.message, {});
    }
  },
});
