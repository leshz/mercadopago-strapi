# 🔴 Ajustes Críticos de Seguridad - URGENTE

## ⚠️ Importante

**Estos ajustes DEBEN implementarse ANTES de desplegar a producción** y son **independientes** de la arquitectura que elijas. Son fixes de seguridad que deben aplicarse inmediatamente.

**Tiempo estimado:** 1-2 semanas
**Prioridad:** CRÍTICA

---

## 1. Proteger Endpoints de Configuración

### ❌ Problema Actual

**Ubicación:** `server/src/routes/configuration.ts:5-21`

```typescript
// PELIGRO: Cualquiera puede acceder sin autenticación
{
  method: "GET",
  path: "/configuration",
  handler: "configuration.get",
  config: {
    auth: false, // ⚠️ CRÍTICO
  },
}
```

**Riesgo:** Cualquier usuario no autenticado puede:
- Leer el `mercadoPagoToken`
- Leer el `webhookPass`
- Modificar la configuración del plugin

### ✅ Solución

Como este endpoint es parte del **Admin Panel de Strapi**, ya está protegido por el sistema RBAC nativo de Strapi. Solo necesitamos habilitar la autenticación.

**Actualizar rutas:**

```typescript
// server/src/routes/configuration.ts
export default [
  {
    method: "GET",
    path: "/configuration",
    handler: "configuration.get",
    config: {
      auth: true, // ✅ Requiere autenticación de admin
    },
  },
  {
    method: "POST",
    path: "/configuration",
    handler: "configuration.update",
    config: {
      auth: true, // ✅ Requiere autenticación de admin
    },
  },
];
```

**Nota importante:**
- Con `auth: true`, Strapi automáticamente verifica que el usuario esté autenticado
- El Admin Panel de Strapi ya tiene su propio sistema de permisos
- Solo usuarios con acceso al admin pueden ver/modificar configuraciones de plugins
- No necesitas crear policies adicionales

**Verificación:**
```bash
# Sin autenticación - debe retornar 401 Unauthorized
curl http://localhost:1337/strapi-mercadopago/configuration

# Con token de admin - debe retornar 200 OK
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:1337/strapi-mercadopago/configuration
```

---

## 2. Mover Secretos a Variables de Entorno
## 2. Cifrar Secretos en Plugin Store

### ❌ Problema Actual

**Ubicación:** `server/src/controllers/configuration.ts`

```typescript
// Los tokens se guardan en plugin store sin cifrado
const response = await pluginStore.set({
  key: 'mercadopagoSetting',
  value: {
    mercadoPagoToken,  // ⚠️ Texto plano en DB
    webhookPass,       // ⚠️ Texto plano en DB
    // ... otros campos
  },
});
```

**Riesgo:**
- Tokens expuestos en backups de base de datos
- Accesibles si hay SQL injection
- Visibles en logs de DB

**Contexto importante:**
- El token se configura desde el **Admin Panel de Strapi** (interfaz UI)
- Los usuarios ingresan el token en un formulario (ver `admin/src/pages/Settings.tsx:128`)
- **NO puede ir a variables de entorno** porque usuarios no técnicos no tienen acceso
- Plugin Store es la forma correcta según Strapi para configuraciones de plugins

###✅ Solución

**Opción 1: Cifrar con Crypto de Node.js (Recomendado para Producción)**

**Paso 1:** Crear utilidad de cifrado

```typescript
// server/src/utils/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Obtiene la clave de cifrado desde la configuración de Strapi
 */
function getEncryptionKey(strapi): Buffer {
  // Usar la misma clave que Strapi usa para API tokens
  const key = strapi.config.get('admin.apiToken.secrets.encryptionKey');

  if (!key) {
    throw new Error(
      'Encryption key not configured. Add ENCRYPTION_KEY to .env'
    );
  }

  return crypto.scryptSync(key, 'salt', 32);
}

/**
 * Cifra un valor sensible
 */
export function encrypt(text: string, strapi): string {
  if (!text) return text;

  const key = getEncryptionKey(strapi);
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(String(text), 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('hex');
}

/**
 * Descifra un valor sensible
 */
export function decrypt(encryptedText: string, strapi): string {
  if (!encryptedText) return encryptedText;

  try {
    const key = getEncryptionKey(strapi);
    const stringValue = Buffer.from(String(encryptedText), 'hex');

    const salt = stringValue.subarray(0, SALT_LENGTH);
    const iv = stringValue.subarray(SALT_LENGTH, TAG_POSITION);
    const tag = stringValue.subarray(TAG_POSITION, ENCRYPTED_POSITION);
    const encrypted = stringValue.subarray(ENCRYPTED_POSITION);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    return decipher.update(encrypted) + decipher.final('utf8');
  } catch (error) {
    // Si falla el descifrado, puede ser texto plano (migración)
    strapi.log.warn('Failed to decrypt value, returning as-is');
    return encryptedText;
  }
}
```

