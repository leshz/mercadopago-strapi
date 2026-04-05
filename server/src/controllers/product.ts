/**
 *  controller
 */

import type { Core } from '@strapi/strapi';

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "plugin::strapi-mercadopago.product",
  ({ strapi }: { strapi: Core.Strapi }) => ({
    async findOne(ctx) {
      await this.validateQuery(ctx);

      const { slug } = ctx.params;
      const locale = (ctx.query.locale as string) ?? 'all';

      const sanitizedQuery = await this.sanitizeQuery(ctx);

      const entity = await strapi.documents("plugin::strapi-mercadopago.product").findFirst({
        filters: { slug } as any,
        populate: (sanitizedQuery.populate as any) ?? ['pictures', 'categories', 'promotion', 'information'],
        ...(locale !== 'all' && { locale }),
      });

      if (!entity) return ctx.notFound();
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return ctx.send(this.transformResponse(sanitizedEntity));
    },
  })
);
