declare const _default: {
    'mercadopago-gateway': ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        createClient(accessToken: string): import("mercadopago").default;
        createPreference(preferenceData: any, accessToken: string): Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
        getPayment(paymentId: string, accessToken: string): Promise<import("mercadopago/dist/clients/payment/commonTypes").PaymentResponse>;
        formatProductsForPreference(products: import("../../types").ProductInfo[], currencyId: string): {
            id: string;
            title: string;
            description: string;
            picture_url: string;
            quantity: number;
            currency_id: string;
            unit_price: number;
            category_id: number;
        }[];
        formatCustomerForPreference(customer: import("../../types").CustomerInfo, fulfillment: import("../../types").FulfillmentInfo, countryConfig: import("../../types").CountryConfig): {
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
};
export default _default;
