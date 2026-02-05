/**
 * MercadoPago Gateway
 * Responsabilidad: Abstracción del SDK de MercadoPago
 * Este gateway encapsula todas las interacciones con la API de MercadoPago
 */
import { MercadoPagoConfig } from 'mercadopago';
import type { Core } from '@strapi/strapi';
import type { CountryConfig, CustomerInfo, FulfillmentInfo, ProductInfo } from '../../types';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    /**
     * Crea un cliente de MercadoPago configurado
     */
    createClient(accessToken: string): MercadoPagoConfig;
    /**
     * Crea una preferencia de pago en MercadoPago
     */
    createPreference(preferenceData: any, accessToken: string): Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
    /**
     * Obtiene información de un pago desde MercadoPago
     */
    getPayment(paymentId: string, accessToken: string): Promise<import("mercadopago/dist/clients/payment/commonTypes").PaymentResponse>;
    /**
     * Formatea productos para MercadoPago
     */
    formatProductsForPreference(products: ProductInfo[], currencyId: string): {
        id: string;
        title: string;
        description: string;
        picture_url: string;
        quantity: number;
        currency_id: string;
        unit_price: number;
        category_id: number;
    }[];
    /**
     * Formatea información del cliente para MercadoPago
     */
    formatCustomerForPreference(customer: CustomerInfo, fulfillment: FulfillmentInfo, countryConfig: CountryConfig): {
        name: string;
        surname: string;
        email: string;
        phone: {
            area_code: string;
            number: string;
        };
        identification: {
            type: string;
            number: string;
        };
        address: {
            zip_code: string;
            street_name: string;
            street_number: string;
        };
    };
};
export default _default;
