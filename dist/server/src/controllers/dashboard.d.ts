import type { Core } from '@strapi/strapi';
declare const dashboard: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    stats(ctx: any): Promise<any>;
};
export default dashboard;
