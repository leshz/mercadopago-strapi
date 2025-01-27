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
export default _default;
