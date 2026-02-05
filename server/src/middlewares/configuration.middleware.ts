import { decrypt } from '../utils/encryption';

const loadConfig = (options, { strapi }) => {
  return async (ctx, next) => {
    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-mercadopago',
    });

    const storedConfig = await pluginStore.get({ key: 'mercadopagoSetting' }) as any;

    if (!storedConfig?.mercadoPagoToken) {
      strapi.log.error('MercadoPago token not configured');
      return ctx.serviceUnavailable('Payment service not configured');
    }

    const { isActive = false } = storedConfig;

    if (!isActive) {
      return ctx.serviceUnavailable('Payment service is disabled');
    }

    // Descifrar secretos al cargar en contexto
    ctx.state.config = {
      ...storedConfig,
      mercadoPagoToken: decrypt(storedConfig.mercadoPagoToken, strapi),
      webhookPass: storedConfig.webhookPass
        ? decrypt(storedConfig.webhookPass, strapi)
        : '',
    };

    return next();
  };
};

export { loadConfig };
