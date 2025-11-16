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

> **⭐ NEW:** Comprehensive architecture analysis and improvement proposals available!

We've conducted an in-depth review of the plugin architecture and identified opportunities for improvement based on **Clean Code principles** and **Strapi v5 best practices**.

### 📚 Documentation Available

- **[GUIA_MEJORAS.md](./GUIA_MEJORAS.md)** - START HERE
  - Master guide with navigation and quick decision flowchart
  - Reading time: 10-25 minutes depending on your needs

- **[COMPARACION_ARQUITECTURAS.md](./COMPARACION_ARQUITECTURAS.md)** - RECOMMENDED
  - Detailed comparison: Clean Architecture vs Service Layer Pattern
  - Includes scoring matrix (8.5/10 vs 6.5/10)
  - Reading time: 15 minutes

- **[ARQUITECTURAS_PRAGMATICAS.md](./ARQUITECTURAS_PRAGMATICAS.md)** ⭐
  - Service Layer Pattern proposal (RECOMMENDED for this plugin)
  - Implementation time: 6 weeks
  - Reading time: 20 minutes

- **[MEJORAS_ARQUITECTURA_LIMPIA.md](./MEJORAS_ARQUITECTURA_LIMPIA.md)**
  - Complete Clean Architecture proposal
  - 45+ improvements identified
  - Implementation time: 12 weeks
  - Reading time: 30 minutes

### 🚨 Critical Issues Identified

Before using this plugin in production, please review:

1. **Security vulnerabilities** (8 critical issues)
   - Unprotected configuration endpoints
   - Secrets stored in plaintext
   - Missing input validation
   - Race conditions in stock management

2. **Architecture improvements** (30+ suggestions)
   - Service layer separation
   - Transaction handling
   - Idempotency implementation
   - Testing strategy

**👉 [Read the full analysis](./GUIA_MEJORAS.md)**

### ⭐ Recommended Path

```
1. Read GUIA_MEJORAS.md (10 min)
2. Review critical security issues
3. Decide on architecture: Service Layer Pattern (recommended)
4. Start with Phase 1: Security fixes (2 weeks)
```

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
