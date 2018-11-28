const apps = [
  {
    name: 'server-api',
    script: './server-api.js',
    env: {
      DEBUG: 'stakan:*',
      NODE_ENV: 'development',
      NODE_PORT: 8080,
      REDIS_URL: 'redis://localhost:6379'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }, {
    name: 'publisher-mqtt',
    script: './publisher-mqtt.js',
    env: {
      DEBUG: 'stakan:*',
      NODE_ENV: 'development',
      MQTT_URL: 'mqtt://localhost:1883',
      REDIS_URL: 'redis://localhost:6379'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }, {
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
  }
]

module.exports = { apps }
