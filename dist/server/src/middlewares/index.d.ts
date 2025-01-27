declare const _default: {
    loadConfig: (options: any, { strapi }: {
        strapi: any;
    }) => (ctx: any, next: any) => Promise<any>;
    verifySign: ({ strapi }: {
        strapi: import("@strapi/types/dist/core").Strapi;
    }) => (ctx: any, next: any) => Promise<any>;
    populating: () => (ctx: any, next: any) => Promise<any>;
};
export default _default;
