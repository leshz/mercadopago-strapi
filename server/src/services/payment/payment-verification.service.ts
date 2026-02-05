/**
 * Payment Verification Service
 * Responsabilidad: Verificar y obtener datos de pagos desde MercadoPago
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType, PaymentInfo } from '../../types';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Obtiene y verifica información de un pago
   */
  async getAndVerifyPayment(paymentId: string, config: ConfigType): Promise<PaymentInfo> {
    const gateway = strapi.service('plugin::strapi-mercadopago.mercadopago-gateway');

    strapi.log.info('Fetching payment information', { paymentId });

    const paymentData = await gateway.getPayment(
      paymentId,
      config.mercadoPagoToken
    );

    const {
      status,
      additional_info,
      external_reference: orderId,
      payment_type_id,
    } = paymentData;

    const items = additional_info?.items || [];

    return {
      paymentId,
      status,
      orderId,
      paymentTypeId: payment_type_id || '',
      items,
      rawData: paymentData,
    };
  },
});
