/**
 *  service
 */
import type { buildedProduct, fulfillment, Reqfulfillment, ConfigType, resCustomer } from "../types";

import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import { INVOICES_STATUS, SHIPPING_STATUS } from "../constants";
import { productsPricesSummary } from "../helpers";

type CreateInitialOrder = {
  fulfillment: Reqfulfillment;
  customer: resCustomer;
  rawProducts: buildedProduct[];
}

export default factories.createCoreService(
  "plugin::strapi-mercadopago.order",
  ({ strapi }) => ({
    async createInitialOrder({
      fulfillment,
      rawProducts,
      customer,
    }: CreateInitialOrder) {
      try {

        const { total, totalDiscounted } = productsPricesSummary(rawProducts);
        const savedata = await strapi.entityService.create("plugin::strapi-mercadopago.order", {
          data: {
            payment_status: INVOICES_STATUS.INITIAL,
            total: total,
            total_discount: totalDiscounted,
            products: rawProducts,
            payment_link: "",
            shipping_status: SHIPPING_STATUS.INITIAL,
            customer: { ...customer, last_name: customer.lastName },
            fulfillment: { ...fulfillment, postal_code: fulfillment.postalCode || '' },
          },
        });
        return savedata;
      } catch (error) {
        throw new errors.ApplicationError(error.message, {
          service: "createInitialOrder",
        });
      }
    },
    updateOrder: async ({ id, data }) => {
      try {
        const savedata = await strapi.entityService.update(
          "plugin::strapi-mercadopago.order",
          id,
          { data }
        );
        return savedata;
      } catch (error) {
        throw new errors.ApplicationError(error.message, {
          service: "updateOrder",
        });
      }
    },
  })
);