**Paso 2:** Configurar encryption key

```typescript
// config/admin.ts (o admin.js)
export default ({ env }) => ({
  // ... otras configuraciones
  apiToken: {
    salt: env('API_TOKEN_SALT'),
    secrets: {
      // ✅ Esta clave se usa para cifrar tokens Y secretos del plugin
      encryptionKey: env('ENCRYPTION_KEY'),
    },
  },
});
```

**Paso 3:** Agregar a .env

```bash
# .env
# Generar con: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
ENCRYPTION_KEY=tu-clave-aleatoria-de-32-bytes-en-base64

# También necesitas
API_TOKEN_SALT=tu-salt-aleatorio
```

**Paso 4:** Actualizar controller para cifrar al guardar

```typescript
// server/src/controllers/configuration.ts
import { encrypt, decrypt } from '../utils/encryption';

export default ({ strapi }) => ({
  async get(ctx) {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-mercadopago',
    });

    const config = await pluginStore.get({ key: 'mercadopagoSetting' });

    if (!config) {
      return ctx.send({ ok: true, data: null });
    }

    // ✅ Descifrar antes de enviar al admin
    const decryptedConfig = {
      ...config,
      mercadoPagoToken: decrypt(config.mercadoPagoToken, strapi),
      webhookPass: decrypt(config.webhookPass, strapi),
    };

    return ctx.send({ ok: true, data: decryptedConfig });
  },

  async update(ctx) {
    const { data } = ctx.request.body;
    const {
      isActive,
      mercadoPagoToken,
      defaultCurrency,
      backUrls,
      webhookPass,
      notificationUrl,
      bussinessDescription,
      isActiveVerification,
    } = data;

    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-mercadopago',
    });

    // ✅ Cifrar antes de guardar
    const response = await pluginStore.set({
      key: 'mercadopagoSetting',
      value: {
        isActive,
        mercadoPagoToken: encrypt(mercadoPagoToken, strapi),
        defaultCurrency,
        backUrls,
        webhookPass: encrypt(webhookPass, strapi),
        notificationUrl,
        bussinessDescription,
        isActiveVerification,
      },
    });

    return ctx.send({ ok: true, response });
  },
});
```

**Paso 5:** Actualizar middleware para descifrar al leer

```typescript
// server/src/middlewares/configuration.ts
import { decrypt } from '../utils/encryption';

export const loadConfig = (config, { strapi }) => {
  return async (ctx, next) => {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-mercadopago',
    });

    const storedConfig = await pluginStore.get({ key: 'mercadopagoSetting' });

    if (!storedConfig?.mercadoPagoToken) {
      strapi.log.error('MercadoPago token not configured');
      return ctx.serviceUnavailable('Payment service not configured');
    }

    // ✅ Descifrar secretos al cargar
    ctx.state.config = {
      ...storedConfig,
      mercadoPagoToken: decrypt(storedConfig.mercadoPagoToken, strapi),
      webhookPass: decrypt(storedConfig.webhookPass, strapi),
    };

    await next();
  };
};
```

---

**Opción 2: Protección sin Cifrado (Más Simple, Solo para Desarrollo/Staging)**

Si decides no implementar cifrado por ahora, asegúrate de tener estas protecciones:

