# Plan de Mejoras: Arquitectura Limpia para Plugin MercadoPago Strapi

## Índice
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Análisis de Arquitectura Actual](#análisis-de-arquitectura-actual)
3. [Mejoras Críticas de Seguridad](#mejoras-críticas-de-seguridad)
4. [Refactorización según Arquitectura Limpia](#refactorización-según-arquitectura-limpia)
5. [Mejoras de Calidad y Mantenibilidad](#mejoras-de-calidad-y-mantenibilidad)
6. [Mejoras de Performance y Escalabilidad](#mejoras-de-performance-y-escalabilidad)
7. [Plan de Implementación](#plan-de-implementación)

---

## Resumen Ejecutivo

El plugin de MercadoPago para Strapi v5 es **funcionalmente operativo** pero presenta **vulnerabilidades críticas de seguridad** y **deudas técnicas** que comprometen su uso en producción. Este documento detalla 45+ mejoras organizadas por prioridad y basadas en principios de **Clean Architecture**, **SOLID** y mejores prácticas de **Node.js/TypeScript**.

### Estado Actual
- ✅ Integración funcional con MercadoPago SDK v2.2.0
- ✅ TypeScript con tipos definidos
- ✅ Estructura de plugin Strapi v5 estándar
- ❌ Vulnerabilidades de seguridad críticas
- ❌ Sin validación de entrada
- ❌ Sin pruebas unitarias/integración
- ❌ Acoplamiento fuerte entre capas
- ❌ Condiciones de carrera en transacciones

### Prioridades de Mejora
| Prioridad | Categoría | Issues | Impacto |
|-----------|-----------|---------|---------|
| 🔴 **CRÍTICA** | Seguridad | 8 | Producción no segura |
| 🟠 **ALTA** | Arquitectura | 12 | Deuda técnica significativa |
| 🟡 **MEDIA** | Calidad | 15 | Mantenibilidad reducida |
| 🔵 **BAJA** | Optimización | 10 | Mejoras incrementales |

---

## Análisis de Arquitectura Actual

### Estructura de Capas Actual

```
┌─────────────────────────────────────────────┐
│         CONTROLLERS (Interface)             │
│  checkout.ts, notification.ts, config.ts    │
└─────────────────┬───────────────────────────┘
                  │ (acoplamiento directo)
┌─────────────────▼───────────────────────────┐
│         SERVICES (Business Logic)           │
│  sdk.ts (218 líneas - Dios Objeto)         │
│  order.ts, product.ts                       │
└─────────────────┬───────────────────────────┘
                  │ (acceso directo a Strapi ORM)
┌─────────────────▼───────────────────────────┐
│         STRAPI ENTITY SERVICE                │
│         (Infraestructura + DB)               │
└─────────────────────────────────────────────┘
```

### Problemas Identificados

#### 1. Violación del Principio de Responsabilidad Única (SRP)
**Archivo:** `server/src/services/sdk.ts`

```typescript
// ❌ ANTES: Un servicio hace demasiado
export default ({ strapi }) => ({
  parserProducts(),      // Transformación de datos
  parserCustomer(),      // Transformación de datos
  createPreference(),    // Llamada a API externa
  paymentAction(),       // Lógica de negocio + DB + API
})
```

**Problemas:**
- 218 líneas en un solo archivo
- Mezcla transformación de datos, llamadas HTTP y lógica de negocio
- Imposible de testear unitariamente
- Difícil de mantener

#### 2. Violación del Principio de Inversión de Dependencias (DIP)
**Archivo:** `server/src/controllers/checkout.ts:17-19`

```typescript
// ❌ ANTES: Controller depende de implementaciones concretas
const rawProducts = await strapi
  .service("plugin::strapi-mercadopago.product")
  .getProducts(items);
```

**Problemas:**
- Acoplamiento directo a Strapi
- No se pueden inyectar mocks en tests
- Dificulta cambiar implementaciones

#### 3. Ausencia de Capa de Dominio
**Estado Actual:** No existen entidades de dominio, solo tipos TypeScript

```typescript
// ❌ ANTES: Tipos anémicos sin comportamiento
type buildedProduct = {
  id: number;
  name: string;
  price: number;
  // ... más campos
}
```

**Problemas:**
- Lógica de negocio dispersa en servicios
- No hay validaciones en el modelo
- Reglas de negocio duplicadas

---

## Mejoras Críticas de Seguridad

### 🔴 CRÍTICO 1: Endpoints de Configuración Sin Autenticación

**Ubicación:** `server/src/routes/configuration.ts:5-21`

**Problema Actual:**
```typescript
// ❌ PELIGRO: Cualquiera puede leer/modificar tokens
{
  method: "GET",
  path: "/configuration",
  handler: "configuration.get",
  config: {
    auth: false, // ⚠️ CRÍTICO
  },
}
```

**Riesgo:** Exposición de `mercadoPagoToken` y `webhookPass` a usuarios no autenticados.

**Solución:**
```typescript
// ✅ DESPUÉS: Requiere autenticación y rol de administrador
{
  method: "GET",
  path: "/configuration",
  handler: "configuration.get",
  config: {
    auth: {
      scope: ["plugin::strapi-mercadopago.admin"],
    },
    policies: ["admin::isAdmin"],
  },
}
```

**Implementación:**
1. Crear policy `server/src/policies/isAdmin.ts`
2. Validar rol de usuario con `ctx.state.user`
3. Retornar 403 si no es admin

**Prioridad:** 🔴 INMEDIATA

---

### 🔴 CRÍTICO 2: Secretos en Texto Plano

**Ubicación:** `server/src/middlewares/configuration.ts`

**Problema Actual:**
```typescript
// ❌ Tokens guardados en plugin store sin encriptación
const config = await strapi
  .store({ type: "plugin", name: "strapi-mercadopago" })
  .get({ key: "configuration" });
```

**Riesgo:** Tokens accesibles en base de datos sin cifrado.

**Solución:**
```typescript
// ✅ DESPUÉS: Usar variables de entorno
// config/plugins.ts
export default {
  'strapi-mercadopago': {
    config: {
      mercadoPagoToken: env('MERCADOPAGO_ACCESS_TOKEN'),
      webhookPass: env('MERCADOPAGO_WEBHOOK_SECRET'),
    }
  }
}
```

**Implementación:**
1. Mover secretos a `.env`
2. Usar `@strapi/utils` para acceder a env
3. Deprecar almacenamiento en plugin store para secretos
4. Mantener solo configuración no sensible en DB

**Prioridad:** 🔴 INMEDIATA

---

### 🔴 CRÍTICO 3: Validación de Entrada Inexistente

**Ubicación:** `server/src/controllers/checkout.ts:10-13`

**Problema Actual:**
```typescript
// ❌ Sin validación de esquema
const { items = [], customer, fulfillment } = ctx.request.body || {};
if (items.length === 0) return ctx.badRequest();
```

**Riesgo:** Inyección de datos maliciosos, crash de aplicación.

**Solución con Yup (recomendado por Strapi):**
```typescript
// ✅ DESPUÉS: Validación estricta
import * as yup from 'yup';

const checkoutSchema = yup.object({
  items: yup.array().of(
    yup.object({
      sku: yup.string().required().max(100),
      quantity: yup.number().integer().min(1).max(999).required(),
    })
  ).min(1).required(),
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

// En el controller
const validatedData = await checkoutSchema.validate(ctx.request.body, {
  abortEarly: false,
  stripUnknown: true,
});
```

**Implementación:**
1. Crear `server/src/validation/checkout.schema.ts`
2. Aplicar en middleware previo al controller
3. Retornar 400 con errores detallados

**Prioridad:** 🔴 INMEDIATA

---

### 🔴 CRÍTICO 4: Condición de Carrera en Stock

**Ubicación:** `server/src/services/sdk.ts:177-198`

**Problema Actual:**
```typescript
// ❌ PELIGRO: No es atómico
await items.forEach(async (product) => {
  const dbproduct = await strapi
    .query("plugin::strapi-mercadopago.product")
    .findOne({ where: { sku: product.id } });

  const newStock = Number(dbproduct.stock) - Number(product.quantity);
  await strapi
    .query("plugin::strapi-mercadopago.product")
    .update({
      where: { sku: product.id },
      data: { stock: newStock },
    });
});
```

**Riesgo:** Dos webhooks simultáneos pueden sobrevender productos.

**Solución con SQL Atómico:**
```typescript
// ✅ DESPUÉS: Operación atómica con bloqueo optimista
await strapi.db.transaction(async (trx) => {
  for (const item of items) {
    const result = await trx.raw(`
      UPDATE products
      SET stock = stock - ?
      WHERE sku = ? AND stock >= ?
    `, [item.quantity, item.id, item.quantity]);

    if (result.affectedRows === 0) {
      throw new InsufficientStockError(item.id);
    }
  }
});
```

**Implementación:**
1. Usar transacciones de base de datos
2. Actualizar stock con operación SQL atómica
3. Validar stock disponible en la misma query
4. Rollback automático si falla

**Prioridad:** 🔴 CRÍTICA

---

### 🔴 CRÍTICO 5: forEach con async (Fire & Forget)

**Ubicación:** `server/src/services/sdk.ts:177`

**Problema Actual:**
```typescript
// ❌ ANTI-PATRÓN: async en forEach
await items.forEach(async (product) => {
  await updateStock(product); // No se espera realmente
});
```

**Riesgo:** El código continúa antes de que se complete la actualización.

**Solución:**
```typescript
// ✅ DESPUÉS: Esperar todas las promesas
await Promise.all(
  items.map(async (product) => {
    return await updateStock(product);
  })
);

// O mejor aún, usar for...of en una transacción
for (const product of items) {
  await updateStock(product);
}
```

**Prioridad:** 🔴 CRÍTICA

---

### 🔴 CRÍTICO 6: Idempotencia Débil

**Ubicación:** `server/src/services/sdk.ts:155-158`

**Problema Actual:**
```typescript
// ❌ Race condition posible
if (invoice.payment_status === INVOICES_STATUS.APPROVED) {
  strapi.log.warn(`Order: On retry but it has status approved`);
  return;
}
// Si dos webhooks llegan simultáneamente, ambos pasan este check
```

**Riesgo:** Doble reducción de stock si dos webhooks se procesan simultáneamente.

**Solución con Idempotency Key:**
```typescript
// ✅ DESPUÉS: Usar idempotency key de MercadoPago
const idempotencyKey = `${paymentId}-${status}`;

await strapi.db.transaction(async (trx) => {
  // Intentar insertar en tabla de idempotencia
  const created = await trx('payment_events').insert({
    idempotency_key: idempotencyKey,
    payment_id: paymentId,
    processed_at: new Date(),
  }).onConflict('idempotency_key').ignore();

  if (!created) {
    throw new AlreadyProcessedError();
  }

  // Continuar con el procesamiento
  await updateOrder(trx, orderId, status);
  await reduceStock(trx, items);
});
```

**Implementación:**
1. Crear migration para tabla `payment_events`
2. Añadir índice único en `idempotency_key`
3. Intentar insertar antes de procesar
4. Usar transacciones para atomicidad

**Prioridad:** 🔴 CRÍTICA

---

### 🔴 CRÍTICO 7: Hardcoded Country Configuration

**Ubicación:** `server/src/services/sdk.ts:45-49`

**Problema Actual:**
```typescript
// ❌ Solo funciona para Colombia
phone: {
  area_code: "57", // Colombia
  number: phone,
},
identification: {
  type: "CC", // Cédula Colombiana
  number: dni,
}
```

**Riesgo:** Plugin no reutilizable internacionalmente.

**Solución:**
```typescript
// ✅ DESPUÉS: Configuración por país
interface CountryConfig {
  areaCode: string;
  identificationType: 'CC' | 'DNI' | 'PASSPORT' | 'RUT' | 'CPF';
  identificationPattern: RegExp;
}

const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  CO: { areaCode: '57', identificationType: 'CC', identificationPattern: /^[0-9]{6,10}$/ },
  AR: { areaCode: '54', identificationType: 'DNI', identificationPattern: /^[0-9]{7,8}$/ },
  BR: { areaCode: '55', identificationType: 'CPF', identificationPattern: /^[0-9]{11}$/ },
  MX: { areaCode: '52', identificationType: 'PASSPORT', identificationPattern: /^[A-Z0-9]{6,9}$/ },
};

// En la configuración del plugin
const countryCode = config.country || 'CO';
const countryConfig = COUNTRY_CONFIGS[countryCode];
```

**Implementación:**
1. Añadir campo `country` a configuración
2. Crear diccionario de configuraciones por país
3. Validar DNI según patrón del país
4. Documentar países soportados

**Prioridad:** 🟠 ALTA

---

### 🔴 CRÍTICO 8: Logging de Información Sensible

**Ubicación:** `server/src/middlewares/webhooksign.ts:42,52-53`

**Problema Actual:**
```typescript
// ❌ Expone secretos en logs
console.debug({ ts, hash, dataID, xRequestId, webhookPass });
console.log(sha);
console.log(hash);
```

**Riesgo:** Secretos en logs de producción.

**Solución:**
```typescript
// ✅ DESPUÉS: Sanitizar logs
strapi.log.debug({
  ts,
  dataID,
  xRequestId,
  hashReceived: hash.substring(0, 8) + '...', // Solo primeros caracteres
  hashMatches: sha === hash,
  // webhookPass NUNCA se loguea
});
```

**Prioridad:** 🔴 CRÍTICA

---

## Refactorización según Arquitectura Limpia

### Propuesta de Nueva Estructura

```
server/src/
├── domain/                          # Capa de Dominio (Business Logic)
│   ├── entities/
│   │   ├── Order.entity.ts
│   │   ├── Product.entity.ts
│   │   ├── Payment.entity.ts
│   │   └── Customer.entity.ts
│   │
│   ├── value-objects/
│   │   ├── Money.vo.ts
│   │   ├── Email.vo.ts
│   │   ├── PhoneNumber.vo.ts
│   │   └── Identification.vo.ts
│   │
│   ├── repositories/                # Interfaces (no implementaciones)
│   │   ├── IOrderRepository.ts
│   │   ├── IProductRepository.ts
│   │   └── IConfigRepository.ts
│   │
│   └── services/                    # Servicios de dominio
│       ├── PricingService.ts
│       └── StockService.ts
│
├── application/                     # Capa de Aplicación (Use Cases)
│   ├── use-cases/
│   │   ├── checkout/
│   │   │   ├── ProcessCheckout.usecase.ts
│   │   │   ├── ProcessCheckout.dto.ts
│   │   │   └── ProcessCheckout.spec.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── ProcessPaymentNotification.usecase.ts
│   │   │   ├── ProcessPaymentNotification.dto.ts
│   │   │   └── ProcessPaymentNotification.spec.ts
│   │   │
│   │   └── config/
│   │       ├── UpdateConfiguration.usecase.ts
│   │       └── GetConfiguration.usecase.ts
│   │
│   ├── ports/                       # Interfaces para infraestructura
│   │   ├── IPaymentGateway.ts
│   │   ├── IEmailService.ts
│   │   └── ILogger.ts
│   │
│   └── mappers/                     # DTOs ↔ Entities
│       ├── OrderMapper.ts
│       └── ProductMapper.ts
│
├── infrastructure/                  # Capa de Infraestructura
│   ├── repositories/                # Implementaciones de repositorios
│   │   ├── StrapiOrderRepository.ts
│   │   ├── StrapiProductRepository.ts
│   │   └── StrapiConfigRepository.ts
│   │
│   ├── gateways/                    # Implementaciones de gateways
│   │   └── MercadoPagoGateway.ts
│   │
│   ├── adapters/
│   │   └── StrapiEmailAdapter.ts
│   │
│   └── config/
│       └── CountryConfigurations.ts
│
├── presentation/                    # Capa de Presentación
│   ├── controllers/
│   │   ├── checkout.controller.ts
│   │   ├── notification.controller.ts
│   │   └── configuration.controller.ts
│   │
│   ├── middlewares/
│   │   ├── validation.middleware.ts
│   │   ├── authentication.middleware.ts
│   │   └── webhookVerification.middleware.ts
│   │
│   ├── validators/
│   │   ├── checkout.schema.ts
│   │   └── configuration.schema.ts
│   │
│   └── routes/
│       └── ... (archivos actuales)
│
├── shared/                          # Código compartido
│   ├── errors/
│   │   ├── DomainError.ts
│   │   ├── InsufficientStockError.ts
│   │   └── PaymentProcessingError.ts
│   │
│   ├── types/
│   │   └── ... (tipos compartidos)
│   │
│   └── utils/
│       ├── logger.util.ts
│       └── sanitizer.util.ts
│
└── di/                              # Dependency Injection
    └── container.ts                 # Registro de dependencias
```

---

### 🟠 MEJORA 9: Crear Entidades de Dominio

**Archivo Nuevo:** `server/src/domain/entities/Order.entity.ts`

```typescript
// ✅ Entidad rica con comportamiento
import { Money } from '../value-objects/Money.vo';
import { OrderStatus } from '../value-objects/OrderStatus.vo';

export class Order {
  private constructor(
    private readonly id: string,
    private status: OrderStatus,
    private readonly items: OrderItem[],
    private readonly customer: Customer,
    private paymentLink?: string
  ) {}

  static create(data: CreateOrderData): Order {
    // Validaciones de negocio
    if (data.items.length === 0) {
      throw new EmptyOrderError();
    }

    return new Order(
      generateId(),
      OrderStatus.INITIAL,
      data.items,
      data.customer
    );
  }

  // Métodos de negocio
  calculateTotal(): Money {
    return this.items.reduce(
      (total, item) => total.add(item.subtotal()),
      Money.zero()
    );
  }

  approve(paymentId: string): void {
    if (!this.status.canTransitionTo(OrderStatus.APPROVED)) {
      throw new InvalidStatusTransitionError();
    }
    this.status = OrderStatus.APPROVED;
  }

  setPaymentLink(link: string): void {
    if (this.paymentLink) {
      throw new PaymentLinkAlreadySetError();
    }
    this.paymentLink = link;
  }

  // Getters
  getId(): string { return this.id; }
  getStatus(): OrderStatus { return this.status; }
  getItems(): readonly OrderItem[] { return this.items; }
}
```

**Beneficios:**
- Encapsula lógica de negocio
- Previene estados inválidos
- Auto-documentado
- Fácil de testear

---

### 🟠 MEJORA 10: Implementar Value Objects

**Archivo Nuevo:** `server/src/domain/value-objects/Money.vo.ts`

```typescript
// ✅ Value Object inmutable
export class Money {
  private constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {
    if (amount < 0) {
      throw new NegativeAmountError();
    }
    if (!SUPPORTED_CURRENCIES.includes(currency)) {
      throw new UnsupportedCurrencyError(currency);
    }
  }

  static fromAmount(amount: number, currency: string): Money {
    return new Money(amount, currency);
  }

  static zero(currency = 'COP'): Money {
    return new Money(0, currency);
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toNumber(): number {
    return this.amount;
  }

  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchError();
    }
  }
}
```

**Beneficios:**
- Previene errores de tipos
- Validación en construcción
- Operaciones seguras de dinero
- Inmutabilidad

---

### 🟠 MEJORA 11: Crear Use Cases

**Archivo Nuevo:** `server/src/application/use-cases/checkout/ProcessCheckout.usecase.ts`

```typescript
// ✅ Use Case con Single Responsibility
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { IPaymentGateway } from '../../ports/IPaymentGateway';
import { ProcessCheckoutDTO } from './ProcessCheckout.dto';

export class ProcessCheckoutUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly paymentGateway: IPaymentGateway,
    private readonly logger: ILogger
  ) {}

  async execute(dto: ProcessCheckoutDTO): Promise<CheckoutResult> {
    this.logger.info('Processing checkout', { itemCount: dto.items.length });

    // 1. Validar disponibilidad de productos
    const products = await this.productRepository.findBySkus(
      dto.items.map(i => i.sku)
    );

    this.validateStock(products, dto.items);

    // 2. Crear orden inicial
    const order = Order.create({
      items: this.mapToOrderItems(products, dto.items),
      customer: Customer.fromDTO(dto.customer),
      fulfillment: Fulfillment.fromDTO(dto.fulfillment),
    });

    const savedOrder = await this.orderRepository.save(order);

    // 3. Crear preferencia en MercadoPago
    const preference = await this.paymentGateway.createPreference({
      orderId: savedOrder.getId(),
      items: order.getItems(),
      payer: order.getCustomer(),
    });

    // 4. Actualizar orden con link de pago
    savedOrder.setPaymentLink(preference.initPoint);
    await this.orderRepository.update(savedOrder);

    this.logger.info('Checkout completed', {
      orderId: savedOrder.getId(),
      preferenceId: preference.id
    });

    return {
      orderId: savedOrder.getId(),
      paymentUrl: preference.initPoint,
      preferenceId: preference.id,
    };
  }

  private validateStock(products: Product[], requestedItems: ItemDTO[]): void {
    for (const item of requestedItems) {
      const product = products.find(p => p.getSku() === item.sku);
      if (!product) {
        throw new ProductNotFoundError(item.sku);
      }
      if (!product.hasStock(item.quantity)) {
        throw new InsufficientStockError(item.sku, product.getStock());
      }
    }
  }

  private mapToOrderItems(products: Product[], items: ItemDTO[]): OrderItem[] {
    return items.map(item => {
      const product = products.find(p => p.getSku() === item.sku)!;
      return OrderItem.create(product, item.quantity);
    });
  }
}
```

**Beneficios:**
- Lógica de negocio centralizada
- Fácil de testear con mocks
- Independiente de framework
- Reutilizable

---

### 🟠 MEJORA 12: Implementar Repository Pattern

**Archivo Nuevo:** `server/src/domain/repositories/IOrderRepository.ts`

```typescript
// ✅ Interface (Domain)
import { Order } from '../entities/Order.entity';

export interface IOrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  update(order: Order): Promise<Order>;
  findByPaymentId(paymentId: string): Promise<Order | null>;
}
```

**Archivo Nuevo:** `server/src/infrastructure/repositories/StrapiOrderRepository.ts`

```typescript
// ✅ Implementación (Infrastructure)
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { Order } from '../../domain/entities/Order.entity';
import { OrderMapper } from '../../application/mappers/OrderMapper';

export class StrapiOrderRepository implements IOrderRepository {
  constructor(private readonly strapi: Core.Strapi) {}

  async save(order: Order): Promise<Order> {
    const data = OrderMapper.toPersistence(order);

    const saved = await this.strapi.entityService.create(
      'plugin::strapi-mercadopago.order',
      { data }
    );

    return OrderMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Order | null> {
    const result = await this.strapi.entityService.findOne(
      'plugin::strapi-mercadopago.order',
      id
    );

    return result ? OrderMapper.toDomain(result) : null;
  }

  async update(order: Order): Promise<Order> {
    const data = OrderMapper.toPersistence(order);

    const updated = await this.strapi.entityService.update(
      'plugin::strapi-mercadopago.order',
      order.getId(),
      { data }
    );

    return OrderMapper.toDomain(updated);
  }

  async findByPaymentId(paymentId: string): Promise<Order | null> {
    const results = await this.strapi.db
      .query('plugin::strapi-mercadopago.order')
      .findMany({
        where: { payment_id: paymentId },
        limit: 1,
      });

    return results[0] ? OrderMapper.toDomain(results[0]) : null;
  }
}
```

**Beneficios:**
- Desacopla dominio de infraestructura
- Permite cambiar ORM sin afectar lógica
- Facilita testing con in-memory repos
- Cumple DIP (Dependency Inversion)

---

### 🟠 MEJORA 13: Implementar Gateway Pattern para MercadoPago

**Archivo Nuevo:** `server/src/application/ports/IPaymentGateway.ts`

```typescript
// ✅ Interface (Application)
export interface IPaymentGateway {
  createPreference(request: CreatePreferenceRequest): Promise<PreferenceResponse>;
  getPayment(paymentId: string): Promise<PaymentData>;
  refundPayment(paymentId: string, amount?: number): Promise<RefundResponse>;
}

export interface CreatePreferenceRequest {
  orderId: string;
  items: PaymentItem[];
  payer: PayerInfo;
  backUrls?: BackUrls;
  notificationUrl: string;
}

export interface PreferenceResponse {
  id: string;
  initPoint: string;
  collectorId: string;
}
```

**Archivo Nuevo:** `server/src/infrastructure/gateways/MercadoPagoGateway.ts`

```typescript
// ✅ Implementación (Infrastructure)
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { IPaymentGateway } from '../../application/ports/IPaymentGateway';

export class MercadoPagoGateway implements IPaymentGateway {
  private client: MercadoPagoConfig;

  constructor(
    private readonly accessToken: string,
    private readonly config: GatewayConfig
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: this.accessToken,
      options: {
        timeout: config.timeout || 5000,
      },
    });
  }

  async createPreference(request: CreatePreferenceRequest): Promise<PreferenceResponse> {
    const preference = new Preference(this.client);

    try {
      const response = await preference.create({
        body: {
          external_reference: request.orderId,
          items: this.mapItems(request.items),
          payer: request.payer,
          back_urls: request.backUrls,
          notification_url: request.notificationUrl,
          binary_mode: true,
          payment_methods: {
            installments: this.config.maxInstallments || 12,
            default_installments: 1,
          },
        },
      });

      return {
        id: response.id!,
        initPoint: response.init_point!,
        collectorId: response.collector_id!.toString(),
      };
    } catch (error) {
      throw new PaymentGatewayError('Failed to create preference', error);
    }
  }

  async getPayment(paymentId: string): Promise<PaymentData> {
    const payment = new Payment(this.client);

    try {
      const response = await payment.get({ id: paymentId });
      return this.mapPaymentResponse(response);
    } catch (error) {
      throw new PaymentGatewayError('Failed to get payment', error);
    }
  }

  private mapItems(items: PaymentItem[]): any[] {
    return items.map(item => ({
      id: item.sku,
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      currency_id: item.currencyId,
    }));
  }

  private mapPaymentResponse(response: any): PaymentData {
    return {
      id: response.id,
      status: response.status,
      externalReference: response.external_reference,
      paymentTypeId: response.payment_type_id,
      items: response.additional_info?.items || [],
    };
  }
}
```

**Beneficios:**
- Abstrae dependencia de MercadoPago SDK
- Permite cambiar gateway de pago fácilmente
- Facilita testing con mock gateway
- Centraliza manejo de errores de API

---

### 🟠 MEJORA 14: Dependency Injection Container

**Archivo Nuevo:** `server/src/di/container.ts`

```typescript
// ✅ Contenedor de dependencias
import { Core } from '@strapi/strapi';

export class DIContainer {
  private static instance: DIContainer;
  private dependencies: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Registrar dependencias
  register(key: string, factory: () => any): void {
    this.dependencies.set(key, factory);
  }

  // Resolver dependencias
  resolve<T>(key: string): T {
    const factory = this.dependencies.get(key);
    if (!factory) {
      throw new Error(`Dependency not found: ${key}`);
    }
    return factory();
  }
}

// Configuración de dependencias
export function configureDependencies(strapi: Core.Strapi, config: any) {
  const container = DIContainer.getInstance();

  // Repositories
  container.register('OrderRepository', () =>
    new StrapiOrderRepository(strapi)
  );
  container.register('ProductRepository', () =>
    new StrapiProductRepository(strapi)
  );

  // Gateways
  container.register('PaymentGateway', () =>
    new MercadoPagoGateway(config.mercadoPagoToken, config)
  );

  // Use Cases
  container.register('ProcessCheckoutUseCase', () =>
    new ProcessCheckoutUseCase(
      container.resolve('OrderRepository'),
      container.resolve('ProductRepository'),
      container.resolve('PaymentGateway'),
      strapi.log
    )
  );

  container.register('ProcessPaymentNotificationUseCase', () =>
    new ProcessPaymentNotificationUseCase(
      container.resolve('OrderRepository'),
      container.resolve('ProductRepository'),
      container.resolve('PaymentGateway'),
      strapi.log
    )
  );
}
```

**Archivo Modificado:** `server/src/bootstrap.ts`

```typescript
// ✅ Inicializar DI en bootstrap
import { configureDependencies } from './di/container';

export default async ({ strapi }) => {
  // Cargar configuración
  const config = await strapi
    .store({ type: 'plugin', name: 'strapi-mercadopago' })
    .get({ key: 'configuration' });

  // Configurar dependencias
  configureDependencies(strapi, config);

  strapi.log.info('MercadoPago plugin dependencies configured');
};
```

**Beneficios:**
- Gestión centralizada de dependencias
- Facilita testing
- Reduce acoplamiento
- Permite lazy loading

---

## Mejoras de Calidad y Mantenibilidad

### 🟡 MEJORA 15: Implementar Tests Unitarios

**Archivo Nuevo:** `server/src/application/use-cases/checkout/ProcessCheckout.spec.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProcessCheckoutUseCase } from './ProcessCheckout.usecase';
import { InMemoryOrderRepository } from '../../../__tests__/mocks/InMemoryOrderRepository';
import { InMemoryProductRepository } from '../../../__tests__/mocks/InMemoryProductRepository';
import { MockPaymentGateway } from '../../../__tests__/mocks/MockPaymentGateway';
import { InsufficientStockError } from '../../../shared/errors/InsufficientStockError';

describe('ProcessCheckoutUseCase', () => {
  let useCase: ProcessCheckoutUseCase;
  let orderRepo: InMemoryOrderRepository;
  let productRepo: InMemoryProductRepository;
  let paymentGateway: MockPaymentGateway;
  let logger: any;

  beforeEach(() => {
    orderRepo = new InMemoryOrderRepository();
    productRepo = new InMemoryProductRepository();
    paymentGateway = new MockPaymentGateway();
    logger = { info: vi.fn(), error: vi.fn() };

    useCase = new ProcessCheckoutUseCase(
      orderRepo,
      productRepo,
      paymentGateway,
      logger
    );
  });

  it('should create order and payment preference successfully', async () => {
    // Arrange
    const product = Product.create({
      sku: 'TEST-001',
      name: 'Test Product',
      price: Money.fromAmount(1000, 'COP'),
      stock: 10,
    });
    await productRepo.save(product);

    const dto = {
      items: [{ sku: 'TEST-001', quantity: 2 }],
      customer: {
        name: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        dni: '123456789',
        phone: '3001234567',
      },
      fulfillment: {
        address: 'Calle 123',
        city: 'Bogotá',
        department: 'Cundinamarca',
      },
    };

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result.orderId).toBeDefined();
    expect(result.paymentUrl).toBe('https://mercadopago.com/test');
    expect(result.preferenceId).toBe('PREF-123');

    const savedOrder = await orderRepo.findById(result.orderId);
    expect(savedOrder).toBeDefined();
    expect(savedOrder!.getStatus().value).toBe('IN_PROCESS');
  });

  it('should throw InsufficientStockError when stock is not available', async () => {
    // Arrange
    const product = Product.create({
      sku: 'TEST-001',
      name: 'Test Product',
      price: Money.fromAmount(1000, 'COP'),
      stock: 1, // Solo 1 en stock
    });
    await productRepo.save(product);

    const dto = {
      items: [{ sku: 'TEST-001', quantity: 5 }], // Pedir 5
      customer: { /* ... */ },
      fulfillment: { /* ... */ },
    };

    // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow(InsufficientStockError);
  });

  it('should throw ProductNotFoundError when product does not exist', async () => {
    // Arrange
    const dto = {
      items: [{ sku: 'NON-EXISTENT', quantity: 1 }],
      customer: { /* ... */ },
      fulfillment: { /* ... */ },
    };

    // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow(ProductNotFoundError);
  });
});
```

**Configuración de Testing:** `package.json`

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vitest/coverage-v8": "^1.0.0"
  }
}
```

**Prioridad:** 🟡 MEDIA (pero esencial para refactorización segura)

---

### 🟡 MEJORA 16: Manejo de Errores Estructurado

**Archivo Nuevo:** `server/src/shared/errors/DomainError.ts`

```typescript
// ✅ Jerarquía de errores custom
export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

export class InsufficientStockError extends DomainError {
  constructor(sku: string, availableStock: number) {
    super(
      `Insufficient stock for product ${sku}`,
      'INSUFFICIENT_STOCK',
      400,
      { sku, availableStock }
    );
  }
}

export class ProductNotFoundError extends DomainError {
  constructor(sku: string) {
    super(
      `Product not found: ${sku}`,
      'PRODUCT_NOT_FOUND',
      404,
      { sku }
    );
  }
}

export class PaymentGatewayError extends DomainError {
  constructor(message: string, originalError?: any) {
    super(
      message,
      'PAYMENT_GATEWAY_ERROR',
      502,
      { originalError: originalError?.message }
    );
  }
}

export class InvalidStatusTransitionError extends DomainError {
  constructor(from: string, to: string) {
    super(
      `Cannot transition from ${from} to ${to}`,
      'INVALID_STATUS_TRANSITION',
      400,
      { from, to }
    );
  }
}
```

**Middleware de Manejo de Errores:**

```typescript
// ✅ Error handler global
export const errorHandler = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (error instanceof DomainError) {
        ctx.status = error.statusCode;
        ctx.body = {
          error: error.toJSON(),
        };
        strapi.log.error('Domain error', error.toJSON());
      } else {
        ctx.status = 500;
        ctx.body = {
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
          },
        };
        strapi.log.error('Unhandled error', {
          message: error.message,
          stack: error.stack,
        });
      }
    }
  };
};
```

**Prioridad:** 🟡 MEDIA

---

### 🟡 MEJORA 17: Logging Estructurado

**Archivo Nuevo:** `server/src/shared/utils/logger.util.ts`

```typescript
// ✅ Logger con contexto estructurado
import { Core } from '@strapi/strapi';

