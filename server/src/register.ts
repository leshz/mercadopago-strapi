import type { Core } from '@strapi/strapi';

import customerSchema from "./components/customer.json";
import fulfillmentSchema from "./components/fulfillment.json";
import promotionSchema from "./components/promotion.json";
import informationSchema from "./components/information.json";

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  const fulfillment = strapi.components["mercadopago.fulfilment"];
  const customer = strapi.components["mercadopago.customer"];
  const promotion = strapi.components["mercadopago.promotion"];
  const information = strapi.components["mercadopago.information"];


  if (!(fulfillment && customer && promotion && information)) {
    strapi.log.warn("Register new components");

    strapi.components["mercadopago.fulfillment"] = fulfillmentSchema as any;
    strapi.components["mercadopago.customer"] = customerSchema as any;
    strapi.components["mercadopago.promotion"] = promotionSchema as any;
    strapi.components["mercadopago.information"] = informationSchema as any;
  }
};

export default register;
