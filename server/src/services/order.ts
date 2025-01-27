/**
 *  service
 */
import type { buildedProduct, fulfillment, Reqfulfillment, ConfigType, resCustomer } from "../types";

import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import { INVOICES_STATUS, SHIPPING_STATUS } from "../constants";
import {
  calculateWithShipment,
  mergeShipmentAtProducts,
  productsPricesSummary,
} from "../helpers";

type CreateInitialOrder = {
  shipping: Reqfulfillment;
  shopper: resCustomer;
  products: buildedProduct[];
  shipment: fulfillment;
  config: ConfigType;
}

export default factories.createCoreService(
  "plugin::strapi-mercadopago.order",
  ({ strapi }) => ({
    async createInitialOrder({
      shipping,
      products,
      shopper,
      shipment,
      config,
    }: CreateInitialOrder) {
      try {
        const formatedProducts = await strapi
          .service("plugin::strapi-mercadopago.mercadopago")
          .meliProduct(products, config);

        const { total, totalDiscounted } = productsPricesSummary(products);

        const data = {
          payment_status: INVOICES_STATUS.INITIAL,
          total: total,
          total_discount: totalDiscounted,
          products: formatedProducts,
          payment_link: "",
          shipping_status: SHIPPING_STATUS.INITIAL,
          customer: { ...shopper, last_name: shopper.lastName },
          fulfillment: { ...shipping, postal_code: shipping.postalCode || 0 },
        };
        console.log(data)

        const savedata = await strapi?.entityService?.create(
          "plugin::strapi-mercadopago.order",
          {
            data: {
              payment_status: INVOICES_STATUS.INITIAL,
              total: total,
              total_discount: totalDiscounted,
              products: formatedProducts,
              payment_link: "",
              shipping_status: SHIPPING_STATUS.INITIAL,
              customer: { ...shopper, last_name: shopper.lastName },
              fulfillment: { ...shipping, postal_code: shipping.postalCode || 0 },
            },
          }
        );
        return savedata;
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));

        throw new errors.ApplicationError(error.message, {
          service: "createInitialOrder",
        });
      }
    },
    updateInvoice: async ({ id, data }) => {
      try {
        const savedata = await strapi.entityService?.update(
          "plugin::strapi-mercadopago.invoice",
          id,
          { data }
        );
        return savedata;
      } catch (error) {
        throw new errors.ApplicationError(error.message, {
          service: "updateInvoice",
        });
      }
    },
  })
);
