/**
 * Currency Helper
 * Funciones para manejo de monedas soportadas por MercadoPago
 */

export const SUPPORTED_CURRENCIES = ['COP', 'USD', 'ARS', 'BRL', 'MXN', 'CLP', 'PEN', 'UYU'] as const;

export type Currency = typeof SUPPORTED_CURRENCIES[number];

/**
 * Valida si una moneda es soportada
 */
export function validateCurrency(currency: string): currency is Currency {
  return SUPPORTED_CURRENCIES.includes(currency as Currency);
}

/**
 * Formatea un monto con su moneda
 */
export function formatAmount(amount: number, currency: Currency = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Configuraciones por país para MercadoPago
 */
export const COUNTRY_CONFIGS: Record<string, { areaCode: string; identificationType: string; currency: Currency }> = {
  CO: { areaCode: '57', identificationType: 'CC', currency: 'COP' },
  AR: { areaCode: '54', identificationType: 'DNI', currency: 'ARS' },
  BR: { areaCode: '55', identificationType: 'CPF', currency: 'BRL' },
  MX: { areaCode: '52', identificationType: 'RFC', currency: 'MXN' },
  CL: { areaCode: '56', identificationType: 'RUT', currency: 'CLP' },
  PE: { areaCode: '51', identificationType: 'DNI', currency: 'PEN' },
  UY: { areaCode: '598', identificationType: 'CI', currency: 'UYU' },
};
