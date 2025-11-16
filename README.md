# MercadoPago Plugin for Strapi v5

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Strapi Version](https://img.shields.io/badge/Strapi-v5.x.x-orange.svg)](https://strapi.io)  
[![MercadoPago API](https://img.shields.io/badge/MercadoPago-API-blue)](https://www.mercadopago.com.co/developers)

A powerful plugin for integrating **MercadoPago** integration with **Strapi** CMS. This plugin simplifies the integration process, allowing you to easily handle payments, magane products with a soft ecommerce  with MercadoPago's API.

---

## 📖 Table of Contents

1. [Architecture & Improvements](#-architecture--improvements) ⭐ NEW
2. [Features](#-features)
3. [Requirements](#-requirements)
4. [Installation](#-installation)
5. [Configuration](#-configuration)
6. [Usage](#-usage)
7. [API Endpoints](#-api-endpoints)
8. [Contributing](#-contributing)
9. [License](#-license)

---

## 🏗️ Architecture & Improvements

> **⚠️ IMPORTANT:** This plugin has critical security issues that must be addressed before production use.

We've conducted a comprehensive review and created an actionable improvement plan based on **Service Layer Pattern** and **Strapi v5 best practices**.

### 📚 Documentation

#### 🔴 [FIXES_CRITICOS_SEGURIDAD.md](./FIXES_CRITICOS_SEGURIDAD.md) - **START HERE**
**Critical security fixes that MUST be implemented before production.**

- ⚠️ 8 critical security vulnerabilities identified
- 🔧 Step-by-step fixes with code examples
- ⏱️ Implementation time: 1-2 weeks
- 🎯 Priority: **URGENT**

**Issues covered:**
1. Unprotected configuration endpoints (anyone can read your MercadoPago token!)
2. Secrets stored in plaintext in database
3. Missing input validation (injection vulnerabilities)
4. Race conditions in stock management
5. Static idempotency key (breaks payment protection)
6. forEach with async (operations not completed)
7. Sensitive data in logs
8. console.log instead of structured logging

#### 📘 [PLAN_MIGRACION_SERVICE_LAYER.md](./PLAN_MIGRACION_SERVICE_LAYER.md)
**Complete migration plan to Service Layer Pattern architecture.**

- 🏗️ Service Layer Pattern (recommended architecture)
- 📅 Week-by-week implementation plan (4 weeks)
- 💻 Complete code examples for all services
- ✅ Testing strategy and checklist
- 📊 Before/after architecture comparison

**Refactoring includes:**
- Separating `sdk.ts` (218 lines) into focused services
- Creating gateway abstraction for MercadoPago API
- Implementing single-responsibility services
- Adding comprehensive tests (>80% coverage)

### ⚠️ Critical Issues Summary

**Before production deployment, you MUST fix:**

| Issue | Risk | Location |
|-------|------|----------|
| Unprotected config endpoints | 🔴 Critical | `routes/configuration.ts` |
| Plaintext secrets in DB | 🔴 Critical | `middlewares/configuration.ts` |
| No input validation | 🔴 Critical | `controllers/checkout.ts` |
| Race condition in stock | 🔴 Critical | `services/sdk.ts:177` |
| Static idempotency key | 🔴 Critical | `services/sdk.ts:79` |

### 🚀 Recommended Implementation Path

```bash
# Step 1: Security Fixes (URGENT - 1-2 weeks)
📖 Read FIXES_CRITICOS_SEGURIDAD.md
✅ Implement all 8 critical fixes
🧪 Test security improvements

# Step 2: Architecture Refactoring (4 weeks)
📖 Read PLAN_MIGRACION_SERVICE_LAYER.md
✅ Week 1: Create gateway and helpers
✅ Week 2: Refactor checkout services
✅ Week 3: Refactor payment services
✅ Week 4: Testing and documentation
```

### 💡 Why Service Layer Pattern?

- ✅ Works **with** Strapi (uses factories and Entity Service)
- ✅ Minimal friction (no complex abstractions)
- ✅ Fast implementation (4 weeks vs 12 weeks for Clean Architecture)
- ✅ Easy to understand and maintain
- ✅ Testable without complex mocking
- ✅ Each service <60 lines (vs 218 lines monolith)

---

## ✨ Features

- Seamless integration with the MercadoPago API.
- Support for creating and managing payments.
- Webhook support for real-time payment notifications.
- Fully customizable for your Strapi project needs.

---

## 🔧 Requirements

- **Node.js**: v20.17.0 
- **Strapi**: v5.x.x  
- **MercadoPago API Key**: You can generate this key from your [MercadoPago account](https://www.mercadopago.com).

---

## 🚀 Installation

To install the plugin, follow these steps:

```bash
# Navigate to your Strapi project
cd my-strapi-project

# Install the plugin via npm
npm install mercadopago-strapi

# OR using yarn
yarn add mercadopago-strapi
```

---

## ⚙️ Configuration

1. Add your **MercadoPago API Key** to the plugin configuration.  
   Edit the `config/plugins.js` file:

   ```javascript
  export default () => ({
    'strapi-mercadopago': {
      enabled: true,
    },
  });
   ```

2. Restart your Strapi application.

---

## 📚 Usage

The plugin provides an easy-to-use interface within the Strapi admin panel to manage MercadoPago operations.

- **Payments**: Create and monitor payments.  
- **Subscriptions**: Handle recurring payments.  
- **Webhooks**: Configure your webhooks for real-time payment updates.

---

## 🌐 API Endpoints

The following endpoints are available out of the box:

1. **Create Payment**  
   `POST /mercadopago/payment`  
   Payload example:
   ```json
   {
     "amount": 100.0,
     "description": "Product description",
     "payer_email": "user@example.com"
   }
   ```

2. **Get Payment Status**  
   `GET /mercadopago/payment/:id`

3. **Webhook Listener**  
   `POST /mercadopago/webhook`

Refer to the [MercadoPago API Documentation](https://www.mercadopago.com.co/developers) for more details.

---

## 🤝 Contributing

We welcome contributions to improve this plugin! Follow these steps to contribute:

1. Fork the repository.  
2. Create a feature branch: `git checkout -b feature/your-feature-name`.  
3. Commit your changes: `git commit -m 'Add some feature'`.  
4. Push to the branch: `git push origin feature/your-feature-name`.  
5. Submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🛠 Support

If you encounter any issues or have feature requests, please [open an issue](https://github.com/leshz/mercadopago-strapi/issues).

---
