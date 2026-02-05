/**
 * MercadoPago Gateway
 * Responsabilidad: Abstracción del SDK de MercadoPago
 * Este gateway encapsula todas las interacciones con la API de MercadoPago
 */
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { randomUUID } from 'crypto';
import type { Core } from '@strapi/strapi';
import type { CountryConfig, CustomerInfo, FulfillmentInfo, ProductInfo } from '../../types';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Crea un cliente de MercadoPago configurado
   */
  createClient(accessToken: string) {
    return new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 10000,
        idempotencyKey: randomUUID(),
      },
    });
  },

  /**
   * Crea una preferencia de pago en MercadoPago
   */
  async createPreference(preferenceData: any, accessToken: string) {
    const client = this.createClient(accessToken);
    const preference = new Preference(client);

    try {
      strapi.log.debug('Creating MercadoPago preference', {
        orderId: preferenceData.external_reference,
        itemsCount: preferenceData.items?.length,
      });

      const response = await preference.create({
        body: preferenceData,
      });

      strapi.log.info('MercadoPago preference created', {
        preferenceId: response.id,
        orderId: preferenceData.external_reference,
      });

      return response;
    } catch (error) {
      strapi.log.error('Failed to create MercadoPago preference', {
        error: error.message,
        orderId: preferenceData.external_reference,
      });
      throw new Error(`MercadoPago API Error: ${error.message}`);
    }
  },

  /**
   * Obtiene información de un pago desde MercadoPago
   */
  async getPayment(paymentId: string, accessToken: string) {
    const client = this.createClient(accessToken);
    const payment = new Payment(client);

    try {
      strapi.log.debug('Fetching payment from MercadoPago', { paymentId });

      const response = await payment.get({ id: paymentId });

      strapi.log.info('Payment fetched from MercadoPago', {
        paymentId,
        status: response.status,
      });

      return response;
    } catch (error) {
      strapi.log.error('Failed to fetch payment from MercadoPago', {
        error: error.message,
        paymentId,
      });
      throw new Error(`MercadoPago API Error: ${error.message}`);
    }
  },

  /**
   * Formatea productos para MercadoPago
   */
  formatProductsForPreference(products: ProductInfo[], currencyId: string) {
    return products.map((product) => {
      const { pictures, promotion, categories, price, name, short_description, sku, quantity } = product;

      const categoryId = categories?.[0]?.id || 0;
      const { with_discount = false, price_with_discount = 0 } = promotion || {};
      const finalPrice = with_discount ? price_with_discount : price;
      const urlImage = pictures?.[0]?.url || '';

      return {
        id: sku,
        title: name,
        description: short_description || name,
        picture_url: urlImage,
        quantity: quantity,
        currency_id: currencyId,
        unit_price: finalPrice,
        category_id: categoryId,
      };
    });
  },

  /**
   * Formatea información del cliente para MercadoPago
   */
  formatCustomerForPreference(
    customer: CustomerInfo,
    fulfillment: FulfillmentInfo,
    countryConfig: CountryConfig
  ) {
    const { dni, email, lastName, name, phone } = customer;
    const { postalCode = '', address, city, department } = fulfillment;

    return {
      name,
      surname: lastName,
      email,
      phone: {
        area_code: countryConfig.areaCode,
        number: phone,
      },
      identification: {
        type: countryConfig.identificationType,
        number: dni,
      },
      address: {
        zip_code: postalCode,
        street_name: `${department} ${city}`,
        street_number: address,
      },
    };
  },
});
