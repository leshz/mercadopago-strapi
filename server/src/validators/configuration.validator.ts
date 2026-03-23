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
  backUrls: yup.object({
    success: yup.string().url('Invalid success URL').max(2000).required(),
    failure: yup.string().url('Invalid failure URL').max(2000).required(),
    pending: yup.string().url('Invalid pending URL').max(2000).required(),
  }).required('Back URLs are required'),
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
