const apps = [
  {
    name: 'http-server.js',
    script: './http-server.js',
    env: {
      DEBUG: 'stakan:*',
      NODE_ENV: 'development',
      NODE_PORT: 8080,
      REDIS_URL: 'redis://localhost:6379'
    },
    env_production: {
      DEBUG: 'stakan:*',
      NODE_ENV: 'production',
      NODE_PORT: 80
    }
  }, {
    name: 'mqtt-publisher.js',
    script: './mqtt-publisher.js',
    env: {
      DEBUG: 'stakan:*',
      NODE_ENV: 'development',
      MQTT_URL: 'mqtt://localhost:1883',
      REDIS_URL: 'redis://localhost:6379'
    },
    env_production: {
      DEBUG: 'stakan:*',
      NODE_ENV: 'production',
    }
  }, {
    name: 'cexio-connector.js',
    script: './cexio-connector.js',
    env: {
      DEBUG: 'stakan:*',
      NODE_ENV: 'development',
      REDIS_URL: 'redis://localhost:6379'
    },
    env_production: {
      DEBUG: 'stakan:*',
      NODE_ENV: 'production',
    }
  }
]

module.exports = { apps }