export interface LogContext {
  [key: string]: any;
}

export class Logger {
  constructor(private readonly strapi: Core.Strapi) {}

  info(message: string, context?: LogContext): void {
    this.strapi.log.info(this.format(message, context));
  }

  warn(message: string, context?: LogContext): void {
    this.strapi.log.warn(this.format(message, context));
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.strapi.log.error(this.format(message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    }));
  }

  debug(message: string, context?: LogContext): void {
    this.strapi.log.debug(this.format(message, context));
  }

  private format(message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(this.sanitize(context))}` : '';
    return `[${timestamp}] ${message}${contextStr}`;
  }

  private sanitize(context: LogContext): LogContext {
    const sanitized = { ...context };

    // Eliminar campos sensibles
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'webhookPass'];

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
```

**Uso en Use Cases:**

```typescript
// Antes
strapi.log.info(`Invoice: ${invoiceId} has been updated`);

// Después
this.logger.info('Order status updated', {
  orderId: invoiceId,
  newStatus: status,
  paymentType: paymentTypeId,
});
```

**Prioridad:** 🟡 MEDIA

---

### 🟡 MEJORA 18: Documentación de API con OpenAPI

**Archivo Nuevo:** `server/src/docs/openapi.yaml`

```yaml
openapi: 3.0.3
info:
  title: Strapi MercadoPago Plugin API
  version: 1.0.0
  description: API for MercadoPago payment processing in Strapi

servers:
  - url: /strapi-mercadopago
    description: Plugin API base path

paths:
  /checkout:
    post:
      summary: Create checkout session
      description: Creates a new order and returns MercadoPago payment link
      tags:
        - Checkout
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CheckoutRequest'
            example:
              items:
                - sku: "PROD-001"
                  quantity: 2
              customer:
                name: "John"
                lastName: "Doe"
                email: "john@example.com"
                dni: "123456789"
                phone: "3001234567"
              fulfillment:
                address: "Calle 123 #45-67"
                city: "Bogotá"
                department: "Cundinamarca"
                postalCode: "110111"
      responses:
        '200':
          description: Checkout created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CheckoutResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/InternalServerError'

  /notifications:
    post:
      summary: MercadoPago webhook endpoint
      description: Receives payment notifications from MercadoPago
      tags:
        - Webhooks
      parameters:
        - name: x-signature
          in: header
          required: true
          schema:
            type: string
          description: HMAC signature for verification
        - name: x-request-id
          in: header
          required: true
          schema:
            type: string
        - name: data.id
          in: query
          required: true
          schema:
            type: string
          description: Payment ID
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WebhookPayload'
      responses:
        '200':
          description: Webhook processed successfully
        '401':
          description: Invalid signature

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    CheckoutRequest:
      type: object
      required:
        - items
        - customer
        - fulfillment
      properties:
        items:
          type: array
          minItems: 1
          items:
            type: object
            required:
              - sku
              - quantity
            properties:
              sku:
                type: string
                maxLength: 100
              quantity:
                type: integer
                minimum: 1
                maximum: 999
        customer:
          $ref: '#/components/schemas/Customer'
        fulfillment:
          $ref: '#/components/schemas/Fulfillment'

    Customer:
      type: object
      required:
        - name
        - lastName
        - email
        - dni
        - phone
      properties:
        name:
          type: string
          maxLength: 200
        lastName:
          type: string
          maxLength: 200
        email:
          type: string
          format: email
        dni:
          type: string
          pattern: '^[0-9]+$'
        phone:
          type: string
          pattern: '^[0-9]{7,15}$'

    Fulfillment:
      type: object
      required:
        - address
        - city
        - department
      properties:
        address:
          type: string
          maxLength: 500
        city:
          type: string
          maxLength: 100
        department:
          type: string
          maxLength: 100
        postalCode:
          type: string
          maxLength: 20

    CheckoutResponse:
      type: object
      properties:
        orderId:
          type: string
        paymentUrl:
          type: string
          format: uri
        preferenceId:
          type: string
        collectorId:
          type: string

  responses:
    BadRequest:
      description: Invalid request
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: object
                properties:
                  code:
                    type: string
                  message:
                    type: string
                  details:
                    type: object

    Unauthorized:
      description: Authentication required

    InternalServerError:
      description: Server error
```

