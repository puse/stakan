const debug = require('debug')('stakan:l2:mqtt')

const { Subscriber } = require('rxjs/Rx')

const { publish } = require('@stakan/publisher/lib/actions')

/**
 * Helpers
 */

/**
 * Ingest level2 aggregated orders
 *
 * @return {Rx.Subscriber}
 */

function Sink (client) {
  debug('Initialize MQTT publisher')

  const send = publish(client)

  const next = order => {
    const op = _ => send(order)

    return client.connected
      ? op()
      : client.once('connect', op)
  }

  const error = err => debug('Error: ', err.message)

  const complete = _ => debug('Complete')

  return Subscriber.create(next, error, complete)
}

/**
 * Expose
 */

module.exports = Sink

