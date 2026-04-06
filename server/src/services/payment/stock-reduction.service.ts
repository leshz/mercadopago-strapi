/**
 * Stock Reduction Service
 * Responsabilidad: Reducir stock de productos tras pago aprobado
 */
import type { Core } from '@strapi/strapi';
import type { StockItem } from '../../types';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Reduce el stock de múltiples productos de forma atómica
   * Usa transacción para evitar race conditions
   */
  async reduceStock(items: StockItem[]) {
    await strapi.db.transaction(async () => {
      for (const item of items) {
        const quantity = Number(item.quantity);

        const product = await strapi.db
          .query('plugin::strapi-mercadopago.product')
          .findOne({
            where: { sku: item.id },
          });

        if (!product) {
          strapi.log.warn('Product not found for stock reduction', {
            sku: item.id,
          });
          continue;
        }

        const newStock = Number(product.stock) - quantity;

        if (newStock < 0) {
          strapi.log.error('Insufficient stock for reduction', {
            sku: item.id,
            currentStock: product.stock,
            requested: quantity,
          });
          throw new Error(`Insufficient stock for ${item.id}`);
        }

        await strapi.db
          .query('plugin::strapi-mercadopago.product')
          .update({
            where: { sku: item.id },
            data: { stock: newStock },
          });

        strapi.log.info('Stock reduced successfully', {
          sku: item.id,
          previousStock: product.stock,
          newStock,
          quantityReduced: quantity,
        });
      }
    });
  },
});
