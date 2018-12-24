const debug = require('debug')('stakan:connector:cexio')

const { ulid } = require('ulid')

/**
 * Helpers
 */

const toMessage = (payload, oid) => {
  payload.oid = oid
  return JSON.stringify(payload)
}

/**
 * Send
 */

function send (ws, payload, awaitReply) {
  const oid = ulid()

  const msg = toMessage(payload, oid)

  const send = resolve => {
    ws.send(msg, resolve)
  }

  const sendWithReply = (resolve, reject) => {
    ws.once(`origin:re:${oid}`, resolve)
    ws.once(`origin:error:${oid}`, reject)

    ws.send(msg)
  }

  const op = awaitReply
    ? sendWithReply
    : send

  return new Promise(op)
}

module.exports = send
