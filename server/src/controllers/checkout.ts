/**
 * Checkout Controller
 * Responsabilidad: Recibir datos validados y delegar a services
 */
import type { Core } from '@strapi/strapi';
import type { ConfigType } from '../types';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async checkout(ctx) {
    const { config }: { config: ConfigType } = ctx.state;
    // Datos ya validados y sanitizados por el middleware validateCheckout
    const { items, customer, fulfillment } = ctx.state.validated;

    try {
      const result = await strapi
        .service('plugin::strapi-mercadopago.checkout')
        .processCheckout({ items, customer, fulfillment }, config);

      return ctx.send({
        init_point: result.paymentUrl,
        preferenceId: result.preferenceId,
        collector_id: result.collectorId,
        invoiceId: result.orderId,
      });
    } catch (error) {
      strapi.log.error('Checkout failed', {
        error: error.message,
        customerEmail: customer?.email,
      });

      return ctx.badRequest(error.message);
    }
  },
});
