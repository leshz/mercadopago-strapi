# Arquitecturas Pragmáticas para Plugin MercadoPago Strapi

## Problema con Clean Architecture Pura

La propuesta de Clean Architecture completa (domain/application/infrastructure/presentation) genera **fricción excesiva** con Strapi:

### ❌ Problemas Identificados

1. **Duplicación de Conceptos**
   - Strapi ya tiene Services → Clean Architecture propone Domain Services
   - Strapi ya tiene Controllers → Clean Architecture propone Use Cases
   - Genera confusión sobre dónde poner cada cosa

2. **Complejidad Innecesaria**
   - 4 capas para un plugin relativamente simple
   - Mappers entre cada capa (DTO → Entity → Persistence)
   - DI Container cuando Strapi ya tiene su propio sistema

3. **Pérdida de Features de Strapi**
   - Factories (`createCoreService`, `createCoreController`)
   - Entity Service API
   - Plugin extension system
   - Lifecycles y hooks

4. **Overhead de Desarrollo**
   - Más código para mantener
   - Curva de aprendizaje más alta
   - Migraciones complejas

---

## 🎯 Arquitecturas Alternativas Recomendadas

### Opción 1: Service Layer Pattern Mejorado (⭐ RECOMENDADA)

**Filosofía:** Trabajar CON Strapi, no CONTRA Strapi.

#### Estructura Propuesta

```
server/src/
├── controllers/           # Controllers DELGADOS (solo validación + delegación)
│   ├── checkout.controller.ts
│   ├── payment.controller.ts
│   └── product.controller.ts
│
├── services/             # Services con SINGLE RESPONSIBILITY
│   ├── checkout/         # ✅ Agrupado por feature
│   │   ├── checkout.service.ts          # Orquestación del checkout
│   │   ├── preference.service.ts        # Creación de preferencias MP
│   │   └── order-creation.service.ts    # Creación de órdenes
│   │
│   ├── payment/
│   │   ├── payment-notification.service.ts  # Procesamiento de webhooks
│   │   ├── payment-verification.service.ts  # Verificación de pagos
│   │   └── stock-reduction.service.ts       # Reducción de stock
│   │
│   ├── product/
│   │   └── product.service.ts           # Queries de productos
│   │
│   └── external/         # ✅ Abstracción de APIs externas
│       └── mercadopago.gateway.ts       # Wrapper de MercadoPago SDK
│
├── validators/           # ✅ Validación de entrada
│   ├── checkout.validator.ts
│   └── payment.validator.ts
│
├── helpers/             # Utilidades puras (sin side effects)
│   ├── pricing.helper.ts
│   └── currency.helper.ts
│
├── middlewares/         # Middlewares existentes mejorados
│   ├── validation.middleware.ts    # Middleware genérico de validación
│   ├── config.middleware.ts
│   └── webhook-signature.middleware.ts
│
├── config/              # Configuración
│   ├── constants.ts
│   └── country-config.ts  # ✅ Configuración por país
│
└── types/               # TypeScript types
    └── ...
```

#### Ejemplo de Implementación

**1. Controller Delgado (Solo Orchestration)**

```typescript
// ✅ controllers/checkout.controller.ts
import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async checkout(ctx) {
    // 1. Los datos ya vienen validados del middleware
    const validatedData = ctx.state.validated;
    const config = ctx.state.config;

    try {
      // 2. Delegar a servicio (toda la lógica está aquí)
      const result = await strapi
        .service('plugin::strapi-mercadopago.checkout')
        .processCheckout(validatedData, config);

      // 3. Responder
      return ctx.send(result);
    } catch (error) {
      // El error handler middleware maneja esto
      throw error;
    }
  },
});
```

**2. Service con Responsabilidad Única**

