const debug = require('debug')('stakan:source:bitfinex')

const getenv = require('getenv')

const WebSocket = require('ws')

const { createPool } = require('generic-pool')

/**
 * Constants
 */

/**
 * CEX.IO WebSocket API URL
 */

const SERVER_URL = 'wss://api.bitfinex.com/ws/2'

/**
 * Ready state constants
 */

const STATE_DICT = {
  'CONNECTING' : 0,
  'OPEN'       : 1,
  'CLOSING'    : 2,
  'CLOSED'     : 3
}

/**
 * Pool config
 */

const CONFIG = {
  max: 100,
  testOnBorrow: true
}

/**
 * WS helpers
 */

const close = ws => {
  debug('Closing WS connection')

  ws.close(1000, 'Expired')
}

/**
 * Check if open
 *
 * @param {WebSocket} ws
 *
 * @returns {boolean}
 */

const isOpen = ws =>
  ws.readyState === STATE_DICT['OPEN']

/**
 * Watch
 */

const watch = ws => {
  const subscriptions = {}

  const subscribe = resObj => {
    subscriptions[resObj.chanId] = resObj.channel
  }

  const handleSubscriptionEvent = raw => {
    const [ chanId, data ] = raw

    const channel = subscriptions[chanId]

    if (typeof data === 'string') {
      ws.emit(`origin:re:${channel}:${data}`)
      return
    }

    ws.emit(`origin:re`, chanId, data)
    ws.emit(`origin:re:${channel}`, data)
  }

  // translate origin events
  ws.on('message', msg => {
    const raw = JSON.parse(msg)

    if (Array.isArray(raw)) {
      handleSubscriptionEvent(raw)
      return void 0
    }

    const { event } = raw
    switch (event) {
      case 'subscribed':
        subscribe(raw)
      default:
        ws.emit(`origin:${event}`, raw)
    }
  })

  return ws
}

/**
 * Monitor
 */

const monitor = ws => {
  const out = x => _ => debug(x)

  // debug core events
  ws.on('open', out('WS open'))
  ws.on('close', code => debug('WS closed with code %d', code))
  ws.on('error', err => debug('WS error: %s', ))

  // debug origin events
  ws.on('origin:info', out('WS origin connected'))
  ws.on('origin:disconnecting', out('WS origin disconnecting'))

  return ws
}

/**
 * Methods
 */

/**
 * Create a connected client
 *
 * @param {string} [url]
 *
 * @returns {WebSocket}
 */

async function connect (url = SERVER_URL) {
  let ws

  debug('WS connecting to %s', url)

  try {
    ws = new WebSocket(url)
  } catch (err) {
    debug('WS create error: %s', err.message)

    return Promise.reject(err)
  }

  watch(ws)
  monitor(ws)

  const cb = (resolve, reject) => {
    try {
      ws.on('open', _ => resolve(ws))
    } catch (err) {
      debug('Error while connecting: %s', err.message)

      reject(err)
    }
  }

  return new Promise(cb)
}

/**
 * Factory methods
 */

/**
 * Create
 */

async function create () {
  debug('Pool creating a WS client')

  return connect()
}

/**
 * Destroy
 */

async function destroy (ws) {
  debug('Pool destroying a WS client')

  const closed = resolve => {
    ws.once('close', resolve)
    close('ws')
  }

  return new Promise(closed)
}

/**
 * Validate
 */

async function validate (ws) {
  debug('Pool validation before borrow')

  const ok = isOpen(ws)

  debug('Pool validation result: %s', ok ? 'ok': 'failed')

  return ok
}


/**
 * Pool constructor
 *
 * @param {Object} [opts] - Options for `generic-pool`
 *
 * @returns {Pool}
 */

function Pool (opts = CONFIG) {
  const factory = {
    create,
    destroy,
    validate
  }

  return createPool(factory, opts)
}

/**
 * Expose constructor
 */

module.exports = Pool
