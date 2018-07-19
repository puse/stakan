const { curry } = require('ramda')

/**
 * Actions
 */

/**
 * Publish
 */

async function publish (client, payload) {
  const topic   = topicOf(payload)
  const message = messageOf(payload)

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

module.exports.publish = curry(publish)