```typescript
// ✅ services/checkout/checkout.service.ts
import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'plugin::strapi-mercadopago.order',
  ({ strapi }) => ({
    async processCheckout(data, config) {
      const { items, customer, fulfillment } = data;

      // 1. Obtener y validar productos
      const products = await strapi
        .service('plugin::strapi-mercadopago.product')
        .validateAndGetProducts(items);

      // 2. Crear orden inicial
      const order = await strapi
        .service('plugin::strapi-mercadopago.order-creation')
        .createInitialOrder({ products, customer, fulfillment });

      // 3. Crear preferencia en MercadoPago
      const preference = await strapi
        .service('plugin::strapi-mercadopago.preference')
        .createPaymentPreference(order, config);

      // 4. Actualizar orden con link de pago
      await strapi
        .service('plugin::strapi-mercadopago.order-creation')
        .updateWithPaymentLink(order.id, preference);

      return {
        orderId: order.id,
        paymentUrl: preference.init_point,
        preferenceId: preference.id,
      };
    },
  })
);
```

**3. Gateway para MercadoPago (Abstracción Externa)**

```typescript
// ✅ services/external/mercadopago.gateway.ts
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

export default ({ strapi }) => ({
  /**
   * Crea un cliente de MercadoPago
   */
  createClient(accessToken: string) {
    return new MercadoPagoConfig({
      accessToken,
      options: { timeout: 10000 },
    });
  },

  /**
   * Crea una preferencia de pago
   */
  async createPreference(client, data) {
    const preference = new Preference(client);

    try {
      return await preference.create({ body: data });
    } catch (error) {
      strapi.log.error('MercadoPago API Error', {
        service: 'createPreference',
        error: error.message,
      });
      throw new MercadoPagoError('Failed to create preference', error);
    }
  },

  /**
   * Obtiene información de un pago
   */
  async getPayment(client, paymentId: string) {
    const payment = new Payment(client);

    try {
      return await payment.get({ id: paymentId });
    } catch (error) {
      strapi.log.error('MercadoPago API Error', {
        service: 'getPayment',
        paymentId,
        error: error.message,
      });
      throw new MercadoPagoError('Failed to get payment', error);
    }
  },
});
```

**4. Validador con Yup**

```typescript
// ✅ validators/checkout.validator.ts
import * as yup from 'yup';

export const checkoutSchema = yup.object({
  items: yup.array()
    .of(
      yup.object({
        sku: yup.string().required().max(100),
        quantity: yup.number().integer().min(1).max(999).required(),
      })
    )
    .min(1)
    .required(),

  customer: yup.object({
    name: yup.string().required().max(200),
    lastName: yup.string().required().max(200),
    email: yup.string().email().required(),
    dni: yup.string().required().matches(/^[0-9]+$/),
    phone: yup.string().required().matches(/^[0-9]{7,15}$/),
  }).required(),

  fulfillment: yup.object({
    address: yup.string().required().max(500),
    city: yup.string().required().max(100),
    department: yup.string().required().max(100),
    postalCode: yup.string().optional().max(20),
  }).required(),
});

/**
 * Middleware de validación genérico
 */
export const validateRequest = (schema) => {
  return async (ctx, next) => {
    try {
      const validated = await schema.validate(ctx.request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      ctx.state.validated = validated;
      await next();
    } catch (error) {
      if (error.name === 'ValidationError') {
        return ctx.badRequest('Validation failed', {
          errors: error.errors,
        });
      }
      throw error;
    }
  };
};
```

**5. Route con Middleware de Validación**

```typescript
// ✅ routes/checkout.ts
import { validateRequest } from '../validators/checkout.validator';
import { checkoutSchema } from '../validators/checkout.validator';

export default [
  {
    method: 'POST',
    path: '/checkout',
    handler: 'checkout.checkout',
    config: {
      auth: true,
      middlewares: [
        'plugin::strapi-mercadopago.loadConfig',
        validateRequest(checkoutSchema), // ✅ Validación antes del controller
      ],
    },
  },
];
```

#### ✅ Ventajas de esta Arquitectura

1. **Trabaja CON Strapi**
   - Usa `createCoreService` factories
   - Aprovecha Entity Service API
   - Compatible con lifecycles

2. **Separación de Responsabilidades**
   - Controllers: Solo orquestación
   - Services: Lógica de negocio específica
   - Validators: Validación de entrada
   - Gateway: Abstracción de APIs externas

3. **Fácil de Testear**
   - Services pequeños y enfocados
   - Fácil mockear `strapi.service()`
   - Validators testeable con casos simples

