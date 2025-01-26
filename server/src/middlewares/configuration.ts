const loadConfig = (options, { strapi }) => {
  return async (ctx, next) => {

    const pluginStore = strapi.store({
      environment: strapi.config.environment,
      type: 'plugin',
      name: 'strapi-mercadopago',
    });
    const response = await pluginStore.get({ key: 'mercadopagoSetting', });

    const { isActive = false, mercadoPagoToken = "" } = response || {};
    if (isActive && mercadoPagoToken) {
      ctx.state.config = response;
      return next();
    }
    return ctx.serviceUnavailable("Service Unavailable");
  };
};

export { loadConfig };
