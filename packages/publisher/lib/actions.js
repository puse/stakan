const {
  curry
} = require('ramda')

/**
 * Settings
 */

const PREFIX = 'orderbook'

/**
 * Helpers
 */

const topicOf = ({ broker, symbol }) => {
  return `${PREFIX}/${broker}/${symbol}`
}

/**
 * Actions
 */

/**
 * Publish
 */

async function publish (client, payload) {
  const topic = topicOf(payload)
  const message = JSON.stringify(payload)

  const options = {
    qos: 2
  }

  const sent = (resolve, reject) => {
    const cb = err => {
      err
        ? reject(err)
        : resolve()
    }

    client.publish(topic, message, options, cb)
  }

  return new Promise(sent)
}

/**
 * Expose curried
 */

module.exports.publish = curry(publish)
