# 📘 Plan de Migración: Service Layer Pattern

## 🎯 Objetivo

Refactorizar el plugin MercadoPago hacia una arquitectura **Service Layer Pattern** que garantice:

- ✅ **Separación de responsabilidades** (Controllers delgados, Services enfocados)
- ✅ **Mantenibilidad** (Archivos pequeños <100 líneas)
- ✅ **Testabilidad** (Services fáciles de mockear)
- ✅ **Integración natural con Strapi** (Uso de factories y Entity Service)

**Tiempo estimado:** 4 semanas
**Prerrequisito:** Haber completado `FIXES_CRITICOS_SEGURIDAD.md`

---

## 📊 Estado Actual vs Objetivo

### ❌ Antes

```
server/src/
├── controllers/
│   ├── checkout.ts (78 líneas - lógica mezclada)
│   ├── notification.ts (40 líneas)
│   └── ...
├── services/
│   ├── sdk.ts (218 líneas - DIOS OBJETO)
│   │   ├── parserProducts()
│   │   ├── parserCustomer()
│   │   ├── createPreference()
│   │   └── paymentAction() (100+ líneas)
│   ├── order.ts
│   └── product.ts
```

**Problemas:**
- `sdk.ts` hace demasiado (transformación + HTTP + DB)
- Controllers con lógica de negocio
- Difícil de testear
- Violación de SRP (Single Responsibility Principle)

### ✅ Después (Service Layer)

```
server/src/
├── controllers/              # DELGADOS (20-30 líneas)
│   ├── checkout.controller.ts
│   ├── payment.controller.ts
│   └── product.controller.ts
│
├── services/                 # RESPONSABILIDAD ÚNICA (<60 líneas)
│   ├── checkout/
│   │   ├── checkout.service.ts
│   │   ├── preference.service.ts
│   │   └── order-creation.service.ts
│   │
│   ├── payment/
│   │   ├── payment-notification.service.ts
│   │   ├── payment-verification.service.ts
│   │   └── stock-reduction.service.ts
│   │
│   ├── product/
│   │   └── product.service.ts
│   │
│   └── external/             # Abstracción de APIs
│       └── mercadopago.gateway.ts
│
├── validators/               # Validación (ya implementado en FIXES)
│   ├── checkout.validator.ts
│   └── payment.validator.ts
│
├── helpers/                  # Funciones puras
│   ├── pricing.helper.ts
│   └── currency.helper.ts
│
└── types/
    └── ...
```

---

## 📅 Cronograma de Implementación

### Semana 1: Preparación y Gateway
- Crear estructura de carpetas
- Extraer gateway de MercadoPago
- Refactorizar helpers existentes

### Semana 2: Services de Checkout
- Separar lógica de checkout
- Crear services específicos
- Adelgazar controller de checkout

### Semana 3: Services de Payment
- Separar lógica de webhooks
- Implementar services de payment
- Adelgazar controller de notification

### Semana 4: Testing y Refinamiento
- Tests unitarios de services
- Tests de integración
- Documentación

---

## 🔧 Implementación Paso a Paso

## SEMANA 1: Preparación y Gateway

### Día 1-2: Crear Estructura de Carpetas

```bash
cd server/src

# Crear nuevas carpetas
mkdir -p services/checkout
mkdir -p services/payment
mkdir -p services/product
mkdir -p services/external
mkdir -p helpers

# Ya tienes validators/ del fix de seguridad
```

### Día 3-5: Extraer MercadoPago Gateway

**Crear:** `server/src/services/external/mercadopago.gateway.ts`

```typescript
/**
 * Gateway para MercadoPago API
 * Responsabilidad: Abstracción del SDK de MercadoPago
 */
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { v4 as uuidv4 } from 'uuid';
import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Crea un cliente de MercadoPago configurado
   */
  createClient(accessToken: string) {
    return new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 10000,
        idempotencyKey: uuidv4(),
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
  formatProductsForPreference(products: any[], currencyId: string) {
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
  formatCustomerForPreference(customer: any, fulfillment: any, countryConfig: any) {
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
```

**Registrar en:** `server/src/index.ts`

```typescript
import mercadopagoGateway from './services/external/mercadopago.gateway';

export default {
  // ...
  services: {
    // ... otros services
    'mercadopago-gateway': mercadopagoGateway,
  },
  // ...
};
```

### Día 5: Refactorizar Helpers Existentes