**Generar Docs con Scalar:**

```typescript
// server/src/routes/docs.ts
import { readFileSync } from 'fs';
import { join } from 'path';

export default [
  {
    method: 'GET',
    path: '/docs',
    handler: (ctx) => {
      const spec = readFileSync(
        join(__dirname, '../docs/openapi.yaml'),
        'utf8'
      );
      ctx.type = 'text/html';
      ctx.body = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>MercadoPago Plugin API Docs</title>
            <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
          </head>
          <body>
            <script>
              const spec = ${JSON.stringify(spec)};
              const app = document.querySelector('#api-reference');
              app.configuration = {
                spec: { content: spec },
              };
            </script>
            <api-reference id="api-reference"></api-reference>
          </body>
        </html>
      `;
    },
    config: { auth: false },
  },
];
```

**Prioridad:** 🟡 MEDIA

---

### 🟡 MEJORA 19: Implementar Rate Limiting

**Archivo Nuevo:** `server/src/middlewares/rateLimit.middleware.ts`

```typescript
// ✅ Rate limiting para prevenir abuso
import rateLimit from 'koa2-ratelimit';

export const checkoutRateLimit = rateLimit.RateLimit.middleware({
  interval: { min: 1 }, // 1 minuto
  max: 10, // máximo 10 requests por minuto
  message: 'Too many checkout requests, please try again later',
  prefixKey: 'checkout:',
  getUserId: (ctx) => {
    return ctx.state.user?.id || ctx.ip;
  },
  handler: (ctx) => {
    ctx.status = 429;
    ctx.body = {
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
      },
    };
  },
});

