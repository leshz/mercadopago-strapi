export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/configuration',
      handler: 'configuration.get',
      config: {
        auth: false
      },
    },
    {
      method: 'POST',
      path: '/configuration',
      handler: 'configuration.update',
      config: {
        auth: false
      },
    }
  ]

}
