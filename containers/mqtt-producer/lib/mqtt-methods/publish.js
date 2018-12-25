const { curry } = require('ramda')

const {
  topicOf,
  serialize
} = require('./helpers')

/**
 * Publish
 *
 * @param {mqtt.Client} client
 * @param {Object} payload
 *
 * @returns {Promise}
 */

async function publish (client, payload) {
  const topic   = topicOf(payload)
  const message = serialize(payload)

  const options = { qos: 2 }

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

module.exports = curry(publish)
