declare const _default: {
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
};
export default _default;
