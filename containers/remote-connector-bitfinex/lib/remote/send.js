const debug = require('debug')('stakan:connector:bitfinex')

/**
 * Helpers
 */

const toMessage = payload => {
  return JSON.stringify(payload)
}

/**
 * Send
 */

function send (ws, payload, awaitReply) {
  const msg = toMessage(payload)

  const send = resolve => {
    ws.send(msg, resolve)
  }

  return new Promise(send)
}

module.exports = send
