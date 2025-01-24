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
export default _default;
