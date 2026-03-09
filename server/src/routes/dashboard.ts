export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/dashboard/stats',
      handler: 'dashboard.stats',
      config: {
        auth: {},
      },
    },
  ],
};
