const apps = [
  {
    name: 'connector-cexio',
    script: './connector-cexio.js',
    env: {
      DEBUG: 'stakan:*',
      NODE_ENV: 'development',
      REDIS_URL: 'redis://localhost:6379',
      CEXIO_API_KEY: 'lT8rhvimwK7R4IyJfXNjWNMu140',
      CEXIO_API_SECRET: '5ATNU7Xm3UYZhGThIoAXiMTD4'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  // }, {
  //   name: 'connector-bitfinex',
  //   script: './connector-bitfinex.js',
  //   env: {
  //     DEBUG: 'stakan:*',
  //     NODE_ENV: 'development',
  //     REDIS_URL: 'redis://localhost:6379'
  //   },
  //   env_production: {
  //     NODE_ENV: 'production'
  //   }
  }
]

module.exports = { apps }
