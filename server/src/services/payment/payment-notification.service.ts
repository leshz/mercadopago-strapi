/**
 * Payment Notification Service
 * Responsabilidad: Procesar notificaciones de pago (webhooks)
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType, WebhookPayload } from '../../types';
import { INVOICES_STATUS } from '../../constants';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Procesa una notificación de pago de MercadoPago
   */
  async processPaymentNotification(payload: WebhookPayload, config: ConfigType) {
    const { data: { id: paymentId } } = payload;

    if (!paymentId) {
      throw new Error('Payment ID not provided in webhook');
    }

    strapi.log.info('Processing payment notification', { paymentId });

    // 1. Obtener y verificar datos del pago
    const paymentInfo = await strapi
      .service('plugin::strapi-mercadopago.payment-verification')
      .getAndVerifyPayment(paymentId, config);

    const { status, orderId, paymentTypeId, items } = paymentInfo;

    // 2. Buscar orden
    const order = await strapi.db
      .query('plugin::strapi-mercadopago.order')
      .findOne({
        where: { id: orderId },
      });

    if (!order) {
      strapi.log.error('Order not found for payment', {
        paymentId,
        orderId,
      });
      throw new Error(`Order ${orderId} not found`);
    }

    // 3. Verificar si ya fue procesado (idempotencia)
    if (order.payment_status === INVOICES_STATUS.APPROVED) {
      strapi.log.warn('Order already approved, skipping', {
        orderId,
        paymentId,
      });
      return;
    }

    // 4. Actualizar orden con nuevo status
    await strapi.db
      .query('plugin::strapi-mercadopago.order')
      .update({
        where: { id: orderId },
        data: {
          payment_status: status,
          paid_with: paymentTypeId,
        },
      });

    strapi.log.info('Order payment status updated', {
      orderId,
      paymentId,
      status,
    });

    // 5. Si aprobado, reducir stock
    if (status === INVOICES_STATUS.APPROVED && items.length > 0) {
      await strapi
        .service('plugin::strapi-mercadopago.stock-reduction')
        .reduceStock(items);

      strapi.log.info('Stock reduced for approved payment', {
        orderId,
        paymentId,
        itemsCount: items.length,
      });
    }
  },
});
