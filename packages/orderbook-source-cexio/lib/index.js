const { Observable } = require('rxjs/Rx')

const Client = require('./client')

function Remote (symbol) {
  const client = new Client('btc-usd')

  const close$ = Observable
    .fromEvent(client, 'close')

  const patch$ = Observable
    .fromEvent(client, 'patch')
    .takeUntil(close$)

  client.sync()

  return patch$
}

module.exports = Remote
