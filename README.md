# MercadoPago Plugin for Strapi v5

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![Strapi Version](https://img.shields.io/badge/Strapi-v5.x.x-orange.svg)](https://strapi.io)  
[![MercadoPago API](https://img.shields.io/badge/MercadoPago-API-blue)](https://www.mercadopago.com.co/developers)

A powerful plugin for integrating **MercadoPago** integration with **Strapi** CMS. This plugin simplifies the integration process, allowing you to easily handle payments, magane products with a soft ecommerce  with MercadoPago's API.

---

## 📖 Table of Contents

1. [Features](#-features)  
2. [Requirements](#-requirements)  
3. [Installation](#-installation)  
4. [Configuration](#-configuration)  
5. [Usage](#-usage)  
6. [API Endpoints](#-api-endpoints)  
7. [Contributing](#-contributing)  
8. [License](#-license)

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
