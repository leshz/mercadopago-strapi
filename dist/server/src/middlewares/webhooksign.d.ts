import type { Core } from "@strapi/strapi";
declare const verifySign: (config: any, { strapi }: {
    strapi: Core.Strapi;
}) => (ctx: any, next: any) => Promise<any>;
export { verifySign };
