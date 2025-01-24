declare const _default: {
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
export default _default;
