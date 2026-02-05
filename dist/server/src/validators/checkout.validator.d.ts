/**
 * Checkout Validation Schema
 * Valida y sanitiza los datos de entrada del checkout
 */
import * as yup from 'yup';
export declare const checkoutSchema: yup.ObjectSchema<{
    items: {
        quantity?: number;
        sku?: string;
    }[];
    customer: {
        name?: string;
        email?: string;
        lastName?: string;
        dni?: string;
        phone?: string;
    };
    fulfillment: {
        message?: string;
        address?: string;
        city?: string;
        department?: string;
        postalCode?: string;
    };
}, yup.AnyObject, {
    items: "";
    customer: {
        name: undefined;
        lastName: undefined;
        email: undefined;
        dni: undefined;
        phone: undefined;
    };
    fulfillment: {
        address: undefined;
        city: undefined;
        department: undefined;
        postalCode: undefined;
        message: undefined;
    };
}, "">;
