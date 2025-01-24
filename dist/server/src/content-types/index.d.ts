declare const _default: {
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
export default _default;
