declare const _default: {
    'mercadopago-gateway': ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        createClient(accessToken: string): import("mercadopago").default;
        createPreference(preferenceData: any, accessToken: string): Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
        getPayment(paymentId: string, accessToken: string): Promise<import("mercadopago/dist/clients/payment/commonTypes").PaymentResponse>;
        formatProductsForPreference(products: import("../types").ProductInfo[], currencyId: string): {
            id: string;
            title: string;
            description: string;
            picture_url: string;
            quantity: number;
            currency_id: string;
            unit_price: number;
            category_id: number;
        }[];
        formatCustomerForPreference(customer: import("../types").CustomerInfo, fulfillment: import("../types").FulfillmentInfo, countryConfig: import("../types").CountryConfig): {
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
    product: ({ strapi, }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getProducts: (items: import("../types").ProductItem[]) => Promise<any[]>;
    } & import("@strapi/types/dist/core/core-api/service").Base;
    'payment-notification': ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        processPaymentNotification(payload: import("../types").WebhookPayload, config: import("../types").ConfigType): Promise<void>;
    };
    'payment-verification': ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getAndVerifyPayment(paymentId: string, config: import("../types").ConfigType): Promise<import("../types").PaymentInfo>;
    };
    'stock-reduction': ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        reduceStock(items: import("../types").StockItem[]): Promise<void>;
    };
    checkout: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        processCheckout(data: import("../types").CheckoutData, config: import("../types").ConfigType): Promise<import("../types").CheckoutResult>;
    };
    preference: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        createPaymentPreference(order: any, products: any[], customer: any, fulfillment: any, config: import("../types").ConfigType): Promise<import("../types").PreferenceResult>;
    };
    'order-creation': ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        createInitialOrder(data: import("../types").OrderData): Promise<{
            id: import("@strapi/types/dist/data").ID;
        } & {
            [key: string]: any;
        }>;
        updateWithPaymentLink(orderId: string | number, preferenceData: import("../types").PreferenceData): Promise<{
            id: import("@strapi/types/dist/data").ID;
        } & {
            [key: string]: any;
        }>;
    };
    category: ({ strapi, }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => Partial<import("@strapi/types/dist/core/core-api/service").Base> & import("@strapi/types/dist/core/core-api/service").Generic & import("@strapi/types/dist/core/core-api/service").Base;
    order: ({ strapi, }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        createInitialOrder: ({ fulfillment, rawProducts, customer, }: {
            fulfillment: import("../types").Reqfulfillment;
            customer: import("../types").resCustomer;
            rawProducts: import("../types").buildedProduct[];
        }) => Promise<{
            id: import("@strapi/types/dist/data").ID;
        } & {
            [key: string]: any;
        }>;
        updateOrder: ({ id, data }: {
            id: any;
            data: any;
        }) => Promise<{
            id: import("@strapi/types/dist/data").ID;
        } & {
            [key: string]: any;
        }>;
    } & import("@strapi/types/dist/core/core-api/service").Base;
    mercadopago: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        parserProducts: (rawProducts: any, config: import("../types").ConfigType) => Promise<any>;
        parserCustomer: (customer: import("../types").resCustomer, fulfillment: import("../types").fulfillment) => Promise<import("../types").meliCustomer>;
        parserFulfillment: (shipping: import("../types").fulfillment) => Promise<import("../types").fulfillment>;
        createPreference: ({ rawProducts, payer, internalInvoiceId }: {
            rawProducts: any;
            payer: any;
            internalInvoiceId: any;
        }, config: import("../types").ConfigType) => Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
        paymentAction: (payload: import("../types").PaymentPayload, config: import("../types").ConfigType) => Promise<void>;
    };
};
export default _default;
