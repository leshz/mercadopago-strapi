# Comparación de Arquitecturas: Clean vs Pragmática

## Resumen Ejecutivo

Este documento compara las dos propuestas arquitecturales para el plugin MercadoPago:

1. **Clean Architecture Completa** (documento: `MEJORAS_ARQUITECTURA_LIMPIA.md`)
2. **Service Layer Pattern Mejorado** ⭐ (documento: `ARQUITECTURAS_PRAGMATICAS.md`)

---

## 📊 Comparación Rápida

| Aspecto | Clean Architecture | Service Layer Pattern |
|---------|-------------------|----------------------|
| **Capas** | 4 (Domain, Application, Infrastructure, Presentation) | 2 (Controllers → Services) |
| **Archivos nuevos** | ~30 archivos | ~10 archivos |
| **Tiempo de implementación** | 12 semanas | 6 semanas |
| **Curva de aprendizaje** | Alta (requiere conocer DDD) | Baja (conceptos básicos) |
| **Fricción con Strapi** | ⚠️ Alta | ✅ Mínima |
| **Compatibilidad con factories** | ❌ Requiere wrappers | ✅ Usa factories nativos |
| **Testing** | ✅ Excelente (pero complejo setup) | ✅ Bueno (setup simple) |
| **Mantenibilidad** | ✅ Excelente (si el equipo conoce DDD) | ✅ Buena (más intuitivo) |
| **Escalabilidad** | ✅ Excelente (pero overhead inicial) | ✅ Buena (crece con el proyecto) |
| **Overhead de código** | 🔴 Alto (mappers, DI, interfaces) | 🟢 Bajo |
| **Recomendado para** | Equipos grandes, productos complejos | Plugins, equipos pequeños |

---

## 🏗️ Estructura de Carpetas

### Clean Architecture (4 Capas)

```
server/src/
├── domain/                    # Capa 1: Lógica de negocio pura
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/         # Interfaces
│   └── services/
│
├── application/              # Capa 2: Casos de uso
│   ├── use-cases/
│   ├── ports/                # Interfaces para infra
│   └── mappers/              # DTO ↔ Entity
│
├── infrastructure/           # Capa 3: Implementaciones
│   ├── repositories/         # Implementaciones concretas
│   ├── gateways/
│   └── adapters/
│
├── presentation/             # Capa 4: API/UI
│   ├── controllers/
│   ├── middlewares/
│   └── validators/
│
└── di/                       # Dependency Injection
    └── container.ts
```

**Flujo de datos:**
```
Controller → Use Case → Domain Service → Repository (interface)
                                              ↓
                                    StrapiRepository (implementation)
```

**Ejemplo de llamada:**
```typescript
// Controller
const useCase = container.resolve('ProcessCheckoutUseCase');
await useCase.execute(dto);

// Use Case
const order = Order.create(data); // Entity con lógica
await this.orderRepository.save(order); // Interface
const preference = await this.paymentGateway.create(); // Port

// Infrastructure
class StrapiOrderRepository implements IOrderRepository {
  async save(order: Order) {
    const data = OrderMapper.toPersistence(order); // Mapper
    await strapi.entityService.create('...', { data });
  }
}
```

---

### Service Layer Pattern (2 Capas)

```
server/src/
├── controllers/              # Capa 1: Orquestación
│   ├── checkout.controller.ts
│   └── payment.controller.ts
│
├── services/                 # Capa 2: Lógica de negocio
│   ├── checkout/
│   │   ├── checkout.service.ts
│   │   └── preference.service.ts
│   ├── payment/
│   │   └── payment-notification.service.ts
│   └── external/
│       └── mercadopago.gateway.ts  # Abstracción opcional
│
├── validators/               # Validación
│   └── checkout.validator.ts
│
└── middlewares/
    └── validation.middleware.ts
```

**Flujo de datos:**
```
Controller → Service → Strapi Entity Service → Database
                  ↓
            Gateway (opcional para APIs externas)
```