**Mover:** `server/src/helpers/index.ts` → Separar en archivos

**Crear:** `server/src/helpers/pricing.helper.ts`

```typescript
/**
 * Helpers puros para cálculos de pricing
 * NO tienen side effects, solo transforman datos
 */

export interface PricingSummary {
  fullPrice: number;
  fullPriceDiscount: number;
  totalDiscounted: number;
  finalPrice: number;
}

/**
 * Calcula el resumen de precio de un producto
 */
export function calculateProductPricing(product: any): PricingSummary {
  const { quantity = 1, price, promotion } = product;
  const { price_with_discount = 0, with_discount = false } = promotion || {};

  const fullPrice = price * quantity;
  const fullPriceDiscount = with_discount
    ? (price_with_discount || 0) * quantity
    : fullPrice;
  const totalDiscounted = fullPrice - fullPriceDiscount;
  const finalPrice = fullPrice - totalDiscounted;

  return {
    fullPrice,
    fullPriceDiscount,
    totalDiscounted,
    finalPrice,
  };
}

/**
 * Calcula el resumen de precio para múltiples productos
 */
export function calculateCartPricing(products: any[]) {
  const pricingInfo = products.map((product) => ({
    ...product,
    ...calculateProductPricing(product),
  }));

  const totalFullPrice = pricingInfo.reduce(
    (acc, item) => acc + item.fullPrice,
    0
  );

  const totalFullPriceDiscount = pricingInfo.reduce(
    (acc, item) => acc + item.fullPriceDiscount,
    0
  );

  const totalDiscounted = pricingInfo.reduce(
    (acc, item) => acc + item.totalDiscounted,
    0
  );

  const total = totalFullPrice - totalDiscounted;

  return {
    totalFullPrice,
    totalFullPriceDiscount,
    totalDiscounted,
    total,
    items: pricingInfo,
  };
}
```

**Crear:** `server/src/helpers/currency.helper.ts`

```typescript
/**
 * Helpers para manejo de monedas
 */

export const SUPPORTED_CURRENCIES = ['COP', 'USD', 'ARS', 'BRL', 'MXN'] as const;

export type Currency = typeof SUPPORTED_CURRENCIES[number];

export function validateCurrency(currency: string): boolean {
  return SUPPORTED_CURRENCIES.includes(currency as Currency);
}

export function formatAmount(amount: number, currency: Currency = 'COP'): string {
  return `${currency} ${amount.toFixed(2)}`;
}
```

---

## SEMANA 2: Services de Checkout

### Día 1-2: Service de Creación de Preferencias

**Crear:** `server/src/services/checkout/preference.service.ts`

```typescript
/**
 * Preference Service
 * Responsabilidad: Crear preferencias de pago en MercadoPago
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'plugin::strapi-mercadopago.order',
  ({ strapi }) => ({
    /**
     * Crea una preferencia de pago en MercadoPago
     */
    async createPaymentPreference(order: any, products: any[], customer: any, fulfillment: any, config: any) {
      const gateway = strapi.service('plugin::strapi-mercadopago.mercadopago-gateway');

      // Formatear productos
      const formattedProducts = gateway.formatProductsForPreference(
        products,
        config.defaultCurrency
      );

      // Formatear cliente
      const formattedCustomer = gateway.formatCustomerForPreference(
        customer,
        fulfillment,
        config.countryConfig || { areaCode: '57', identificationType: 'CC' }
      );

      // Construir datos de preferencia
      const preferenceData = {
        external_reference: order.id.toString(),
        items: formattedProducts,
        payer: formattedCustomer,
        back_urls: {
          success: config.backUrls,
          failure: config.backUrls,
          pending: config.backUrls,
        },
        notification_url: config.notificationUrl,
        binary_mode: true,
        payment_methods: {
          installments: config.maxInstallments || 12,
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
        collectorId: preference.collector_id?.toString(),
      };
    },
  })
);
```

### Día 2-3: Service de Creación de Órdenes

**Crear:** `server/src/services/checkout/order-creation.service.ts`

