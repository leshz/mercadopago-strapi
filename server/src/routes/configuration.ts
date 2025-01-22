export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/configuration',
      handler: 'configuration.find',
      config: {
        auth: false
      },
    }
  ]

}