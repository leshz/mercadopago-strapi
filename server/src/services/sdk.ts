import type { Core } from "@strapi/strapi";
import type {
  ConfigType,
  resCustomer,
  meliCustomer,
  fulfillment,
  PaymentPayload,
} from "../types";

import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { errors } from "@strapi/utils";
import { INVOICES_STATUS } from "../constants";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  parserProducts: async (rawProducts, config: ConfigType) => {
    const { defaultCurrency } = config;

    return rawProducts.map((product) => {
      const { pictures, promotion, categories, price } = product;
      const categoryId = categories?.[0]?.id || 0;
      const { with_discount = false, price_with_discount = 0 } = promotion || {};
      const finalPriceProduct = with_discount ? price_with_discount : price;
      const urlImage = pictures?.[0]?.url || "";

      return {
        id: product.sku,
        title: product.name,
        description: product.short_description,
        picture_url: urlImage,
        quantity: product.quantity,
        currency_id: defaultCurrency,
        unit_price: finalPriceProduct,
        category_id: categoryId,
      };
    });
  },
  parserCustomer: async (customer: resCustomer, fulfillment: fulfillment): Promise<meliCustomer> => {
    const { dni, email, lastName, name, phone } = customer;
    const { postalCode = "", address, city, department } = fulfillment;
    const payer = {
      name,
      surname: lastName,
      email,
      phone: {
        area_code: "57",
        number: phone,
      },
      identification: {
        type: "CC",
        number: dni,
      },
      address: {
        zip_code: postalCode,
        street_name: `${department} ${city}`,
        street_number: `${address}`,
      },
    };

    return payer;
  },
  parserFulfillment: async (shipping: fulfillment): Promise<fulfillment> => shipping,
  createPreference: async (
    { rawProducts, payer, internalInvoiceId },
    config: ConfigType
  ) => {
    const {
      mercadoPagoToken,
      backUrls,
      bussinessDescription,
      notificationUrl
    } = config;

    const productsFormmated = await strapi
      .service("plugin::strapi-mercadopago.mercadopago")
      .parserProducts(rawProducts, config)

    const client = new MercadoPagoConfig({
      accessToken: mercadoPagoToken,
      options: { timeout: 5000, idempotencyKey: "abc" },
    });

    const preference = new Preference(client);
    const payment_methods = { installments: 12, default_installments: 1 };

    const metadata = {};
    const body = {
      back_urls: {
        failure: backUrls,
        pending: backUrls,
        success: backUrls,
      },
      binary_mode: true,
      external_reference: internalInvoiceId,
      items: productsFormmated,
      metadata,
      notification_url: notificationUrl,
      payer,
      payment_methods,
      statement_descriptor: bussinessDescription,
    };
    try {
      const response = await preference.create({ body });
      return response;
    } catch (error) {
      throw new errors.ApplicationError(error.message, {
        service: "createPreference",
      });
    }
  },
  paymentAction: async (payload: PaymentPayload, config: ConfigType) => {
    const { mercadoPagoToken = "" } = config;
    const {
      data: { id = "" },
    } = payload;

    const client = new MercadoPagoConfig({
      accessToken: mercadoPagoToken,
      options: { timeout: 5000, idempotencyKey: "abc" },
    });

    if (id === "") {
      throw new errors.ApplicationError("no ID", {
        service: "paymentAction",
      });
    }

    const paymentService = new Payment(client);

    try {
      const paymentData = await paymentService.get({ id });

      const {
        status,
        additional_info,
        external_reference: invoiceId,
        payment_type_id = "",
      } = paymentData;

      const { items = [], ip_address } = additional_info || {};

      const invoice = await strapi
        .query("plugin::strapi-mercadopago.order")
        .findOne({
          select: ["*"],
          where: { id: invoiceId },
        });

      if (invoice === null) {
        strapi.log.info(`Invoice: not found`);
        throw new errors.ApplicationError("Invoice: not found", {
          service: "paymentAction",
        });
      }

      if (invoice.status === INVOICES_STATUS.APPROVED) {
        strapi.log.warn(`Order: On retry but it has status approved`);
        return
      }

      // PAYMENT SUCCESSFULL
      if (status === INVOICES_STATUS.APPROVED) {
        // UPDATE STATUS FROM PAYMENT SERVICE
        await strapi
          .query("plugin::strapi-mercadopago.order")
          .update({
            where: { id: invoiceId },
            data: {
              payment_status: status,
              paid_with: payment_type_id,
            },
          });

        strapi.log.info(
          `Invoice: ${invoiceId} has been updated with Status: ${status}`
        );

        await items.forEach(async (product) => {
          const dbproduct = await strapi
            .query("plugin::strapi-mercadopago.product")
            .findOne({ where: { sku: product.id } });

          if (dbproduct) {
            const newStock = Number(dbproduct.stock) - Number(product.quantity);
            await strapi
              .query("plugin::strapi-mercadopago.product")
              .update({
                where: { sku: product.id },
                data: {
                  stock: newStock,
                },
              });
            strapi.log.info(
              `Product: ${dbproduct.sku} has been updated with Stock: ${newStock}`
            );
          } else {
            strapi.log.info(`Product without update: ${product.id}`);
          }
        });
      } else {
        await strapi
          .query("plugin::strapi-mercadopago.order")
          .update({
            where: { id: invoiceId },
            data: {
              status,
              paid_with: payment_type_id,
            },
          });
        strapi.log.info(
          `Invoice: ${invoiceId} has been updated with Status: ${status}`
        );
      }

    } catch (error) {
      throw new errors.ApplicationError(error.message);
    }
  },
});
