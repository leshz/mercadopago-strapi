/**
 * Configuration Validation Schema
 * Valida y sanitiza los datos de configuración del plugin
 */
import * as yup from 'yup';
export declare const configurationSchema: yup.ObjectSchema<{
    isActive: boolean;
    mercadoPagoToken: string;
    defaultCurrency: string;
    backUrls: {
        pending?: string;
        success?: string;
        failure?: string;
    };
    webhookPass: string;
    notificationUrl: string;
    bussinessDescription: string;
    isActiveVerification: boolean;
}, yup.AnyObject, {
    isActive: undefined;
    mercadoPagoToken: undefined;
    defaultCurrency: undefined;
    backUrls: {
        success: undefined;
        failure: undefined;
        pending: undefined;
    };
    webhookPass: undefined;
    notificationUrl: undefined;
    bussinessDescription: undefined;
    isActiveVerification: true;
}, "">;
