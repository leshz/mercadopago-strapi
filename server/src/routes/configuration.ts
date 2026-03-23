export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/configuration',
      handler: 'configuration.get',
      config: {
        auth: true
      },
    },
    {
      method: 'POST',
      path: '/configuration',
      handler: 'configuration.update',
      config: {
        auth: true
      },
    }
  ]

}