export const webhookRateLimit = rateLimit.RateLimit.middleware({
  interval: { sec: 10 }, // 10 segundos
  max: 50, // máximo 50 webhooks por 10 segundos
  prefixKey: 'webhook:',
  getUserId: (ctx) => ctx.ip,
});
```

**Aplicar en Routes:**

```typescript
// server/src/routes/checkout.ts
import { checkoutRateLimit } from '../middlewares/rateLimit.middleware';

export default [
  {
    method: 'POST',
    path: '/checkout',
    handler: 'checkout.checkout',
    config: {
      auth: true,
      middlewares: [
        'plugin::strapi-mercadopago.loadConfig',
        checkoutRateLimit, // ✅ Rate limiting
      ],
    },
  },
];
```

**Prioridad:** 🟡 MEDIA

---

### 🟡 MEJORA 20: Implementar Health Check

**Archivo Nuevo:** `server/src/controllers/health.controller.ts`

```typescript
// ✅ Health check endpoint
export default ({ strapi }) => ({
  async check(ctx) {
    const checks = {
      database: await checkDatabase(strapi),
      mercadopago: await checkMercadoPago(strapi),
      config: await checkConfiguration(strapi),
    };

    const healthy = Object.values(checks).every(check => check.status === 'ok');

    ctx.status = healthy ? 200 : 503;
    ctx.body = {
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    };
  },
});