```typescript
/**
 * Order Creation Service
 * Responsabilidad: Crear y actualizar órdenes
 */
import { factories } from '@strapi/strapi';
import { INVOICES_STATUS, SHIPPING_STATUS } from '../../constants';
import { calculateCartPricing } from '../../helpers/pricing.helper';

export default factories.createCoreService(
  'plugin::strapi-mercadopago.order',
  ({ strapi }) => ({
    /**
     * Crea una orden inicial con status INITIAL
     */
    async createInitialOrder(data: any) {
      const { products, customer, fulfillment } = data;

      // Calcular totales
      const { total, totalDiscounted } = calculateCartPricing(products);

      try {
        const order = await strapi.entityService.create(
          'plugin::strapi-mercadopago.order',
          {
            data: {
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
            },
          }
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
    async updateWithPaymentLink(orderId: string | number, preferenceData: any) {
      try {
        const updatedOrder = await strapi.entityService.update(
          'plugin::strapi-mercadopago.order',
          orderId,
          {
            data: {
              payment_status: INVOICES_STATUS.IN_PROCESS,
              payment_link: preferenceData.initPoint,
              preference_id: preferenceData.id,
              collector_id: preferenceData.collectorId,
            },
          }
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
  })
);
```

### Día 3-4: Service Principal de Checkout (Orquestador)

**Crear:** `server/src/services/checkout/checkout.service.ts`

```typescript
/**
 * Checkout Service (Orchestrator)
 * Responsabilidad: Orquestar el flujo completo de checkout
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'plugin::strapi-mercadopago.order',
  ({ strapi }) => ({
    /**
     * Procesa un checkout completo
     */
    async processCheckout(data: any, config: any) {
      const { items, customer, fulfillment } = data;

      strapi.log.info('Processing checkout', {
        itemsCount: items.length,
        customerEmail: customer.email,
      });

      // 1. Obtener y validar productos
      const products = await strapi
        .service('plugin::strapi-mercadopago.product')
        .validateAndGetProducts(items);

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
  })
);
```

### Día 4-5: Actualizar Product Service

**Modificar:** `server/src/services/product/product.service.ts`

```typescript
/**
 * Product Service
 * Responsabilidad: Operaciones relacionadas con productos
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'plugin::strapi-mercadopago.product',
  ({ strapi }) => ({
    /**
     * Valida y obtiene productos por SKU
     * Verifica disponibilidad de stock
     */
    async validateAndGetProducts(items: Array<{ sku: string; quantity: number }>) {
      const attributes = [
        'id',
        'name',
        'price',
        'short_description',
        'slug',
        'stock',
        'sku',
      ];

      const skuList = items.map(({ sku }) => ({ sku }));

      const results = await strapi.db
        .query('plugin::strapi-mercadopago.product')
        .findMany({
          select: attributes,
          where: { $or: skuList },
          populate: ['pictures', 'promotion', 'categories'],
        });

      if (results.length === 0) {
        throw new Error('No products found');
      }

      if (results.length !== items.length) {
        throw new Error('Some products not found');
      }

      // Validar stock y agregar cantidad solicitada
      return results.map((product) => {
        const requestedItem = items.find(({ sku }) => sku === product.sku);

        if (!requestedItem) {
          throw new Error(`Product ${product.sku} not in request`);
        }

        if (requestedItem.quantity > product.stock) {
          throw new Error(
            `Insufficient stock for ${product.sku}. Available: ${product.stock}, Requested: ${requestedItem.quantity}`
          );
        }

        return {
          ...product,
          quantity: requestedItem.quantity,
          // No exponer stock al cliente
          stock: undefined,
        };
      });
    },
  })
);
```

### Día 5: Adelgazar Controller de Checkout

**Modificar:** `server/src/controllers/checkout.controller.ts`

```typescript
/**
 * Checkout Controller
 * Responsabilidad: Validar entrada y delegar a services
 */
import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async checkout(ctx) {
    const config = ctx.state.config;
    const validatedData = ctx.state.validated; // Ya validado por middleware

    try {
      // Delegar todo a checkout service
      const result = await strapi
        .service('plugin::strapi-mercadopago.checkout')
        .processCheckout(validatedData, config);

      return ctx.send(result);
    } catch (error) {
      strapi.log.error('Checkout failed', {
        error: error.message,
        customerEmail: validatedData.customer?.email,
      });

      return ctx.badRequest(error.message);
    }
  },
});
```

---

## SEMANA 3: Services de Payment

### Día 1-2: Service de Verificación de Pagos

**Crear:** `server/src/services/payment/payment-verification.service.ts`

```typescript
/**
 * Payment Verification Service
 * Responsabilidad: Verificar y obtener datos de pagos desde MercadoPago
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'plugin::strapi-mercadopago.order',
  ({ strapi }) => ({
    /**
     * Obtiene y verifica información de un pago
     */
    async getAndVerifyPayment(paymentId: string, config: any) {
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
        paymentTypeId: payment_type_id,
        items,
        rawData: paymentData,
      };
    },
  })
);
```

