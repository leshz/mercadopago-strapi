/**
 * Product Service
 * Responsabilidad: Operaciones relacionadas con productos
 */
import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import type { ProductItem } from '../../types';

export default factories.createCoreService(
  'plugin::strapi-mercadopago.product',
  ({ strapi }) => ({
    /**
     * Valida y obtiene productos por SKU
     * Verifica disponibilidad de stock
     */
    async getProducts(items: ProductItem[]) {
      const attributes = [
        'id',
        'name',
        'price',
        'short_description',
        'slug',
        'stock',
        'sku',
      ];

      if (!strapi.db) {
        throw new errors.ApplicationError('Database service not available');
      }

      const skuList = items.map(({ sku }) => ({ sku }));

      const results: any[] = await strapi.db
        .query('plugin::strapi-mercadopago.product')
        .findMany({
          select: attributes,
          where: { $or: skuList },
          populate: ['pictures', 'promotion', 'categories'],
        });

      if (results.length === 0) {
        throw new errors.ApplicationError('Products are not available');
      }

      if (results.length !== items.length) {
        const foundSkus = results.map(p => p.sku);
        const missingSkus = items.filter(i => !foundSkus.includes(i.sku)).map(i => i.sku);
        throw new errors.ApplicationError('Some products not found', {
          missingSkus,
        });
      }

      // Validar stock y agregar cantidad solicitada
      return results.map((product) => {
        const requestedItem = items.find(({ sku }) => sku === product.sku);

        if (!requestedItem) {
          throw new errors.ApplicationError(`Product ${product.sku} not in request`);
        }

        if (requestedItem.quantity > product.stock) {
          throw new errors.ApplicationError('Stock not available', {
            product: product.sku,
            stock: product.stock,
            requested: requestedItem.quantity,
          });
        }

        return {
          ...product,
          quantity: requestedItem.quantity,
          // No exponer stock al cliente
          stock: null,
        };
      });
    },
  })
);
