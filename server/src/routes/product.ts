/**
 *  router
 */


export default {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/products/:slug",
      handler: "product.findOne",
      config: {
        middlewares: ["plugin::mercadopago.populating"],
      },
    },
    {
      method: "GET",
      path: "/products",
      handler: "product.find",
      config: {
        middlewares: ["plugin::mercadopago.populating"],
      },
    },
  ],
};
