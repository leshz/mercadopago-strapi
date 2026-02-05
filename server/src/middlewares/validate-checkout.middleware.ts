/**
 * Checkout Validation Middleware
 * Validates checkout request body before processing
 */
import { checkoutSchema } from '../validators/checkout.validator';

const validateCheckout = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      const validated = await checkoutSchema.validate(ctx.request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      ctx.state.validated = validated;
      await next();
    } catch (error) {
      if (error.name === 'ValidationError') {
        strapi.log.warn('Checkout validation failed', {
          errors: error.errors,
        });

        return ctx.badRequest('Validation failed', {
          errors: error.errors,
          details: error.inner?.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }
      throw error;
    }
  };
};

export { validateCheckout };
