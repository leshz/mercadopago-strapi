declare const _default: {
    product: ({ strapi, }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => {
        getProducts: (items: import("../../types").ProductItem[]) => Promise<any[]>;
    } & import("@strapi/types/dist/core/core-api/service").Base;
};
export default _default;
