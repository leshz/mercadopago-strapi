/**
 * Order Creation Service
 * Responsabilidad: Crear y actualizar órdenes
 */
import type { Core } from '@strapi/strapi';
import type { OrderData, PreferenceData } from '../../types';
import { INVOICES_STATUS, SHIPPING_STATUS } from '../../constants';
import { calculateCartPricing } from '../../helpers/pricing.helper';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Crea una orden inicial con status INITIAL
   */
  async createInitialOrder(data: OrderData) {
    const { products, customer, fulfillment } = data;

    // Calcular totales
    const { total, totalDiscounted } = calculateCartPricing(products);

    try {
      const orderData = {
        payment_status: INVOICES_STATUS.INITIAL,
        shipping_status: SHIPPING_STATUS.INITIAL,
        total,
        total_discount: totalDiscounted,
        products,
        payment_link: '',
        customer: {
          ...customer,
          last_name: customer.lastName,
        },
        fulfillment: {
          ...fulfillment,
          postal_code: fulfillment.postalCode || '',
        },
      };

      const order = await strapi.entityService.create(
        'plugin::strapi-mercadopago.order',
        { data: orderData as any }
      );

      strapi.log.info('Initial order created', {
        orderId: order.id,
        total,
      });

      return order;
    } catch (error) {
      strapi.log.error('Failed to create initial order', {
        error: error.message,
      });
      throw error;
    }
  },

  /**
   * Actualiza una orden con el link de pago
   */
  async updateWithPaymentLink(orderId: string | number, preferenceData: PreferenceData) {
    try {
      const updateData = {
        payment_status: INVOICES_STATUS.IN_PROCESS,
        payment_link: preferenceData.initPoint,
        preference_id: preferenceData.id,
        collector_id: preferenceData.collectorId,
      };

      const updatedOrder = await strapi.entityService.update(
        'plugin::strapi-mercadopago.order',
        orderId,
        { data: updateData as any }
      );

      strapi.log.info('Order updated with payment link', {
        orderId,
        preferenceId: preferenceData.id,
      });

      return updatedOrder;
    } catch (error) {
      strapi.log.error('Failed to update order with payment link', {
        error: error.message,
        orderId,
      });
      throw error;
    }
  },
});