### Día 2-3: Service de Reducción de Stock

**Crear:** `server/src/services/payment/stock-reduction.service.ts`

```typescript
/**
 * Stock Reduction Service
 * Responsabilidad: Reducir stock de productos tras pago aprobado
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'plugin::strapi-mercadopago.product',
  ({ strapi }) => ({
    /**
     * Reduce el stock de múltiples productos de forma atómica
     * Debe ejecutarse dentro de una transacción
     */
    async reduceStock(items: Array<{ id: string; quantity: number }>, trx?: any) {
      const query = trx
        ? trx.query.bind(trx)
        : strapi.db.query.bind(strapi.db);

      for (const item of items) {
        // Operación atómica: reduce stock solo si hay suficiente
        const result = await query('plugin::strapi-mercadopago.product')
          .updateMany({
            where: {
              sku: item.id,
              stock: { $gte: item.quantity },
            },
            data: {
              stock: strapi.db.connection.raw('stock - ?', [item.quantity]),
            },
          });

        if (!result || result === 0) {
          strapi.log.error('Failed to reduce stock', {
            sku: item.id,
            quantity: item.quantity,
          });
          throw new Error(`Failed to reduce stock for ${item.id}`);
        }

        strapi.log.info('Stock reduced successfully', {
          sku: item.id,
          quantityReduced: item.quantity,
        });
      }
    },
  })
);
```

### Día 3-5: Service de Notificaciones de Pago

**Crear:** `server/src/services/payment/payment-notification.service.ts`

```typescript
/**
 * Payment Notification Service
 * Responsabilidad: Procesar notificaciones de pago (webhooks)
 */
import { factories } from '@strapi/strapi';
import { INVOICES_STATUS } from '../../constants';

export default factories.createCoreService(
  'plugin::strapi-mercadopago.order',
  ({ strapi }) => ({
    /**
     * Procesa una notificación de pago de MercadoPago
     */
    async processPaymentNotification(payload: any, config: any) {
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

      // 3. Verificar idempotencia
      const idempotencyKey = `payment-${paymentId}-${status}-${orderId}`;

      await strapi.db.transaction(async (trx) => {
        // Intentar crear evento (fallará si ya existe)
        try {
          await trx.query('plugin::strapi-mercadopago.payment-event').create({
            data: {
              payment_id: paymentId,
              event_type: 'payment.update',
              status,
              idempotency_key: idempotencyKey,
              processed_at: new Date(),
              webhook_data: paymentInfo.rawData,
            },
          });
        } catch (error) {
          // Ya procesado
          if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
            strapi.log.warn('Payment already processed (idempotent)', {
              paymentId,
              orderId,
            });
            return;
          }
          throw error;
        }

        // 4. Actualizar orden
        await trx.query('plugin::strapi-mercadopago.order').update({
          where: { id: orderId },
          data: {
            payment_status: status,
            paid_with: paymentTypeId,
          },
        });

        // 5. Si aprobado, reducir stock
        if (status === INVOICES_STATUS.APPROVED) {
          await strapi
            .service('plugin::strapi-mercadopago.stock-reduction')
            .reduceStock(items, trx);
        }

        strapi.log.info('Payment notification processed successfully', {
          paymentId,
          orderId,
          status,
        });
      });
    },
  })
);
```

### Día 5: Adelgazar Controller de Notification

**Modificar:** `server/src/controllers/notification.controller.ts`

```typescript
/**
 * Notification Controller (Webhook Handler)
 * Responsabilidad: Recibir webhooks y delegar procesamiento
 */
import type { Core } from '@strapi/strapi';
import { NOTIFICATION_TYPES } from '../constants';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async notification(ctx) {
    const payload = ctx.request.body;
    const config = ctx.state.config;
    const { type = '', action = '' } = payload;

    strapi.log.info('Webhook received', { type, action });

    try {
      switch (type) {
        case NOTIFICATION_TYPES.PAYMENT:
          await strapi
            .service('plugin::strapi-mercadopago.payment-notification')
            .processPaymentNotification(payload, config);

          return ctx.send({ message: 'Webhook processed successfully' }, 200);

        default:
          strapi.log.info('Webhook type not handled', { type });
          return ctx.send({ message: 'Webhook received but not processed' }, 200);
      }
    } catch (error) {
      strapi.log.error('Failed to process webhook', {
        error: error.message,
        type,
        action,
      });

      // Retornar 200 para que MercadoPago no reintente
      return ctx.send({ message: 'Webhook received with errors' }, 200);
    }
  },
});
```

