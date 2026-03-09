// Legacy services (mantener temporalmente para compatibilidad)
import category from './category.service';
import order from './order.service';
import mercadopago from './sdk.legacy';

// New Service Layer Architecture
import checkoutServices from './checkout';
import paymentServices from './payment';
import productServices from './product';
import externalServices from './external';
import dashboardServices from './dashboard';

export default {
  // Legacy services
  category,
  order,
  mercadopago,

  // Checkout services
  ...checkoutServices,

  // Payment services
  ...paymentServices,

  // Product services (reemplaza el antiguo product.ts)
  ...productServices,

  // External services (gateways)
  ...externalServices,

  // Dashboard services
  ...dashboardServices,
};
