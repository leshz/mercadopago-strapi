declare const _default: {
    register: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
    bootstrap: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => void;
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
        }) => Partial<import("@strapi/types/dist/core/core-api/controller").Base> & import("@strapi/types/dist/core/core-api/controller").Generic & import("@strapi/types/dist/core/core-api/controller").Base;
        order: ({ strapi, }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => Partial<import("@strapi/types/dist/core/core-api/controller").Base> & import("@strapi/types/dist/core/core-api/controller").Generic & import("@strapi/types/dist/core/core-api/controller").Base;
        checkout: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            checkout(ctx: any, next: any): Promise<any>;
        };
        notification: ({ strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            notification(ctx: any): Promise<any>;
        };
        configuration: ({ strapi, }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => Partial<import("@strapi/types/dist/core/core-api/controller").Base> & import("@strapi/types/dist/core/core-api/controller").Generic & import("@strapi/types/dist/core/core-api/controller").Base;
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
                handler: string;
                config: {
                    auth: boolean;
                };
            }[];
        };
    };
    services: {
        category: ({ strapi, }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => Partial<import("@strapi/types/dist/core/core-api/service").Base> & import("@strapi/types/dist/core/core-api/service").Generic & import("@strapi/types/dist/core/core-api/service").Base;
        product: ({ strapi, }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => Partial<import("@strapi/types/dist/core/core-api/service").Base> & import("@strapi/types/dist/core/core-api/service").Generic & import("@strapi/types/dist/core/core-api/service").Base;
        order: ({ strapi, }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => {
            createInitialOrder: ({ shipping, products, shopper, shipment, config, }: {
                shipping: import("./types").Reqship;
                shopper: import("./types").Reqbuyer;
                products: import("./types").buildedProduct[];
                shipment: any;
                config: import("./types").config;
            }) => Promise<{
                id: import("@strapi/types/dist/data").ID;
            } & {
                [key: string]: any;
            }>;
            updateInvoice: ({ id, data }: {
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
            meliProduct: (product: any, config: any) => import("./types").buildedProduct[];
            products: (items: import("./types").reqProduct[]) => Promise<any[]>;
            buyer: (buyer: import("./types").buyer, ship: import("./types").shipping) => Promise<import("./types").buyerMeli>;
            shipment: (shipping: import("./types").shipping, products: any) => Promise<any>;
            createPreference: ({ products, payer, internalInvoiceId, shipment }: {
                products: any;
                payer: any;
                internalInvoiceId: any;
                shipment: any;
            }, config: import("./types").config) => Promise<import("mercadopago/dist/clients/preference/commonTypes").PreferenceResponse>;
            paymentHook: (payload: import("./types").PaymentPayload, config: import("./types").config) => Promise<void>;
        };
        configuration: ({ strapi, }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => Partial<import("@strapi/types/dist/core/core-api/service").Base> & import("@strapi/types/dist/core/core-api/service").Generic & import("@strapi/types/dist/core/core-api/service").Base;
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
                    payment_status: {
                        type: string;
                        required: boolean;
                        enum: string[];
                    };
                    shipping_status: {
                        type: string;
                        enum: string[];
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
        configuration: {
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
                    comment: string;
                };
                pluginOptions: {
                    "content-manager": {
                        visible: boolean;
                    };
                    "content-type-builder": {
                        visible: boolean;
                    };
                };
                attributes: {
                    active: {
                        type: string;
                        default: boolean;
                        required: boolean;
                    };
                    token: {
                        type: string;
                        required: boolean;
                        private: boolean;
                    };
                    default_currency: {
                        type: string;
                        required: boolean;
                        private: boolean;
                    };
                    back_urls: {
                        type: string;
                        required: boolean;
                        private: boolean;
                    };
                    webhook_pass: {
                        type: string;
                        required: boolean;
                        private: boolean;
                    };
                    notification_url: {
                        type: string;
                        required: boolean;
                        private: boolean;
                    };
                    bussiness_description: {
                        type: string;
                        required: boolean;
                        private: boolean;
                    };
                    send_emails: {
                        type: string;
                        required: boolean;
                        private: boolean;
                    };
                    email: {
                        type: string;
                        required: boolean;
                        private: boolean;
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
        verifySign: (option: any, { strapi }: {
            strapi: import("@strapi/types/dist/core").Strapi;
        }) => (ctx: any, next: any) => Promise<any>;
        populating: () => (ctx: any, next: any) => Promise<any>;
    };
};
export default _default;
