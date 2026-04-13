/**
 * Configuration Validation Schema
 * Valida y sanitiza los datos de configuración del plugin
 */
import * as yup from 'yup';

export const configurationSchema = yup.object({
  isActive: yup
    .boolean()
    .required('isActive is required'),
  mercadoPagoToken: yup
    .string()
    .required('MercadoPago token is required')
    .max(500, 'Token too long')
    .trim(),
  defaultCurrency: yup
    .string()
    .required('Currency is required')
    .max(10, 'Currency code too long')
    .matches(/^[A-Z]{3}$/, 'Currency must be a 3-letter ISO code'),
  backUrls: yup
    .string()
    .url('Invalid back URL')
    .max(2000, 'Back URL too long'),
  webhookPass: yup
    .string()
    .max(500, 'Webhook password too long')
    .trim(),
  notificationUrl: yup
    .string()
    .url('Invalid notification URL')
    .max(2000, 'Notification URL too long'),
  bussinessDescription: yup
    .string()
    .max(500, 'Business description too long')
    .trim(),
  isActiveVerification: yup
    .boolean()
    .default(true),
});
