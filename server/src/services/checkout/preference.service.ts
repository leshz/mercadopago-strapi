/**
 * Preference Service
 * Responsabilidad: Crear preferencias de pago en MercadoPago
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType, PreferenceResult } from '../../types';
import { COUNTRY_CONFIGS } from '../../helpers';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Crea una preferencia de pago en MercadoPago
   */
  async createPaymentPreference(
    order: any,
    products: any[],
    customer: any,
    fulfillment: any,
    config: ConfigType
  ): Promise<PreferenceResult> {
    const gateway = strapi.service('plugin::strapi-mercadopago.mercadopago-gateway');

    // Obtener configuración de país (default Colombia)
    const countryConfig = COUNTRY_CONFIGS['CO'];

    // Formatear productos
    const formattedProducts = gateway.formatProductsForPreference(
      products,
      config.defaultCurrency
    );

    // Formatear cliente
    const formattedCustomer = gateway.formatCustomerForPreference(
      customer,
      fulfillment,
      countryConfig
    );

    // Construir datos de preferencia
    const preferenceData = {
      external_reference: order.id.toString(),
      items: formattedProducts,
      payer: formattedCustomer,
      back_urls: config.backUrls,
      notification_url: config.notificationUrl,
      binary_mode: true,
      payment_methods: {
        installments: 12,
        default_installments: 1,
      },
      statement_descriptor: config.bussinessDescription,
    };

    // Crear preferencia en MercadoPago
    const preference = await gateway.createPreference(
      preferenceData,
      config.mercadoPagoToken
    );

    return {
      id: preference.id,
      initPoint: preference.init_point,
      collectorId: preference.collector_id?.toString() || '',
    };
  },
});