async function checkDatabase(strapi): Promise<HealthCheck> {
  try {
    await strapi.db.connection.raw('SELECT 1');
    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

async function checkMercadoPago(strapi): Promise<HealthCheck> {
  try {
    const config = await getPluginConfig(strapi);
    if (!config.mercadoPagoToken) {
      return { status: 'error', message: 'MercadoPago token not configured' };
    }
    // Opcional: hacer ping a MercadoPago API
    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

async function checkConfiguration(strapi): Promise<HealthCheck> {
  try {
    const config = await getPluginConfig(strapi);
    const required = ['mercadoPagoToken', 'defaultCurrency', 'notificationUrl'];

    for (const field of required) {
      if (!config[field]) {
        return { status: 'error', message: `Missing: ${field}` };
      }
    }

    return { status: 'ok' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

interface HealthCheck {
  status: 'ok' | 'error';
  message?: string;
}
```

**Route:**

```typescript
export default [
  {
    method: 'GET',
    path: '/health',
    handler: 'health.check',
    config: { auth: false },
  },
];
```

**Prioridad:** 🟡 MEDIA

---

## Mejoras de Performance y Escalabilidad

### 🔵 MEJORA 21: Implementar Cache para Productos

**Archivo Nuevo:** `server/src/infrastructure/cache/ProductCache.ts`

```typescript
// ✅ Cache con TTL para productos
import NodeCache from 'node-cache';

export class ProductCache {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 300) { // 5 minutos por defecto
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: 60,
    });
  }

  async getProduct(sku: string, fetcher: () => Promise<Product>): Promise<Product> {
    const cached = this.cache.get<Product>(sku);

    if (cached) {
      return cached;
    }

    const product = await fetcher();
    this.cache.set(sku, product);
    return product;
  }

  invalidate(sku: string): void {
    this.cache.del(sku);
  }

  invalidateAll(): void {
    this.cache.flushAll();
  }
}
```

**Integración en Repository:**

```typescript
export class StrapiProductRepository implements IProductRepository {
  constructor(
    private readonly strapi: Core.Strapi,
    private readonly cache: ProductCache
  ) {}

  async findBySku(sku: string): Promise<Product | null> {
    return this.cache.getProduct(sku, async () => {
      const result = await this.strapi.db
        .query('plugin::strapi-mercadopago.product')
        .findOne({ where: { sku } });

      return result ? ProductMapper.toDomain(result) : null;
    });
  }
}
```

**Prioridad:** 🔵 BAJA

---

### 🔵 MEJORA 22: Queue para Webhooks

**Archivo Nuevo:** `server/src/infrastructure/queues/WebhookQueue.ts`

```typescript
// ✅ Cola de procesamiento asíncrono
import Bull from 'bull';

export class WebhookQueue {
  private queue: Bull.Queue;

  constructor(redisConfig: any) {
    this.queue = new Bull('webhook-processing', {
      redis: redisConfig,
    });

    this.setupProcessor();
  }

  private setupProcessor(): void {
    this.queue.process(async (job) => {
      const { payload, config } = job.data;

      // Procesar webhook
      await this.processWebhook(payload, config);
    });

    this.queue.on('failed', (job, err) => {
      console.error(`Webhook job ${job.id} failed:`, err);
    });
  }

  async enqueue(payload: any, config: any): Promise<void> {
    await this.queue.add(
      { payload, config },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    );
  }

  private async processWebhook(payload: any, config: any): Promise<void> {
    // Lógica de procesamiento
    const useCase = DIContainer.getInstance()
      .resolve<ProcessPaymentNotificationUseCase>('ProcessPaymentNotificationUseCase');

    await useCase.execute(payload);
  }
}
```

**Uso en Controller:**

```typescript
// Antes: procesamiento síncrono
async notification(ctx) {
  await processWebhook(payload);
  return ctx.send({ message: 'Webhook received' });
}

// Después: procesamiento asíncrono
async notification(ctx) {
  await webhookQueue.enqueue(payload, config);
  return ctx.send({ message: 'Webhook queued for processing' });
}
```

**Prioridad:** 🔵 BAJA (útil para alto volumen)

---

### 🔵 MEJORA 23: Optimizar Consultas con DataLoader

**Archivo Nuevo:** `server/src/infrastructure/dataloaders/ProductLoader.ts`

```typescript
// ✅ Batch loading para evitar N+1 queries
import DataLoader from 'dataloader';

export class ProductDataLoader {
  private loader: DataLoader<string, Product>;

  constructor(private readonly strapi: Core.Strapi) {
    this.loader = new DataLoader(async (skus: readonly string[]) => {
      const products = await this.strapi.db
        .query('plugin::strapi-mercadopago.product')
        .findMany({
          where: { sku: { $in: skus } },
        });

      const productMap = new Map(
        products.map(p => [p.sku, ProductMapper.toDomain(p)])
      );

      return skus.map(sku => productMap.get(sku) || null);
    });
  }

  async load(sku: string): Promise<Product | null> {
    return this.loader.load(sku);
  }

  async loadMany(skus: string[]): Promise<(Product | null)[]> {
    return this.loader.loadMany(skus);
  }
}
```

**Prioridad:** 🔵 BAJA

---

## Mejoras Adicionales de Código

### 🟡 MEJORA 24: Corregir Typo en Types

**Ubicación:** `server/src/types/checkout.ts:11`

**Problema:**
```typescript
export type Reqproduct = {
  sku: string;
  quaity: number; // ❌ Typo
};
```

**Solución:**
```typescript
export type Reqproduct = {
  sku: string;
  quantity: number; // ✅ Corregido
};
```

**Prioridad:** 🟡 MEDIA

---

### 🟡 MEJORA 25: Estandarizar Nombres de Tipos

**Problema:** Inconsistencia en nomenclatura (Reqproduct vs ReqCustomer vs resCustomer)

**Solución:**
```typescript
// ✅ Convención estándar: [Acción][Entidad][Tipo]
export type CreateOrderRequest = { /* ... */ };
export type OrderResponse = { /* ... */ };
export type CustomerDTO = { /* ... */ };
export type ProductDTO = { /* ... */ };
```

**Prioridad:** 🟡 MEDIA

---

### 🟡 MEJORA 26: Eliminar Código Muerto

**Ubicación:** `server/src/helpers/index.ts:65-73`

**Funciones No Usadas:**
- `mergeShipmentAtProducts()`
- `calculateWithShipment()`

**Acción:** Eliminar o implementar funcionalidad de envío.

**Prioridad:** 🟡 MEDIA

---

### 🟡 MEJORA 27: Reemplazar console.log con Logger

**Ubicación:** `server/src/middlewares/webhooksign.ts:42,52-53`

**Antes:**
```typescript
console.debug({ ts, hash, dataID, xRequestId, webhookPass });
console.log(sha);
console.log(hash);
```

**Después:**
```typescript
strapi.log.debug('Webhook signature verification', {
  ts,
  dataID,
  xRequestId,
  hashMatch: sha === hash,
});
```

**Prioridad:** 🟡 MEDIA

---

### 🟡 MEJORA 28: Constantes de Timeout Configurables

**Ubicación:** `server/src/services/sdk.ts:79,118`

**Antes:**
```typescript
options: { timeout: 5000, idempotencyKey: "abc" }
```

**Después:**
```typescript
// En configuración
export const DEFAULT_TIMEOUT_MS = 10000;

// En uso
options: {
  timeout: config.apiTimeout || DEFAULT_TIMEOUT_MS,
  idempotencyKey: generateIdempotencyKey(),
}
```

**Prioridad:** 🟡 MEDIA

---

### 🟡 MEJORA 29: Idempotency Key Dinámico

**Ubicación:** `server/src/services/sdk.ts:79`

**Problema:**
```typescript
idempotencyKey: "abc" // ❌ Siempre el mismo
```

**Solución:**
```typescript
import { v4 as uuidv4 } from 'uuid';

idempotencyKey: uuidv4() // ✅ Único por request
```

**Prioridad:** 🔴 CRÍTICA

---

### 🟡 MEJORA 30: Validar Email Format

**Archivo:** `server/src/validation/email.validator.ts`

```typescript
import validator from 'validator';

export function validateEmail(email: string): boolean {
  if (!email) return false;

  return validator.isEmail(email, {
    allow_display_name: false,
    require_tld: true,
    allow_utf8_local_part: false,
  });
}
```

**Prioridad:** 🟡 MEDIA

---

## Plan de Implementación

### Fase 1: Seguridad Crítica (Semana 1-2)
**Prioridad:** 🔴 CRÍTICA

1. ✅ Proteger endpoints de configuración con autenticación
2. ✅ Mover secretos a variables de entorno
3. ✅ Implementar validación de entrada con Yup
4. ✅ Corregir condición de carrera en stock
5. ✅ Reemplazar forEach async con Promise.all
6. ✅ Implementar idempotencia robusta con tabla de eventos
7. ✅ Hacer configuración de país dinámica
8. ✅ Sanitizar logs de información sensible
9. ✅ Corregir idempotency key estático

**Resultado:** Sistema seguro para producción

---

### Fase 2: Arquitectura Limpia (Semana 3-6)
**Prioridad:** 🟠 ALTA

10. ✅ Crear entidades de dominio
11. ✅ Implementar value objects
12. ✅ Crear use cases
13. ✅ Implementar repository pattern
14. ✅ Implementar gateway pattern para MercadoPago
15. ✅ Configurar dependency injection
16. ✅ Migrar lógica de controllers a use cases

**Resultado:** Código mantenible y testeable

---

### Fase 3: Calidad y Testing (Semana 7-9)
**Prioridad:** 🟡 MEDIA

17. ✅ Implementar tests unitarios (>80% coverage)
18. ✅ Implementar tests de integración
19. ✅ Agregar manejo de errores estructurado
20. ✅ Implementar logging estructurado
21. ✅ Crear documentación OpenAPI
22. ✅ Implementar rate limiting
23. ✅ Agregar health check endpoint
24. ✅ Corregir typos y nombres de tipos

**Resultado:** Código de calidad producción

---

### Fase 4: Optimización (Semana 10-12)
**Prioridad:** 🔵 BAJA

25. ✅ Implementar cache para productos
26. ✅ Agregar queue para webhooks
27. ✅ Optimizar queries con DataLoader
28. ✅ Implementar métricas y monitoring
29. ✅ Agregar feature flags
30. ✅ Documentar patrones de arquitectura

**Resultado:** Sistema escalable

---

## Métricas de Éxito

### Antes de Mejoras
- ❌ 0% cobertura de tests
- ❌ Vulnerabilidades de seguridad: 8 críticas
- ❌ Complejidad ciclomática: >15 en sdk.ts
- ❌ Acoplamiento: Alto (dependencia directa de Strapi en todo)
- ❌ Mantenibilidad: Baja

### Después de Mejoras
- ✅ >80% cobertura de tests
- ✅ 0 vulnerabilidades críticas
- ✅ Complejidad ciclomática: <10 por función
- ✅ Acoplamiento: Bajo (dependency injection)
- ✅ Mantenibilidad: Alta (arquitectura en capas)

---

## Recursos Adicionales

### Documentación Recomendada
- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Strapi Plugin Development](https://docs.strapi.io/dev-docs/plugins-development)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

### Herramientas Recomendadas
- **Testing:** Vitest, Supertest
- **Validación:** Yup, Zod
- **Logging:** Winston, Pino
- **Cache:** Node-cache, Redis
- **Queue:** Bull, BullMQ
- **Monitoring:** Sentry, Datadog

---

## Conclusión

Este plan de mejoras transforma el plugin de MercadoPago de un **prototipo funcional** a un **sistema enterprise-grade** siguiendo principios de **Clean Architecture**.

Las mejoras están priorizadas por **impacto en seguridad**, **mantenibilidad** y **escalabilidad**, permitiendo una implementación incremental sin interrumpir el servicio existente.

**Estimación total:** 12 semanas para implementación completa.

**ROI esperado:**
- ✅ Reducción de bugs en producción: -80%
- ✅ Tiempo de onboarding de nuevos desarrolladores: -60%
- ✅ Tiempo de desarrollo de nuevas features: -40%
- ✅ Costos de mantenimiento: -50%

---

**Documento generado:** 2025-11-16
**Versión:** 1.0.0
**Autor:** Análisis de Arquitectura Clean para Strapi MercadoPago Plugin
