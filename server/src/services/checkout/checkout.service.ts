/**
 * Checkout Service (Orchestrator)
 * Responsabilidad: Orquestar el flujo completo de checkout
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType, CheckoutData, CheckoutResult } from '../../types';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Procesa un checkout completo
   */
  async processCheckout(data: CheckoutData, config: ConfigType): Promise<CheckoutResult> {
    const { items, customer, fulfillment } = data;

    strapi.log.info('Processing checkout', {
      itemsCount: items.length,
    });

    // 1. Obtener y validar productos
    const products = await strapi
      .service('plugin::strapi-mercadopago.product')
      .getProducts(items);

    // 2. Crear orden inicial
    const order = await strapi
      .service('plugin::strapi-mercadopago.order-creation')
      .createInitialOrder({
        products,
        customer,
        fulfillment,
      });

    // 3. Crear preferencia de pago en MercadoPago
    const preference = await strapi
      .service('plugin::strapi-mercadopago.preference')
      .createPaymentPreference(order, products, customer, fulfillment, config);

    // 4. Actualizar orden con link de pago
    const updatedOrder = await strapi
      .service('plugin::strapi-mercadopago.order-creation')
      .updateWithPaymentLink(order.id, preference);

    strapi.log.info('Checkout completed successfully', {
      orderId: updatedOrder.id,
      preferenceId: preference.id,
    });

    return {
      orderId: updatedOrder.id,
      paymentUrl: preference.initPoint,
      preferenceId: preference.id,
      collectorId: preference.collectorId,
    };
  },
});
