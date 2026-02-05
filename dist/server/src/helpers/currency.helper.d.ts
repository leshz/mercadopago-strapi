/**
 * Currency Helper
 * Funciones para manejo de monedas soportadas por MercadoPago
 */
export declare const SUPPORTED_CURRENCIES: readonly ["COP", "USD", "ARS", "BRL", "MXN", "CLP", "PEN", "UYU"];
export type Currency = typeof SUPPORTED_CURRENCIES[number];
/**
 * Valida si una moneda es soportada
 */
export declare function validateCurrency(currency: string): currency is Currency;
/**
 * Formatea un monto con su moneda
 */
export declare function formatAmount(amount: number, currency?: Currency): string;
/**
 * Configuraciones por país para MercadoPago
 */
export declare const COUNTRY_CONFIGS: Record<string, {
    areaCode: string;
    identificationType: string;
    currency: Currency;
}>;