1. ✅ **Endpoint protegido con `auth: true`** (ya implementado en Fix #1)
2. ✅ **HTTPS obligatorio en producción** (datos cifrados en tránsito)
3. ✅ **Backups de DB cifrados** (a nivel de infraestructura)
4. ✅ **Acceso a DB restringido** (solo personal autorizado)
5. ✅ **Logs sanitizados** (no exponer tokens - ver Fix #7)
6. ✅ **Auditoría de accesos** (logs de quién accede a configuración)

**Nota:** Esta opción es común en muchos plugins de Strapi, confiando en:
- Sistema RBAC de Strapi (solo admins)
- HTTPS/TLS para protección en tránsito
- Seguridad a nivel de infraestructura

---

**Recomendación Final:**

| Entorno | Opción Recomendada | Razón |
|---------|-------------------|-------|
| **Producción** | Opción 1 (Cifrado) | Máxima seguridad, tokens cifrados en DB |
| **Staging** | Opción 1 o 2 | Depende de datos reales vs. datos de prueba |
| **Desarrollo** | Opción 2 (Sin cifrado) | Más simple, tokens de sandbox |

**Migración gradual:**
1. Implementar Fix #1 (auth) primero
2. Usar Opción 2 temporalmente
3. Implementar Opción 1 antes de producción

---
---

## 3. Validación de Entrada con Yup

### ❌ Problema Actual

**Ubicación:** `server/src/controllers/checkout.ts:10-13`

```typescript
// Sin validación de esquema
const { items = [], customer, fulfillment } = ctx.request.body || {};
if (items.length === 0) return ctx.badRequest();
// No valida tipos, formatos, rangos, etc.
```

**Riesgo:**
- Inyección de datos maliciosos
- Crash de aplicación con datos inesperados
- SQL/NoSQL injection potencial
- XSS si los datos se renderizan

### ✅ Solución

**Paso 1:** Instalar Yup

```bash
npm install yup
# o
yarn add yup
```

**Paso 2:** Crear schemas de validación

```typescript
// server/src/validators/checkout.validator.ts
import * as yup from 'yup';

export const checkoutSchema = yup.object({
  items: yup
    .array()
    .of(
      yup.object({
        sku: yup
          .string()
          .required('SKU is required')
          .max(100, 'SKU too long')
          .matches(/^[A-Za-z0-9-_]+$/, 'Invalid SKU format'),
        quantity: yup
          .number()
          .integer('Quantity must be integer')
          .min(1, 'Minimum quantity is 1')
          .max(999, 'Maximum quantity is 999')
          .required('Quantity is required'),
      })
    )
    .min(1, 'At least one item is required')
    .max(50, 'Maximum 50 items per order')
    .required('Items are required'),

  customer: yup.object({
    name: yup
      .string()
      .required('Name is required')
      .max(200, 'Name too long')
      .trim(),
    lastName: yup
      .string()
      .required('Last name is required')
      .max(200, 'Last name too long')
      .trim(),
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required')
      .lowercase()
      .trim(),
    dni: yup
      .string()
      .required('DNI is required')
      .matches(/^[0-9]{6,12}$/, 'DNI must be 6-12 digits'),
    phone: yup
      .string()
      .required('Phone is required')
      .matches(/^[0-9]{7,15}$/, 'Phone must be 7-15 digits'),
  }).required('Customer information is required'),

  fulfillment: yup.object({
    address: yup
      .string()
      .required('Address is required')
      .max(500, 'Address too long')
      .trim(),
    city: yup
      .string()
      .required('City is required')
      .max(100, 'City name too long')
      .trim(),
    department: yup
      .string()
      .required('Department is required')
      .max(100, 'Department name too long')
      .trim(),
    postalCode: yup
      .string()
      .optional()
      .max(20, 'Postal code too long')
      .matches(/^[0-9A-Za-z\s-]*$/, 'Invalid postal code format'),
    message: yup
      .string()
      .optional()
      .max(500, 'Message too long'),
  }).required('Fulfillment information is required'),
});
```

**Paso 3:** Crear middleware de validación

```typescript
// server/src/middlewares/validation.middleware.ts
import type { Schema } from 'yup';

export const validateRequest = (schema: Schema) => {
  return async (ctx, next) => {
    try {
      // Validar y sanitizar
      const validated = await schema.validate(ctx.request.body, {
        abortEarly: false,    // Retornar todos los errores
        stripUnknown: true,   // Eliminar campos no definidos
        strict: true,         // No hacer coerción de tipos
      });

      // Guardar datos validados en el contexto
      ctx.state.validated = validated;

      await next();
    } catch (error) {
      if (error.name === 'ValidationError') {
        return ctx.badRequest('Validation failed', {
          errors: error.errors,
          details: error.inner.map(err => ({
            path: err.path,
            message: err.message,
            value: err.value,
          })),
        });
      }
      throw error;
    }
  };
};
```

**Paso 4:** Aplicar en rutas

```typescript
// server/src/routes/checkout.ts
import { validateRequest } from '../middlewares/validation.middleware';
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
        validateRequest(checkoutSchema), // ✅ Validación
      ],
    },
  },
];
```

**Paso 5:** Usar datos validados en controller

```typescript
// server/src/controllers/checkout.ts
export default ({ strapi }) => ({
  async checkout(ctx) {
    const config = ctx.state.config;
    const validatedData = ctx.state.validated; // ✅ Ya validado y sanitizado

    // Ya no necesitas validar aquí
    try {
      const result = await strapi
        .service('plugin::strapi-mercadopago.checkout')
        .processCheckout(validatedData, config);

      return ctx.send(result);
    } catch (error) {
      return ctx.internalServerError(error.message);
    }
  },
});
```

---

## 4. Corregir Idempotency Key Estático

### ❌ Problema Actual

**Ubicación:** `server/src/services/sdk.ts:79,118`

```typescript
const client = new MercadoPagoConfig({
  accessToken: mercadoPagoToken,
  options: {
    timeout: 5000,
    idempotencyKey: "abc", // ⚠️ SIEMPRE EL MISMO
  },
});
```

**Riesgo:**
- MercadoPago rechaza requests duplicados con mismo idempotency key
- Imposible reintentar requests fallidos
- Anula la protección contra duplicados

### ✅ Solución

**Paso 1:** Instalar uuid

```bash
npm install uuid
npm install --save-dev @types/uuid

# o
yarn add uuid
yarn add -D @types/uuid
```

**Paso 2:** Generar idempotency key único

```typescript
// server/src/services/sdk.ts
import { v4 as uuidv4 } from 'uuid';

export default ({ strapi }) => ({
  createPreference: async (payload, config) => {
    const { mercadoPagoToken } = config;

    // ✅ Generar key único por request
    const client = new MercadoPagoConfig({
      accessToken: mercadoPagoToken,
      options: {
        timeout: 10000,
        idempotencyKey: uuidv4(), // ✅ Único cada vez
      },
    });

    // ...resto del código
  },

  paymentAction: async (payload, config) => {
    const { mercadoPagoToken } = config;

    const client = new MercadoPagoConfig({
      accessToken: mercadoPagoToken,
      options: {
        timeout: 10000,
        idempotencyKey: uuidv4(), // ✅ Único cada vez
      },
    });

    // ...resto del código
  },
});
```

**Alternativa:** Usar timestamp + requestId

```typescript
// Si no quieres agregar dependencia
const generateIdempotencyKey = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${timestamp}-${random}`;
};

const client = new MercadoPagoConfig({
  accessToken: mercadoPagoToken,
  options: {
    timeout: 10000,
    idempotencyKey: generateIdempotencyKey(),
  },
});
```

---

## 5. Corregir Race Condition en Actualización de Stock

### ❌ Problema Actual

**Ubicación:** `server/src/services/sdk.ts:177-198`

```typescript
// ⚠️ PELIGRO: forEach no espera las promesas
await items.forEach(async (product) => {
  const dbproduct = await strapi
    .query("plugin::strapi-mercadopago.product")
    .findOne({ where: { sku: product.id } });

  if (dbproduct) {
    // ⚠️ READ-MODIFY-WRITE no atómico
    const newStock = Number(dbproduct.stock) - Number(product.quantity);
    await strapi
      .query("plugin::strapi-mercadopago.product")
      .update({
        where: { sku: product.id },
        data: { stock: newStock },
      });
  }
});
```

**Riesgo:**
- `forEach` no espera promesas (código continúa inmediatamente)
- Dos webhooks simultáneos pueden sobrevender
- Pattern READ-MODIFY-WRITE no es atómico

### ✅ Solución

**Paso 1:** Usar transacciones con operación atómica

```typescript
// server/src/services/sdk.ts
export default ({ strapi }) => ({
  paymentAction: async (payload, config) => {
    // ... código previo ...

    if (status === INVOICES_STATUS.APPROVED) {
      // ✅ Usar transacción para atomicidad
      await strapi.db.transaction(async (trx) => {
        // 1. Actualizar orden
        await trx
          .query('plugin::strapi-mercadopago.order')
          .update({
            where: { id: invoiceId },
            data: {
              payment_status: status,
              paid_with: payment_type_id,
            },
          });

        // 2. Reducir stock de cada producto ATÓMICAMENTE
        for (const item of items) {
          // ✅ Operación SQL atómica con verificación
          const result = await trx.raw(`
            UPDATE products
            SET stock = stock - ?
            WHERE sku = ?
              AND stock >= ?
              AND id IN (
                SELECT id FROM products
                WHERE sku = ?
                FOR UPDATE  -- Lock de fila
              )
          `, [item.quantity, item.id, item.quantity, item.id]);

          // Verificar que se actualizó
          if (result.affectedRows === 0) {
            // Stock insuficiente o producto no existe
            strapi.log.error(`Insufficient stock for product ${item.id}`);
            throw new Error(`Insufficient stock for product ${item.id}`);
          }

          strapi.log.info(
            `Product ${item.id} stock reduced by ${item.quantity}`
          );
        }
      });
    }
  },
});
```

**Paso 2:** Alternativa con for...of (más simple pero menos seguro)

```typescript
// Si no puedes usar SQL raw, al menos usa for...of en vez de forEach
if (status === INVOICES_STATUS.APPROVED) {
  await strapi.db.transaction(async (trx) => {
    // Actualizar orden
    await trx
      .query('plugin::strapi-mercadopago.order')
      .update({
        where: { id: invoiceId },
        data: {
          payment_status: status,
          paid_with: payment_type_id,
        },
      });

    // ✅ for...of en vez de forEach
    for (const item of items) {
      const product = await trx
        .query('plugin::strapi-mercadopago.product')
        .findOne({ where: { sku: item.id } });

      if (product) {
        // Verificar stock antes de reducir
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${item.id}`);
        }

        const newStock = Number(product.stock) - Number(item.quantity);

        await trx
          .query('plugin::strapi-mercadopago.product')
          .update({
            where: { sku: item.id },
            data: { stock: newStock },
          });

        strapi.log.info(
          `Product ${item.id} stock updated to ${newStock}`
        );
      }
    }
  });
}
```

---

## 6. Implementar Idempotencia en Webhooks

### ❌ Problema Actual

**Ubicación:** `server/src/services/sdk.ts:155-158`

```typescript
// Check débil de idempotencia
if (invoice.payment_status === INVOICES_STATUS.APPROVED) {
  strapi.log.warn(`Order: On retry but it has status approved`);
  return;
}
// Si dos webhooks llegan simultáneamente, ambos pasan este check
```

**Riesgo:**
- Dos webhooks simultáneos pueden procesar el mismo pago dos veces
- Doble reducción de stock
- Inconsistencia de datos

### ✅ Solución

**Paso 1:** Crear tabla de eventos procesados

```typescript
// server/src/content-types/payment-event/schema.json
{
  "kind": "collectionType",
  "collectionName": "payment_events",
  "info": {
    "singularName": "payment-event",
    "pluralName": "payment-events",
    "displayName": "Payment Event",
    "description": "Track processed payment events for idempotency"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "payment_id": {
      "type": "string",
      "required": true,
      "unique": false
    },
    "event_type": {
      "type": "string",
      "required": true
    },
    "status": {
      "type": "string",
      "required": true
    },
    "idempotency_key": {
      "type": "string",
      "required": true,
      "unique": true
    },
    "processed_at": {
      "type": "datetime",
      "required": true
    },
    "webhook_data": {
      "type": "json"
    }
  }
}
```

**Paso 2:** Crear índice único en idempotency_key

```typescript
// server/src/bootstrap.ts
export default async ({ strapi }) => {
  // Crear índice único si no existe
  const hasIndex = await strapi.db.connection.schema.hasTable('payment_events');

  if (hasIndex) {
    await strapi.db.connection.raw(`
      CREATE UNIQUE INDEX IF NOT EXISTS payment_events_idempotency_key_unique
      ON payment_events (idempotency_key)
    `);
  }

  strapi.log.info('MercadoPago plugin initialized');
};
```

**Paso 3:** Usar idempotency key en webhook processing

```typescript
// server/src/services/sdk.ts
export default ({ strapi }) => ({
  paymentAction: async (payload, config) => {
    const { data: { id: paymentId } } = payload;

    // ... obtener payment data ...

    const { status, external_reference: invoiceId } = paymentData;

    // ✅ Crear idempotency key único
    const idempotencyKey = `payment-${paymentId}-${status}-${invoiceId}`;

    try {
      await strapi.db.transaction(async (trx) => {
        // ✅ Intentar crear evento (fallará si ya existe)
        try {
          await trx.query('plugin::strapi-mercadopago.payment-event').create({
            data: {
              payment_id: paymentId,
              event_type: 'payment.update',
              status: status,
              idempotency_key: idempotencyKey,
              processed_at: new Date(),
              webhook_data: paymentData,
            },
          });
        } catch (error) {
          // Si falla por duplicate key, ya fue procesado
          if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
            strapi.log.warn(`Payment ${paymentId} already processed (idempotent)`);
            return; // Salir sin error
          }
          throw error;
        }

        // Si llegamos aquí, es la primera vez que procesamos este evento
        // Continuar con la lógica de procesamiento...

        if (status === INVOICES_STATUS.APPROVED) {
          // Actualizar orden
          await trx.query('plugin::strapi-mercadopago.order').update({
            where: { id: invoiceId },
            data: {
              payment_status: status,
              paid_with: payment_type_id,
            },
          });

          // Reducir stock
          for (const item of items) {
            // ... lógica de reducción de stock ...
          }
        }
      });
    } catch (error) {
      strapi.log.error('Error processing payment webhook', error);
      throw error;
    }
  },
});
```

---

## 7. Sanitizar Logs

### ❌ Problema Actual

**Ubicación:** `server/src/middlewares/webhooksign.ts:42,52-53`

```typescript
// ⚠️ Loguea el webhook secret
console.debug({ ts, hash, dataID, xRequestId, webhookPass });
console.log(sha);
console.log(hash);
```

**Riesgo:**
- Secretos expuestos en logs de producción
- Visible en sistemas de logging (Datadog, CloudWatch, etc.)

### ✅ Solución

```typescript
// server/src/middlewares/webhooksign.ts
export const verifySign = (config, { strapi }) => {
  return async (ctx, next) => {
    const { isActiveVerification = false } = ctx.state.config;

    try {
      if (!isActiveVerification) {
        strapi.log.warn('Webhook signature verification is DISABLED');
        return next();
      }

      const xSignature = ctx.request.headers["x-signature"] || "";
      const xRequestId = ctx.request.headers["x-request-id"] || "";
      const dataID = ctx.request.query?.["data.id"] || "";

      const { config: { webhookPass } } = ctx.state;

      let ts = "";
      let hash = "";

      if (xSignature) {
        const parts = xSignature.split(",");
        parts.forEach((part) => {
          const [key, value] = part.split("=");
          if (key && value) {
            const trimmedKey = key.trim();
            const trimmedValue = value.trim();
            if (trimmedKey === "ts") ts = trimmedValue;
            else if (trimmedKey === "v1") hash = trimmedValue;
          }
        });
      }

      // ✅ LOG SANITIZADO (sin secretos)
      strapi.log.debug('Webhook verification attempt', {
        hasSignature: !!xSignature,
        hasRequestId: !!xRequestId,
        hasDataId: !!dataID,
        hasTimestamp: !!ts,
        hasHash: !!hash,
        // NO loguear: webhookPass, sha completo, hash completo
      });

      if (ts && hash && dataID && xRequestId) {
        const secret = webhookPass;
        const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(manifest);
        const sha = hmac.digest("hex");

        if (sha === hash) {
          strapi.log.info('Webhook signature verified successfully');
          return next();
        } else {
          // ✅ Solo loguear que falló, no los valores
          strapi.log.warn('Webhook signature verification failed', {
            dataId: dataID,
            requestId: xRequestId,
            // NO loguear hash ni sha
          });
          return ctx.unauthorized('Invalid signature');
        }
      } else {
        strapi.log.warn('Missing webhook signature parameters', {
          hasTs: !!ts,
          hasHash: !!hash,
          hasDataId: !!dataID,
          hasRequestId: !!xRequestId,
        });
        return ctx.badRequest('Missing signature parameters');
      }
    } catch (error) {
      strapi.log.error('Error in webhook signature verification', {
        error: error.message,
        // NO loguear el stack trace completo en producción
      });
      return ctx.internalServerError('Signature verification error');
    }
  };
};
```

---

## 8. Reemplazar console.log con strapi.log

### ❌ Problema Actual

Uso de `console.log` y `console.debug` en vez del logger de Strapi.

### ✅ Solución

**Buscar y reemplazar en todo el proyecto:**

```typescript
// ❌ ANTES
console.log('mensaje');
console.debug({ data });
console.error('error');
console.warn('warning');

// ✅ DESPUÉS
strapi.log.info('mensaje');
strapi.log.debug({ data });
strapi.log.error('error');
strapi.log.warn('warning');
```

**Beneficios:**
- Logs estructurados
- Niveles de log configurables
- Integración con sistemas externos
- Mejor formato

---

## 📋 Checklist de Implementación

### Semana 1
- [ ] 1. Cambiar `auth: false` a `auth: true` en rutas de configuración
- [ ] 2. OPCIONAL: Implementar cifrado de secretos
  - [ ] 2a. Crear `utils/encryption.ts` (funciones encrypt/decrypt)
  - [ ] 2b. Configurar `ENCRYPTION_KEY` en `config/admin.ts` y `.env`
  - [ ] 2c. Actualizar controller para cifrar/descifrar
  - [ ] 2d. Actualizar middleware para descifrar
  - [ ] **Alternativa:** Usar protección básica (auth + HTTPS) sin cifrado
- [ ] 3. Instalar Yup
- [ ] 3. Crear schemas de validación
- [ ] 3. Crear middleware de validación

### Semana 2
- [ ] 3. Aplicar validación en rutas
- [ ] 4. Instalar uuid
- [ ] 4. Generar idempotency keys dinámicos
- [ ] 5. Implementar transacciones para stock
- [ ] 5. Cambiar `forEach` por `for...of`
- [ ] 6. Crear content-type `payment-event`
- [ ] 6. Implementar idempotencia en webhooks
- [ ] 7. Sanitizar logs
- [ ] 8. Reemplazar console.log

### Testing Final
- [ ] Probar endpoints sin auth (deben fallar con 401)
- [ ] Probar endpoints con auth de admin (deben funcionar)
- [ ] Probar checkout con datos inválidos (debe retornar 400)
- [ ] Probar webhook duplicado (debe ser idempotente)
- [ ] Verificar que logs no exponen secretos
- [ ] Si implementaste cifrado: verificar que tokens están cifrados en DB

---

## 🧪 Scripts de Verificación

```bash
# 1. Verificar que secretos no están en código
grep -r "APP_USR" server/src/
grep -r "mercadoPagoToken" server/src/
# No debe haber valores hardcodeados

# 2. Verificar que no hay console.log
grep -r "console\." server/src/
# Solo debe haber strapi.log

# 3. Verificar validación aplicada
grep -r "validateRequest" server/src/routes/
# Debe aparecer en todas las rutas POST

# 4. Verificar transacciones
grep -r "strapi.db.transaction" server/src/
# Debe aparecer en paymentAction

# 5. Run tests
npm run test
```

---

## ⚠️ Notas Importantes

1. **Backup antes de cambios:** Haz backup de la base de datos antes de implementar transacciones

2. **Testing exhaustivo:** Prueba especialmente:
   - Webhooks duplicados
   - Reducción de stock con concurrencia
   - Validación de entrada con payloads maliciosos

3. **Variables de entorno:** Asegúrate de configurar todas las env vars en producción

4. **Logs:** Revisa logs después del deploy para verificar que no hay secretos expuestos

5. **Performance:** Las transacciones pueden ser más lentas, monitorea tiempos de respuesta

---

## 📖 Siguiente Paso

Una vez completados estos fixes críticos, puedes proceder con la migración a **Service Layer Pattern** siguiendo el plan en `PLAN_MIGRACION_SERVICE_LAYER.md`.
