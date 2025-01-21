import { METHODS, URLS } from "../constants";

export default {
  type: "content-api",
  routes: [
    {
      method: METHODS.POST,
      path: URLS.WEBHOOK,
      handler: "notification.notification",
      config: {
        middlewares: [
          "plugin::mercadopago.loadConfig",
          "plugin::mercadopago.verifySign",
        ],
        auth: false,
      },
    },
  ],
};
