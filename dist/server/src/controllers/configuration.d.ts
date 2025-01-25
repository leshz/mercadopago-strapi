/**
 *  controller
 */
import type { Core } from '@strapi/strapi';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    get(ctx: any): Promise<any>;
    update(ctx: any): Promise<any>;
};
export default _default;