4. **Bajo Overhead**
   - No requiere DI container
   - No requiere mappers complejos
   - Aprende rápidamente

5. **Escalable**
   - Agregar nuevos services es trivial
   - Refactorizar services grandes es simple
   - Organizados por feature

#### 📊 Comparación de Complejidad

| Aspecto | Clean Arch | Service Layer |
|---------|-----------|---------------|
| Capas | 4 | 2 (Controller → Service) |
| Archivos nuevos | ~30 | ~10 |
| Mappers | Múltiples | Ninguno |
| DI Setup | Requerido | No requerido |
| Curva aprendizaje | Alta | Baja |
| Fricción con Strapi | Alta | Mínima |

---

### Opción 2: Arquitectura por Features (Feature-Sliced Design Lite)

**Filosofía:** Organizar código por funcionalidad, no por tipo técnico.

#### Estructura Propuesta

```
server/src/
├── features/
│   ├── checkout/
│   │   ├── checkout.controller.ts
│   │   ├── checkout.service.ts
│   │   ├── checkout.validator.ts
│   │   ├── checkout.routes.ts
│   │   └── checkout.types.ts
│   │
│   ├── payment/
│   │   ├── payment-notification.controller.ts
│   │   ├── payment-notification.service.ts
│   │   ├── payment-webhook.middleware.ts
│   │   ├── payment.validator.ts
│   │   ├── payment.routes.ts
│   │   └── payment.types.ts
│   │
│   ├── product/
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   ├── product.middleware.ts
│   │   ├── product.routes.ts
│   │   └── product.types.ts
│   │
│   └── configuration/
│       ├── configuration.controller.ts
│       ├── configuration.service.ts
│       ├── configuration.policy.ts
│       ├── configuration.routes.ts
│       └── configuration.types.ts
│
├── shared/              # Código compartido entre features
│   ├── services/
│   │   └── mercadopago.gateway.ts
│   ├── helpers/
│   │   └── pricing.helper.ts
│   ├── errors/
│   │   └── domain-errors.ts
│   └── types/
│       └── common.types.ts
│
├── config/
│   └── constants.ts
│
└── index.ts            # Registra todas las features
```

#### Ejemplo de Feature Completa

```typescript
// ✅ features/checkout/checkout.service.ts
import { factories } from '@strapi/strapi';
import type { CheckoutRequest } from './checkout.types';

export default factories.createCoreService(
  'plugin::strapi-mercadopago.order',
  ({ strapi }) => ({
    async processCheckout(data: CheckoutRequest, config) {
      // Toda la lógica del checkout aquí
      // Puede usar shared services si es necesario

      const gateway = strapi.service('plugin::strapi-mercadopago.mercadopago-gateway');
      // ...
    },
  })
);

// ✅ features/checkout/checkout.controller.ts
export default ({ strapi }) => ({
  async checkout(ctx) {
    const validated = ctx.state.validated;

    const result = await strapi
      .service('plugin::strapi-mercadopago.checkout')
      .processCheckout(validated, ctx.state.config);

    return ctx.send(result);
  },
});

// ✅ features/checkout/checkout.validator.ts
import * as yup from 'yup';

export const checkoutSchema = yup.object({
  // ... esquema de validación
});

// ✅ features/checkout/checkout.routes.ts
import { validateRequest } from '../../shared/middlewares/validation';
import { checkoutSchema } from './checkout.validator';

export default [
  {
    method: 'POST',
    path: '/checkout',
    handler: 'checkout.checkout',
    config: {
      middlewares: [
        'plugin::strapi-mercadopago.loadConfig',
        validateRequest(checkoutSchema),
      ],
    },
  },
];

// ✅ features/checkout/checkout.types.ts
export interface CheckoutRequest {
  items: CheckoutItem[];
  customer: Customer;
  fulfillment: Fulfillment;
}
```

#### ✅ Ventajas

1. **Alta Cohesión**
   - Todo relacionado al checkout está junto
   - Fácil encontrar código relacionado
   - Cambios localizados

2. **Independencia de Features**
   - Cada feature es autocontenida
   - Fácil agregar/quitar features
   - Menos merge conflicts

