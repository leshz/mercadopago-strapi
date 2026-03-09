import type { Core } from '@strapi/strapi';

const VALID_DAYS = [30, 60, 90];

const dashboard = ({ strapi }: { strapi: Core.Strapi }) => ({
  async stats(ctx) {
    const days = Number(ctx.query.days) || 30;

    if (!VALID_DAYS.includes(days)) {
      return ctx.badRequest('Invalid period. Use 30, 60, or 90.');
    }

    const stats = await strapi
      .service('plugin::strapi-mercadopago.dashboard')
      .getStats(days);

    ctx.body = stats;
  },
});

export default dashboard;