---

## SEMANA 4: Testing y Refinamiento

### Día 1-2: Tests Unitarios de Services

**Crear:** `server/src/services/checkout/__tests__/checkout.service.test.ts`

```typescript
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('Checkout Service', () => {
  let strapi: any;
  let checkoutService: any;

  beforeEach(() => {
    // Mock strapi
    strapi = {
      service: jest.fn((name) => {
        if (name.includes('product')) {
          return {
            validateAndGetProducts: jest.fn().mockResolvedValue([
              { sku: 'TEST-001', quantity: 2, price: 1000 },
            ]),
          };
        }
        if (name.includes('order-creation')) {
          return {
            createInitialOrder: jest.fn().mockResolvedValue({ id: 1 }),
            updateWithPaymentLink: jest.fn().mockResolvedValue({ id: 1 }),
          };
        }
        if (name.includes('preference')) {
          return {
            createPaymentPreference: jest.fn().mockResolvedValue({
              id: 'PREF-123',
              initPoint: 'https://mp.com/checkout/123',
              collectorId: '456',
            }),
          };
        }
      }),
      log: {
        info: jest.fn(),
        error: jest.fn(),
      },
    };

    // Importar service con strapi mockeado
    const serviceFactory = require('../checkout.service').default;
    checkoutService = serviceFactory({ strapi }).processCheckout;
  });

  it('should process checkout successfully', async () => {
    const data = {
      items: [{ sku: 'TEST-001', quantity: 2 }],
      customer: {
        name: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        dni: '123456789',
        phone: '3001234567',
      },
      fulfillment: {
        address: 'Test St 123',
        city: 'Bogotá',
        department: 'Cundinamarca',
      },
    };

    const config = {
      mercadoPagoToken: 'test-token',
      defaultCurrency: 'COP',
    };

    const result = await checkoutService(data, config);

    expect(result).toBeDefined();
    expect(result.orderId).toBe(1);
    expect(result.preferenceId).toBe('PREF-123');
    expect(result.paymentUrl).toBe('https://mp.com/checkout/123');
  });
});
```

### Día 2-3: Tests de Integración

**Crear:** `server/src/__tests__/integration/checkout.integration.test.ts`

```typescript
import { setupStrapi, cleanupStrapi } from '../helpers/strapi';

describe('Checkout Integration Tests', () => {
  beforeAll(async () => {
    await setupStrapi();
  });

  afterAll(async () => {
    await cleanupStrapi();
  });

  it('should create order and preference end-to-end', async () => {
    // Test real con Strapi
    // ...
  });
});
```

### Día 3-4: Actualizar Registro de Services

**Modificar:** `server/src/index.ts`

```typescript
// Services
import checkoutService from './services/checkout/checkout.service';
import preferenceService from './services/checkout/preference.service';
import orderCreationService from './services/checkout/order-creation.service';
import paymentNotificationService from './services/payment/payment-notification.service';
import paymentVerificationService from './services/payment/payment-verification.service';
import stockReductionService from './services/payment/stock-reduction.service';
import productService from './services/product/product.service';
import mercadopagoGateway from './services/external/mercadopago.gateway';

// ... imports de controllers, routes, etc.

export default {
  register,
  bootstrap,
  destroy,
  config,
  controllers: {
    checkout: checkoutController,
    notification: notificationController,
    // ... otros controllers
  },
  routes: {
    // ... routes
  },
  services: {
    // Checkout
    checkout: checkoutService,
    preference: preferenceService,
    'order-creation': orderCreationService,

    // Payment
    'payment-notification': paymentNotificationService,
    'payment-verification': paymentVerificationService,
    'stock-reduction': stockReductionService,

    // Product
    product: productService,

    // External
    'mercadopago-gateway': mercadopagoGateway,

    // ... otros services
  },
  contentTypes: {
    // ... content types
  },
  policies: {
    // ... policies
  },
  middlewares: {
    // ... middlewares
  },
};
```

### Día 4: Eliminar Código Antiguo

**Eliminar/Deprecar:**

