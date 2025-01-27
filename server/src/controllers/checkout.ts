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
      const products = await strapi
        .service("plugin::strapi-mercadopago.mercadopago")
        .products(items, config);

      const buyerData = await strapi
        .service("plugin::strapi-mercadopago.mercadopago")
        .parserCustomer(customer, fulfillment);

      const shipment = await strapi
        .service("plugin::strapi-mercadopago.mercadopago")
        .shipment(fulfillment, products);

      const initInvoice = await strapi
        .service("plugin::strapi-mercadopago.order")
        .createInitialOrder({
          shipping: fulfillment,
          shopper: customer,
          products,
          shipment,
          config,
        });

      if (!initInvoice) {
        ctx.internalServerError("Creating invoice Error", {
          controller: "createInvoice",
        });
      }

      const preference = await strapi
        .service("plugin::strapi-mercadopago.mercadopago")
        .createPreference(
          {
            products,
            payer: buyerData,
            shipment,
            internalInvoiceId: initInvoice.id,
          },
          config
        );

      const { id, init_point, collector_id } = preference;
      const updatedInvoice = await strapi
        .service("plugin::strapi-mercadopago.order")
        .updateInvoice({
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
      strapi.log.error(error);
      return ctx.internalServerError({ error });
    }
  },
});
