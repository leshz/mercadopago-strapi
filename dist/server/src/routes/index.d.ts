declare const _default: {
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
export default _default;
