/**
 * Checkout Validation Schema
 * Valida y sanitiza los datos de entrada del checkout
 */
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
