import type { Core } from "@strapi/strapi";
import type {
  ConfigType,
  reqProduct,
  buildedProduct,
  resCustomer,
  meliCustomer,
  fulfillment,
  PaymentPayload,

} from "../types";

import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

import { purchase } from "../templates/admin-purchase";
import { errors } from "@strapi/utils";
import { INVOICES_STATUS } from "../constants";
import { mergeShipmentAtProducts } from "../helpers";

const productFormatter = (products, config: ConfigType): buildedProduct[] => {
  const { defaultCurrency } = config;

  return products.map((product) => {
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
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  meliProduct: (product, config) => productFormatter(product, config),
  products: async (items: reqProduct[]): Promise<buildedProduct[]> => {
    const attibutes = [
      "id",
      "name",
      "price",
      "short_description",
      "slug",
      "stock",
      "sku",
    ];

    if (!strapi.db) throw new errors.ApplicationError("Service not Available");

    const sku = items.map(({ sku = "" }) => ({ sku }));

    const results: any[] = await strapi.db
      .query("plugin::strapi-mercadopago.product")
      .findMany({
        select: attibutes,
        where: { $or: sku },
        populate: ["pictures", "promotion", "categories"],
      });

    if (results.length === 0)
      throw new errors.ApplicationError("products are not availables");

    return results.map((product) => {
      const productSelected: any = items.find(({ sku }) => sku === product.sku);

      if (productSelected?.quantity > product.stock) {
        throw new errors.ApplicationError("stock no available", {
          product: product.sku,
          stock: product.stock,
        });
      }

      return {
        ...product,
        stock: null,
        quantity: productSelected?.quantity,
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
  shipment: async (shipping: fulfillment): Promise<fulfillment> => shipping,
  createPreference: async (
    { products, payer, internalInvoiceId, shipment },
    config: ConfigType
  ) => {

    const {
      mercadoPagoToken,
      backUrls,
      bussinessDescription,
      notificationUrl
    } = config;

    const productsFormmated = productFormatter(products, config);
    const items = mergeShipmentAtProducts(productsFormmated, shipment);
    const client = new MercadoPagoConfig({
      accessToken: mercadoPagoToken,
      options: { timeout: 5000, idempotencyKey: "abc" },
    });

    const preference = new Preference(client);
    const payment_methods = { installments: 24, default_installments: 1 };

    const metadata = {};
    const body = {
      back_urls: {
        failure: backUrls,
        pending: backUrls,
        success: backUrls,
      },
      binary_mode: true,
      external_reference: internalInvoiceId,
      items,
      metadata,
      notificationUrl,
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
  paymentHook: async (payload: PaymentPayload, config: ConfigType) => {
    const { mercadoPagoToken = "", canSendMails, adminEmail } = config;
    const {
      data: { id = "" },
    } = payload;

    if (Number(id) === 123456) {
      return;
    }

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
    const response = await paymentService.get({ id });

    const {
      status,
      additional_info,
      external_reference: invoiceId,
      payment_type_id = "",
    } = response;

    const { items = [], ip_address } = additional_info || {};

    const invoice = await strapi
      .query("plugin::strapi-mercadopago.invoice")
      .findOne({
        select: ["*"],
        where: { id: invoiceId },
      });

    if (invoice === null) {
      strapi.log.info(`Invoice: not found`);
      return;
    }

    if (invoice.status === INVOICES_STATUS.APPROVED) {
      strapi.log.info(`Invoice: On retry but it has status approved`);
      return;
    }

    // PAYMENT SUCCESSFULL
    if (status === INVOICES_STATUS.APPROVED) {
      // UPDATE STATUS FROM PAYMENT SERVICE
      strapi.log.info(`TO THE MOON 🚀`);
      await strapi
        .query("plugin::strapi-mercadopago.invoice")
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
      // TODO : move to service
      if (canSendMails) {
        await strapi.plugins["email"].services.email.send({
          to: adminEmail,
          from: "admin@sagradacura.com",
          subject: "Nuevo pedido recibido :)",
          html: purchase,
        });
      }
    } else {
      await strapi
        .query("plugin::strapi-mercadopago.invoice")
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
  },
});