**Ejemplo de llamada:**
```typescript
// Controller
const result = await strapi
  .service('plugin::strapi-mercadopago.checkout')
  .processCheckout(data, config);

// Service (usando factory de Strapi)
export default factories.createCoreService('...order', ({ strapi }) => ({
  async processCheckout(data, config) {
    // Lógica directa, sin mappers
    const order = await strapi.entityService.create('...', { data });
    const preference = await strapi.service('...gateway').create();
    return { orderId: order.id };
  },
}));
```

---

## 🎯 Decisión por Escenario

### Escenario 1: Plugin Simple/Mediano (como MercadoPago)

**Características:**
- 3-5 features principales
- Equipo pequeño (1-3 desarrolladores)
- Integraciones con 1-2 APIs externas
- Lógica de negocio moderada

**Recomendación:** ⭐ **Service Layer Pattern**

**Razón:**
```
✅ Implementación rápida (6 semanas)
✅ Fácil de entender para nuevos devs
✅ Aprovecha features de Strapi
✅ Suficiente separación de responsabilidades
✅ Testeable sin complejidad excesiva
```

---

### Escenario 2: Sistema Complejo Multi-Tenant

**Características:**
- 10+ features complejas
- Equipo grande (5+ desarrolladores)
- Múltiples integraciones externas
- Lógica de negocio compleja (reglas de pricing, workflows)
- Necesidad de cambiar infraestructura frecuentemente

**Recomendación:** **Clean Architecture**

**Razón:**
```
✅ Lógica de negocio completamente aislada
✅ Fácil cambiar de Strapi a otro framework
✅ Testing unitario exhaustivo
✅ Equipos pueden trabajar en capas independientes
✅ Escalable a largo plazo
```

---

## 💰 Análisis Costo-Beneficio

### Clean Architecture

**Costos:**
- ⏰ **Tiempo:** 12 semanas de desarrollo inicial
- 📚 **Aprendizaje:** Equipo necesita conocer DDD, SOLID, Clean Arch
- 🔧 **Mantenimiento:** Más archivos, más abstracciones
- 🐛 **Debug:** Más capas = más lugares donde buscar bugs
- 🔄 **Refactoring:** Cambios simples requieren tocar múltiples capas

**Beneficios:**
- ✅ Lógica de negocio portable (no depende de Strapi)
- ✅ Testing unitario puro (sin mocks de Strapi)
- ✅ Cambiar infraestructura es trivial
- ✅ Equipos grandes pueden trabajar en paralelo
- ✅ Código extremadamente mantenible a largo plazo

**ROI:** Positivo después de **18-24 meses** en proyectos grandes

---

### Service Layer Pattern

**Costos:**
- ⏰ **Tiempo:** 6 semanas de desarrollo inicial
- 📚 **Aprendizaje:** Conceptos básicos de separación de responsabilidades
- 🔧 **Mantenimiento:** Menos archivos, menos abstracciones
- 🔄 **Cambio de framework:** Requeriría refactoring significativo

**Beneficios:**
- ✅ Implementación rápida (50% más rápido)
- ✅ Código intuitivo (fácil onboarding)
- ✅ Aprovecha ecosystem de Strapi
- ✅ Testing adecuado (con mocks de Strapi)
- ✅ Suficiente para plugins estándar

**ROI:** Positivo **inmediatamente** en plugins pequeños/medianos

---

## 🧪 Testing Comparison

### Clean Architecture

```typescript
// ✅ Test unitario PURO (sin Strapi)
describe('ProcessCheckoutUseCase', () => {
  it('should create order and preference', async () => {
    // Mocks puros
    const mockOrderRepo = new InMemoryOrderRepository();
    const mockProductRepo = new InMemoryProductRepository();
    const mockGateway = new MockPaymentGateway();

    const useCase = new ProcessCheckoutUseCase(
      mockOrderRepo,
      mockProductRepo,
      mockGateway
    );

    // No necesitas Strapi running
    const result = await useCase.execute(mockDTO);

    expect(result.orderId).toBeDefined();
    expect(mockOrderRepo.orders.length).toBe(1);
  });
});
```

**Pros:**
- ✅ Tests rápidos (sin DB, sin Strapi)
- ✅ Aisla lógica de negocio completamente

**Contras:**
- ⚠️ Necesitas crear repositorios in-memory
- ⚠️ Necesitas mappers de prueba

