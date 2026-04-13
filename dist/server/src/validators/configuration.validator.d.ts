/**
 * Configuration Validation Schema
 * Valida y sanitiza los datos de configuración del plugin
 */
import * as yup from 'yup';
export declare const configurationSchema: yup.ObjectSchema<{
    isActive: boolean;
    mercadoPagoToken: string;
    defaultCurrency: string;
    backUrls: string;
    webhookPass: string;
    notificationUrl: string;
    bussinessDescription: string;
    isActiveVerification: boolean;
}, yup.AnyObject, {
    isActive: undefined;
    mercadoPagoToken: undefined;
    defaultCurrency: undefined;
    backUrls: undefined;
    webhookPass: undefined;
    notificationUrl: undefined;
    bussinessDescription: undefined;
    isActiveVerification: true;
}, "">;