```bash
# Eliminar sdk.ts antiguo
rm server/src/services/sdk.ts

# Mover helpers a nueva estructura
# Ya se hizo en Semana 1

# Verificar que no hay imports a archivos eliminados
grep -r "sdk.ts" server/src/
```

### Día 5: Documentación

**Crear:** `server/src/services/README.md`

```markdown
# Services Architecture

## Estructura

### Checkout Services
- `checkout.service.ts` - Orquestador principal del flujo de checkout
- `preference.service.ts` - Creación de preferencias de pago
- `order-creation.service.ts` - Creación y actualización de órdenes

### Payment Services
- `payment-notification.service.ts` - Procesamiento de webhooks de pago
- `payment-verification.service.ts` - Verificación de pagos en MercadoPago
- `stock-reduction.service.ts` - Reducción atómica de stock

### Product Services
- `product.service.ts` - Operaciones con productos

### External Services
- `mercadopago.gateway.ts` - Abstracción del SDK de MercadoPago

## Uso

### Ejemplo: Procesar Checkout

```typescript
const result = await strapi
  .service('plugin::strapi-mercadopago.checkout')
  .processCheckout(data, config);
```

### Ejemplo: Procesar Webhook

```typescript
await strapi
  .service('plugin::strapi-mercadopago.payment-notification')
  .processPaymentNotification(payload, config);
```
```

---

## ✅ Checklist de Migración

### Semana 1: Preparación
- [ ] Crear estructura de carpetas
- [ ] Crear `mercadopago.gateway.ts`
- [ ] Refactorizar helpers (pricing, currency)
- [ ] Registrar gateway en index.ts
- [ ] Probar gateway aisladamente

### Semana 2: Checkout
- [ ] Crear `preference.service.ts`
- [ ] Crear `order-creation.service.ts`
- [ ] Crear `checkout.service.ts` (orquestador)
- [ ] Actualizar `product.service.ts`
- [ ] Adelgazar `checkout.controller.ts`
- [ ] Probar flujo de checkout completo

### Semana 3: Payment
- [ ] Crear `payment-verification.service.ts`
- [ ] Crear `stock-reduction.service.ts`
- [ ] Crear `payment-notification.service.ts`
- [ ] Adelgazar `notification.controller.ts`
- [ ] Probar procesamiento de webhooks

### Semana 4: Testing
- [ ] Tests unitarios de cada service
- [ ] Tests de integración
- [ ] Actualizar `index.ts` con todos los services
- [ ] Eliminar `sdk.ts` antiguo
- [ ] Documentar services
- [ ] Code review completo

---

## 🧪 Testing

### Tests Unitarios

```bash
npm run test:unit

# O individual
npm test -- checkout.service.test.ts
```

### Tests de Integración

```bash
npm run test:integration
```

### Coverage

```bash
npm run test:coverage

# Objetivo: >80% coverage
```

---

## 📊 Métricas de Éxito

### Antes
- ❌ `sdk.ts`: 218 líneas
- ❌ Múltiples responsabilidades
- ❌ Difícil de testear
- ❌ Acoplamiento alto

### Después
- ✅ Archivos <60 líneas cada uno
- ✅ Responsabilidad única
- ✅ Fácil de testear
- ✅ Bajo acoplamiento
- ✅ >80% test coverage

---

## 🚀 Próximos Pasos

Después de completar esta migración:

1. **Optimizaciones opcionales:**
   - Implementar cache de productos
   - Agregar queue para webhooks
   - Implementar circuit breaker para MercadoPago API

2. **Mejoras de observabilidad:**
   - Agregar métricas (tiempo de checkout, tasa de éxito)
   - Implementar tracing distribuido
   - Dashboard de monitoreo

3. **Features adicionales:**
   - Soporte multi-país
   - Múltiples gateways de pago
   - Reembolsos automatizados

---

## ❓ FAQ

### ¿Puedo migrar gradualmente?

Sí, puedes mantener `sdk.ts` mientras migras los services. Cambia los controllers uno a uno.

### ¿Cómo testeo sin afectar MercadoPago real?

Usa mocks del gateway en tests. El gateway es la única pieza que habla con MercadoPago.

### ¿Qué pasa si falla un service?

Cada service lanza errores que son manejados en el controller. Los logs estructurados ayudan a debuggear.

### ¿Necesito cambiar la base de datos?

No, solo el código. La estructura de datos permanece igual.

---

## 📖 Referencias

- [Strapi Services Documentation](https://docs.strapi.io/dev-docs/backend-customization/services)
- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle)