---

### Service Layer Pattern

```typescript
// ✅ Test de integración con Strapi
describe('CheckoutService', () => {
  it('should create order and preference', async () => {
    // Mock solo el gateway externo
    const mockGateway = jest.fn().mockResolvedValue({
      id: 'PREF-123',
      init_point: 'https://mp.com/checkout',
    });

    // Inyectar mock
    strapi.service = jest.fn((name) => {
      if (name.includes('gateway')) return { create: mockGateway };
      return originalService(name);
    });

    const result = await strapi
      .service('plugin::strapi-mercadopago.checkout')
      .processCheckout(mockData, mockConfig);

    expect(result.orderId).toBeDefined();
    expect(mockGateway).toHaveBeenCalled();
  });
});
```

**Pros:**
- ✅ Setup más simple
- ✅ Aprovecha Strapi test utilities

**Contras:**
- ⚠️ Tests más lentos (requiere DB)
- ⚠️ Necesitas Strapi test environment

---

## 🔄 Migración del Código Actual

### Clean Architecture Migration

**Paso 1:** Crear entidades de dominio
```typescript
// sdk.ts (218 líneas) →
//   domain/entities/Order.ts (80 líneas)
//   domain/entities/Product.ts (50 líneas)
//   domain/value-objects/Money.ts (40 líneas)
```

**Paso 2:** Crear use cases
```typescript
// controllers/checkout.ts →
//   application/use-cases/ProcessCheckout.usecase.ts
```

**Paso 3:** Crear repositorios
```typescript
// services/order.ts →
//   domain/repositories/IOrderRepository.ts
//   infrastructure/repositories/StrapiOrderRepository.ts
```

**Paso 4:** Crear gateway
```typescript
// services/sdk.ts →
//   application/ports/IPaymentGateway.ts
//   infrastructure/gateways/MercadoPagoGateway.ts
```

**Paso 5:** Setup DI container

**Total:** ~30 archivos nuevos, 12 semanas

---

### Service Layer Migration

**Paso 1:** Separar sdk.ts en services
```typescript
// sdk.ts (218 líneas) →
//   services/checkout/checkout.service.ts (40 líneas)
//   services/checkout/preference.service.ts (50 líneas)
//   services/payment/payment-notification.service.ts (60 líneas)
//   services/external/mercadopago.gateway.ts (60 líneas)
```

**Paso 2:** Adelgazar controllers
```typescript
// controllers/checkout.ts (78 líneas) →
//   controllers/checkout.ts (20 líneas)
//   validators/checkout.validator.ts (30 líneas)
```

**Paso 3:** Agregar validadores

**Total:** ~10 archivos nuevos, 6 semanas

---

## 🎓 Recomendaciones por Experiencia del Equipo

### Equipo Junior/Mixed

**Recomendación:** **Service Layer Pattern**

**Razón:**
- Conceptos más accesibles (services, controllers)
- Menos abstracciones que aprender
- Documentación abundante de Strapi
- Menor riesgo de sobre-ingeniería

**Path de aprendizaje:**
```
Semana 1-2: Entender factories de Strapi
Semana 3-4: Implementar validators y services
Semana 5-6: Testing básico
```

---

### Equipo Senior con experiencia en DDD

**Recomendación:** **Clean Architecture** (si el proyecto lo justifica)

**Razón:**
- El equipo ya conoce los patrones
- Pueden implementar rápido
- Aprecian la separación estricta
- Saben cuándo NO aplicar ciertos patrones

**Path de implementación:**
```
Semana 1-3: Setup de capas y DI
Semana 4-6: Migrar lógica a entities/use cases
Semana 7-9: Implementar repositories/gateways
Semana 10-12: Testing exhaustivo
```

---

## ✅ Recomendación Final para Este Plugin

### Para MercadoPago Plugin: **Service Layer Pattern** ⭐

**Razones específicas:**

1. **Complejidad del dominio:** MEDIA
   - No hay reglas de negocio super complejas
   - Principalmente orquestación (API calls + DB updates)
   - No requiere entities ricas con comportamiento

2. **Equipo probable:** 1-3 desarrolladores
   - Onboarding rápido es importante
   - No hay especialización por capas

