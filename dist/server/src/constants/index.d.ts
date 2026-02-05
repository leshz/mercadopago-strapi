export declare const INVOICES_STATUS: {
    [key: string]: string;
};
export declare const SHIPPING_STATUS: {
    INITIAL: string;
    IN_PROCESS: string;
    ON_DELIVERY: string;
    DELIVERED: string;
    CANCELLED: string;
    REFUNDED: string;
};
export declare const URLS: {
    readonly CHECKOUT: "/checkout";
    readonly WEBHOOK: "/notifications";
};
export declare const METHODS: {
    readonly GET: "GET";
    readonly POST: "POST";
    readonly PUT: "PUT";
    readonly DELETE: "DELETE";
};
export declare const NOTIFICATION_TYPES: {
    readonly PAYMENT: "payment";
};
export declare const ACTIONS_TYPES: {
    readonly CREATE: "payment.created";
    readonly UPDATE: "payment.updated";
};
export declare const INVOICES_MEANING: {
    [key: string]: string;
};
export declare const enum TYPE_OF_PRODUCTS {
    PRODUCT = "producto",
    SERVICE = "servicio"
}