3. **Escalable**
   - Agregar features nuevas es predecible
   - Cada feature puede tener su complejidad
   - Fácil paralelizar desarrollo

#### ❌ Desventajas

1. **Posible Duplicación**
   - Necesitas shared/ para código común
   - Riesgo de duplicar validaciones

2. **Más Archivos**
   - Cada feature tiene 4-5 archivos mínimo
   - Puede ser overwhelming al principio

---

### Opción 3: Hexagonal Lite (Solo Abstracciones Críticas)

**Filosofía:** Solo abstraer lo que realmente cambia (APIs externas).

#### Estructura Propuesta

```
server/src/
├── controllers/         # Controllers normales de Strapi
├── services/           # Services normales de Strapi
│   ├── checkout.service.ts
│   ├── payment.service.ts
│   └── product.service.ts
│
├── ports/              # ✅ SOLO interfaces de APIs externas
│   └── payment-gateway.port.ts
│
├── adapters/           # ✅ Implementaciones concretas
│   └── mercadopago.adapter.ts
│
├── validators/
├── middlewares/
└── types/
```

#### Ejemplo de Port & Adapter

```typescript
// ✅ ports/payment-gateway.port.ts
export interface IPaymentGateway {
  createPreference(data: PreferenceData): Promise<PreferenceResponse>;
  getPayment(paymentId: string): Promise<PaymentData>;
}

export interface PreferenceData {
  orderId: string;
  items: PaymentItem[];
  payer: PayerInfo;
  backUrls: string;
  notificationUrl: string;
}

// ✅ adapters/mercadopago.adapter.ts
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import type { IPaymentGateway } from '../ports/payment-gateway.port';

export class MercadoPagoAdapter implements IPaymentGateway {
  private client: MercadoPagoConfig;

  constructor(accessToken: string) {
    this.client = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 10000 },
    });
  }

  async createPreference(data: PreferenceData): Promise<PreferenceResponse> {
    const preference = new Preference(this.client);

    const response = await preference.create({
      body: {
        external_reference: data.orderId,
        items: data.items,
        payer: data.payer,
        back_urls: {
          success: data.backUrls,
          failure: data.backUrls,
          pending: data.backUrls,
        },
        notification_url: data.notificationUrl,
        binary_mode: true,
      },
    });

    return {
      id: response.id!,
      initPoint: response.init_point!,
      collectorId: response.collector_id!.toString(),
    };
  }

  async getPayment(paymentId: string): Promise<PaymentData> {
    const payment = new Payment(this.client);
    const response = await payment.get({ id: paymentId });

    return {
      id: response.id,
      status: response.status,
      externalReference: response.external_reference,
      items: response.additional_info?.items || [],
    };
  }
}

// ✅ Uso en Service
export default factories.createCoreService(
  'plugin::strapi-mercadopago.order',
  ({ strapi }) => ({
    async processCheckout(data, config) {
      // Inyectar adapter (puede ser mock en tests)
      const gateway: IPaymentGateway = new MercadoPagoAdapter(config.mercadoPagoToken);

      // Usar interface, no implementación directa
      const preference = await gateway.createPreference({
        orderId: order.id,
        items: products,
        payer: customer,
        backUrls: config.backUrls,
        notificationUrl: config.notificationUrl,
      });

      // ...
    },
  })
);
```

#### ✅ Ventajas

1. **Mínima Fricción**
   - Solo abstrae MercadoPago SDK
   - El resto es Strapi estándar

2. **Fácil Testing**
   - Mock solo el adapter
   - Test con gateway fake

3. **Flexibilidad Futura**
   - Cambiar a otro gateway de pago
   - Soporte múltiples gateways

#### ❌ Desventajas

1. **Limitado**
   - Solo abstrae APIs externas
   - No mejora organización interna

---

## 🏆 Recomendación Final

### Para Este Plugin: **Service Layer Pattern Mejorado** (Opción 1)

**Razones:**

1. ✅ **Balance perfecto** entre simplicidad y mantenibilidad
2. ✅ **Trabaja CON Strapi** aprovechando factories y Entity Service
3. ✅ **Suficiente separación** de responsabilidades sin complejidad excesiva
4. ✅ **Fácil de implementar** incrementalmente (migración gradual)
5. ✅ **Testeable** sin necesitar DI complejo
6. ✅ **Escalable** si el plugin crece