3. **Integración con Strapi:** CRÍTICA
   - Es un PLUGIN de Strapi (no app standalone)
   - Debe aprovechar Entity Service, lifecycles
   - Usuarios esperan código familiar

4. **Timeline:** IMPORTANTE
   - 6 semanas vs 12 semanas
   - ROI más rápido

5. **Mantenibilidad:** SUFICIENTE
   - Services de 30-50 líneas son fáciles de entender
   - Separación de validators, gateway es suficiente
   - Testing adecuado sin complejidad

---

## 🚀 Plan de Acción Recomendado

### Fase 1: Mejoras Críticas de Seguridad (2 semanas)
```
✅ Aplicables a AMBAS arquitecturas
✅ No requieren decisión arquitectural
✅ URGENTE para producción

- Proteger endpoints /configuration
- Mover secretos a .env
- Agregar validación de entrada
- Corregir race conditions en stock
- Fix idempotency key estático
```

### Fase 2: Refactoring Arquitectural (4 semanas)
```
✅ Service Layer Pattern

- Separar sdk.ts en services pequeños
- Crear mercadopago.gateway.ts
- Adelgazar controllers
- Agregar validators con Yup
```

### Fase 3: Testing & Calidad (2 semanas)
```
✅ Tests de services
✅ Tests de integración
✅ Coverage >80%
```

**Total: 8 semanas** (vs 14 semanas con Clean Arch)

---

## 📈 Cuándo Migrar a Clean Architecture

**Señales de que necesitas Clean Architecture:**

1. ✅ El plugin creció a >20 services complejos
2. ✅ Necesitas reutilizar lógica en múltiples contextos
3. ✅ Planeas migrar de Strapi a otro framework
4. ✅ Tienes reglas de negocio complejas (ej: pricing engine)
5. ✅ Equipo de 5+ desarrolladores trabajando en paralelo

**Si ves estas señales:** Refactoriza gradualmente hacia Clean Architecture.

**Si no:** Mantén Service Layer Pattern (es suficiente).

---

## 🎯 Decisión Final

| Criterio | Peso | Clean Arch | Service Layer |
|----------|------|-----------|---------------|
| **Tiempo de implementación** | 🔴 Alto | 4/10 | 9/10 |
| **Integración con Strapi** | 🔴 Alto | 5/10 | 10/10 |
| **Mantenibilidad** | 🟡 Medio | 10/10 | 8/10 |
| **Testabilidad** | 🟡 Medio | 10/10 | 7/10 |
| **Curva aprendizaje** | 🟡 Medio | 4/10 | 9/10 |
| **Escalabilidad** | 🟢 Bajo | 10/10 | 7/10 |

**Score Final:**
- **Clean Architecture:** 6.5/10
- **Service Layer Pattern:** 8.5/10 ⭐

---

## 📚 Documentos de Referencia

1. **MEJORAS_ARQUITECTURA_LIMPIA.md**
   - Plan completo de Clean Architecture
   - 45+ mejoras identificadas
   - Implementación en 12 semanas

2. **ARQUITECTURAS_PRAGMATICAS.md**
   - Service Layer Pattern (recomendado)
   - Feature-Sliced Design
   - Hexagonal Lite
   - Implementación en 6 semanas

3. **Este documento (COMPARACION_ARQUITECTURAS.md)**
   - Comparación detallada
   - Decisiones por escenario
   - Recomendación final

---

## 🎬 Conclusión

**Para el plugin MercadoPago de Strapi:**

```
✅ RECOMENDADO: Service Layer Pattern Mejorado

Razones:
- Implementación en 6 semanas (vs 12)
- Compatible al 100% con Strapi
- Suficiente separación de responsabilidades
- ROI inmediato
- Mantenible y testeable
- Fácil de entender para el equipo
```

**No necesitas Clean Architecture completa para tener código de calidad.**

El Service Layer Pattern te da **90% de los beneficios con 30% de la complejidad**.

---

**Próximos pasos:**
1. Revisar ambos documentos
2. Decidir arquitectura
3. Empezar con Fase 1 (seguridad) - aplicable a ambas
4. Continuar con refactoring elegido
