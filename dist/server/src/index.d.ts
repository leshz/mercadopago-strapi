/// <reference types="koa" />
declare const _default: {
    register: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    bootstrap: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => Promise<void>;
    destroy: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    config: {
        default: {};
        validator(): void;
    };
    controllers: {
        category: ({ strapi, }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => Partial<import("@strapi/types/dist/core/core-api/controller").Base> & import("@strapi/types/dist/core/core-api/controller").Generic & import("@strapi/types/dist/core/core-api/controller").Base;
        product: ({ strapi, }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            findOne: (ctx: import("koa").Context) => Promise<import("koa").Context>;
        } & import("@strapi/types/dist/core/core-api/controller").Base;
        order: ({ strapi, }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => Partial<import("@strapi/types/dist/core/core-api/controller").Base> & import("@strapi/types/dist/core/core-api/controller").Generic & import("@strapi/types/dist/core/core-api/controller").Base;
        checkout: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            checkout(ctx: any): Promise<any>;
        };
        notification: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            notification(ctx: any): Promise<any>;
        };
        configuration: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            get(ctx: any): Promise<any>;
            update(ctx: any): Promise<any>;
        };
        dashboard: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            stats(ctx: any): Promise<any>;
        };
    };
    routes: {
        category: import("@strapi/types/dist/core/core-api/router").Router;
        product: {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string;
                config: {
                    middlewares: string[];
                };
            }[];
        };
        invoice: import("@strapi/types/dist/core/core-api/router").Router;
        checkout: {
            type: string;
            routes: {
                method: "POST";
                path: "/checkout";
                handler: string;
                config: {
                    middlewares: string[];
                };
            }[];
        };
        notification: {
            type: string;
            routes: {
                method: "POST";
                path: "/notifications";
                handler: string;
                config: {
                    middlewares: string[];
                    auth: boolean;
                };
            }[];
        };
        configuration: {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string; /**
                 * Plugin server methods
                 */
                config: {
                    auth: boolean;
                };
            }[];
        };
        dashboard: {
            type: string;
            routes: {
                method: string;
                path: string;
                handler: string; /**
                 * Plugin server methods
                 */
                config: {
                    auth: {};
                };
            }[];
        };
    };
    services: {
        dashboard: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            getStats(days: number): Promise<{
                salesTimeline: import("./types").TimelineEntry[];
                orderRatio: {
                    open: number;
                    closed: number;
                };
                rejectionReasons: {
                    reason: string;
                    count: number;
                }[];
                paymentMethods: {
                    method: string;
                    count: number;
                }[];
                topProducts: import("./types").ProductAccum[];
                summary: {
                    totalSales: number;
                    revenue: any;
                    approvedCount: number;
                    rejectedCount: number;
                    pendingCount: number;
                    avgTicket: number;
                    conversionRate: number;
                };
            }>;
        };
        'mercadopago-gateway': ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            createClient(accessToken: string): import("mercadopago").default;
            createPreference(preferenceData: any, accessToken: string): Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
            getPayment(paymentId: string, accessToken: string): Promise<import("mercadopago/dist/clients/payment/commonTypes").PaymentResponse>;
            formatProductsForPreference(products: import("./types").ProductInfo[], currencyId: string): {
                id: string;
                title: string;
                description: string;
                picture_url: string;
                quantity: number;
                currency_id: string;
                unit_price: number;
                category_id: number;
            }[];
            formatCustomerForPreference(customer: import("./types").CustomerInfo, fulfillment: import("./types").FulfillmentInfo, countryConfig: import("./types").CountryConfig): {
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
            getProducts: (items: import("./types").ProductItem[]) => Promise<any[]>;
        } & import("@strapi/types/dist/core/core-api/service").Base;
        'payment-notification': ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            processPaymentNotification(payload: import("./types").WebhookPayload, config: import("./types").ConfigType): Promise<void>;
        };
        'payment-verification': ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            getAndVerifyPayment(paymentId: string, config: import("./types").ConfigType): Promise<import("./types").PaymentInfo>;
        };
        'stock-reduction': ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            reduceStock(items: import("./types").StockItem[]): Promise<void>;
        };
        checkout: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            processCheckout(data: import("./types").CheckoutData, config: import("./types").ConfigType): Promise<import("./types").CheckoutResult>;
        };
        preference: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            createPaymentPreference(order: any, products: any[], customer: any, fulfillment: any, config: import("./types").ConfigType): Promise<import("./types").PreferenceResult>;
        };
        'order-creation': ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            createInitialOrder(data: import("./types").OrderData): Promise<{
                id: import("@strapi/types/dist/data").ID;
            } & {
                [key: string]: any;
            }>;
            updateWithPaymentLink(orderId: string | number, preferenceData: import("./types").PreferenceData): Promise<{
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
                fulfillment: import("./types").Reqfulfillment;
                customer: import("./types").resCustomer;
                rawProducts: import("./types").buildedProduct[];
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
            parserProducts: (rawProducts: any, config: import("./types").ConfigType) => Promise<any>;
            parserCustomer: (customer: import("./types").resCustomer, fulfillment: import("./types").fulfillment) => Promise<import("./types").meliCustomer>;
            parserFulfillment: (shipping: import("./types").fulfillment) => Promise<import("./types").fulfillment>;
            createPreference: ({ rawProducts, payer, internalInvoiceId }: {
                rawProducts: any;
                payer: any;
                internalInvoiceId: any;
            }, config: import("./types").ConfigType) => Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
            paymentAction: (payload: import("./types").PaymentPayload, config: import("./types").ConfigType) => Promise<void>;
        };
    };
    contentTypes: {
        order: {
            schema: {
                kind: string;
                collectionName: string;
                info: {
                    singularName: string;
                    pluralName: string;
                    displayName: string;
                };
                options: {
                    draftAndPublish: boolean;
                };
                attributes: {
                    products: {
                        require: boolean;
                        type: string;
                    };
                    payment_link: {
                        require: boolean;
                        type: string;
                    };
                    collector_id: {
                        require: boolean;
                        type: string;
                    };
                    total_discount: {
                        type: string;
                        default: number;
                    };
                    total: {
                        required: boolean;
                        default: number;
                        type: string;
                    };
                    paid_with: {
                        type: string;
                    };
                    preference_id: {
                        type: string;
                        required: boolean;
                    };
                    payment_id: {
                        type: string;
                        required: boolean;
                    };
                    status_detail: {
                        type: string;
                    };
                    payment_status: {
                        type: string;
                        required: boolean;
                        enum: string[];
                    };
                    shipping_status: {
                        type: string;
                        enum: string[];
                    };
                    fulfillment: {
                        type: string;
                        repeatable: boolean;
                        component: string;
                        required: boolean;
                    };
                    customer: {
                        type: string;
                        repeatable: boolean;
                        component: string;
                        required: boolean;
                    };
                };
            };
        };
        category: {
            schema: {
                kind: string;
                collectionName: string;
                info: {
                    singularName: string;
                    pluralName: string;
                    displayName: string;
                    description: string;
                };
                options: {
                    draftAndPublish: boolean;
                };
                pluginOptions: {
                    i18n: {
                        localized: boolean;
                    };
                };
                attributes: {
                    name: {
                        pluginOptions: {
                            i18n: {
                                localized: boolean;
                            };
                        };
                        type: string;
                    };
                    slug: {
                        pluginOptions: {
                            i18n: {
                                localized: boolean;
                            };
                        };
                        type: string;
                        targetField: string;
                    };
                };
            };
        };
        product: {
            schema: {
                kind: string;
                collectionName: string;
                info: {
                    singularName: string;
                    pluralName: string;
                    displayName: string;
                    description: string;
                };
                options: {
                    draftAndPublish: boolean;
                };
                pluginOptions: {
                    i18n: {
                        localized: boolean;
                    };
                };
                attributes: {
                    name: {
                        pluginOptions: {
                            i18n: {
                                localized: boolean;
                            };
                        };
                        type: string;
                        required: boolean;
                        unique: boolean;
                    };
                    price: {
                        pluginOptions: {
                            i18n: {
                                localized: boolean;
                            };
                        };
                        type: string;
                        required: boolean;
                        min: number;
                    };
                    pictures: {
                        type: string;
                        multiple: boolean;
                        required: boolean;
                        allowedTypes: string[];
                        pluginOptions: {
                            i18n: {
                                localized: boolean;
                            };
                        };
                    };
                    short_description: {
                        type: string;
                        required: boolean;
                        pluginOptions: {
                            i18n: {
                                localized: boolean;
                            };
                        };
                    };
                    slug: {
                        type: string;
                        targetField: string;
                        required: boolean;
                    };
                    stock: {
                        type: string;
                        default: number;
                        pluginOptions: {
                            i18n: {
                                localized: boolean;
                            };
                        };
                        required: boolean;
                        unique: boolean;
                        max: number;
                    };
                    sku: {
                        pluginOptions: {
                            i18n: {
                                localized: boolean;
                            };
                        };
                        type: string;
                        unique: boolean;
                        required: boolean;
                    };
                    promotion: {
                        displayName: string;
                        type: string;
                        repeatable: boolean;
                        pluginOptions: {
                            i18n: {
                                localized: boolean;
                            };
                        };
                        component: string;
                        required: boolean;
                    };
                    categories: {
                        type: string;
                        relation: string;
                        target: string;
                    };
                    middle_description: {
                        pluginOptions: {
                            i18n: {
                                localized: boolean;
                            };
                        };
                        type: string;
                    };
                    information: {
                        displayName: string;
                        type: string;
                        repeatable: boolean;
                        pluginOptions: {
                            i18n: {
                                localized: boolean;
                            };
                        };
                        component: string;
                    };
                };
            };
        };
    };
    policies: {};
    middlewares: {
        loadConfig: (options: any, { strapi }: {
            strapi: any;
        }) => (ctx: any, next: any) => Promise<any>;
        verifySign: (config: any, { strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => (ctx: any, next: any) => Promise<any>;
        populating: () => (ctx: any, next: any) => Promise<any>;
        validateCheckout: (config: any, { strapi }: {
            strapi: any;
        }) => (ctx: any, next: any) => Promise<any>;
    };
};
export default _default;