### Combinación Recomendada

```
Service Layer Pattern + Hexagonal Lite

✅ Controllers delgados
✅ Services por responsabilidad única
✅ Validators separados
✅ Gateway para MercadoPago (Port + Adapter)
✅ Helpers puros
```

---

## 📋 Plan de Migración Incremental

### Fase 1: Seguridad (Sin tocar arquitectura)
**Tiempo:** 1 semana

```
✅ Agregar validadores (checkout.validator.ts)
✅ Proteger endpoints de configuración
✅ Mover secretos a .env
✅ Middleware de validación genérico
```

### Fase 2: Separar Responsabilidades
**Tiempo:** 2 semanas

```
✅ Crear mercadopago.gateway.ts (abstraer SDK)
✅ Dividir sdk.ts en:
   - checkout.service.ts
   - payment-notification.service.ts
   - preference.service.ts
   - stock.service.ts
✅ Controllers delgados (solo delegación)
```

### Fase 3: Mejorar Transacciones
**Tiempo:** 1 semana

```
✅ Wrapper de transacciones
✅ Stock reduction atómico
✅ Idempotencia con tabla de eventos
```

### Fase 4: Testing
**Tiempo:** 2 semanas

```
✅ Tests unitarios de services
✅ Tests de integración
✅ Coverage >80%
```

**TOTAL: 6 semanas** (vs 12 semanas de Clean Architecture)

---

## 📝 Ejemplo Comparativo Final

### ❌ ANTES (sdk.ts monolítico)

```typescript
// 218 líneas, hace DEMASIADO
export default ({ strapi }) => ({
  parserProducts: async () => { /* ... */ },
  parserCustomer: async () => { /* ... */ },
  createPreference: async () => { /* ... */ },
  paymentAction: async () => { /* 100+ líneas */ },
});
```

### ✅ DESPUÉS (Service Layer)

```typescript
// ✅ checkout.service.ts (30 líneas)
export default factories.createCoreService('...order', ({ strapi }) => ({
  async processCheckout(data, config) {
    const products = await strapi.service('...product').validate(data.items);
    const order = await strapi.service('...order-creation').create({ products });
    const preference = await strapi.service('...preference').create(order, config);
    return { orderId: order.id, paymentUrl: preference.init_point };
  },
}));

// ✅ preference.service.ts (40 líneas)
export default ({ strapi }) => ({
  async create(order, config) {
    const gateway = strapi.service('...mercadopago-gateway');
    return await gateway.createPreference({ /* ... */ });
  },
});

// ✅ payment-notification.service.ts (50 líneas)
export default ({ strapi }) => ({
  async processNotification(payload, config) {
    const payment = await strapi.service('...mercadopago-gateway').getPayment(payload.id);
    await strapi.service('...stock').reduce(payment.items);
    await strapi.service('...order').updateStatus(payment.externalReference, payment.status);
  },
});

// ✅ mercadopago.gateway.ts (60 líneas)
export default ({ strapi }) => ({
  createClient(token) { /* ... */ },
  async createPreference(data) { /* ... */ },
  async getPayment(id) { /* ... */ },
});
```

**Beneficios:**
- ✅ Cada archivo <60 líneas (vs 218)
- ✅ Responsabilidad única
- ✅ Fácil de testear
- ✅ Fácil de entender
- ✅ Reutilizable
- ✅ Compatible con Strapi

---

## 🎯 Conclusión

**No necesitas Clean Architecture completa para tener código mantenible.**

Con **Service Layer Pattern mejorado** obtienes:
- 90% de los beneficios
- 30% de la complejidad
- 100% compatible con Strapi
- Migratable en 6 semanas (vs 12)

**Principios clave a seguir:**
1. Controllers delgados (solo validación + delegación)
2. Services con responsabilidad única (<100 líneas)
3. Validators separados (Yup schemas)
4. Gateway para abstraer MercadoPago SDK
5. Helpers puros sin side effects
6. Transacciones para operaciones críticas

**Esto es suficiente para un plugin mantenible, testeable y escalable.**
