const debug = require('debug')('stakan:remote:connector:bitfinex:pool')

const { createPool } = require('generic-pool')

const Bfx = require('bitfinex-api-node')

/**
 * Methods
 */

/**
 * Monitor WS events
 */

function monitor (ws) {
  const onOpen = () =>
    debug('WS open')

  const onClose = code =>
    debug('WS closed')

  const onError = err =>
    debug('WS error: %s', err.message)

  ws.on('open', onOpen)
    .on('close', onClose)
    .on('error', onError)

  return ws
}

/**
 * Create a WS connection
 */

function fork (config = {}) {
  const ws = new Bfx(config).ws()

  const callback = (resolve, reject) => {
    ws.once('open', resolve)
      .once('error', reject)

    ws.open()
  }

  monitor(ws)

  return new Promise(callback)
    .then(() => ws)
}


/**
 * Destroy a  WS connection
 */

function close (ws) {
  debug('Closing WS connection')

  const closed = resolve => {
    ws.once('close', resolve)
    ws.close(1000, 'Expired')
  }

  return new Promise(closed)
}

/**
 * Factory
 */

function Factory (config) {
  const create = () =>
    fork(config)

  const destroy = (ws) =>
    close(ws)

  return {
    create,
    destroy
  }
}

/**
 * Pool
 *
 * @params {Object} config - Client config
 *
 * @returns {Pool}
 */

function Pool (config = {}) {
  const factory = Factory(config)

  return createPool(factory)
}

/**
 * Expose Pool
 */

module.exports = Pool
