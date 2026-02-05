declare const loadConfig: (options: any, { strapi }: {
    strapi: any;
}) => (ctx: any, next: any) => Promise<any>;
export { loadConfig };
