import type { Core } from '@strapi/strapi';

import customerSchema from "./components/customer.json";
import fulfilmentSchema from "./components/fulfilment.json";
import promotionSchema from "./components/promotion.json";
import informationSchema from "./components/information.json";

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  const fulfilment = strapi.components["mercadopago.fulfilment"];
  const customer = strapi.components["mercadopago.customer"];
  const promotion = strapi.components["mercadopago.promotion"];
  const information = strapi.components["mercadopago.information"];

  if (!(fulfilment && customer && promotion && information)) {
    strapi.log.warn("Register new components");
    strapi
      .plugin("content-type-builder")
      .services.components.createComponent({
        component: {
          category: "mercadopago",
          displayName: fulfilmentSchema.info.displayName,
          icon: fulfilmentSchema.info.icon,
          attributes: fulfilmentSchema.attributes,
        },
        components: [
          {
            tmpUID: "mercadopago.customer",
            category: "mercadopago",
            displayName: customerSchema.info.displayName,
            icon: customerSchema.info.icon,
            attributes: customerSchema.attributes,
          }, {
            tmpUID: "mercadopago.promotion",
            category: "mercadopago",
            displayName: promotionSchema.info.displayName,
            icon: promotionSchema.info.icon,
            attributes: promotionSchema.attributes,
          }, {
            tmpUID: "mercadopago.information",
            category: "mercadopago",
            displayName: informationSchema.info.displayName,
            icon: informationSchema.info.icon,
            attributes: informationSchema.attributes,
          }
        ],
      });
  }
};

export default register;
