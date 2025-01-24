declare const _default: {
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
export default _default;
