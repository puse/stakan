const {
  head,
  sortBy,
  splitEvery,
  merge,
  curry,
  flatten,
  reverse,
  map,
  compose
} = require('ramda')

/**
 * Helpers
 */

const prefixFrom = payload => {
  const { broker, symbol } = payload
  return `${broker}:${symbol}:orderbook`
}

const keysOf = target => {
  const { broker, symbol } = target

  const prefix = `${broker}:${symbol}:orderbook`

  return {
    id   : `${prefix}:id`,
    ts   : `${prefix}:ts`,
    bids : `${prefix}:bids`,
    asks : `${prefix}:asks`
  }
}

const membersFrom = compose(
  flatten,
  map(reverse)
)

/**
 * Actions
 */

async function resetOrderBook (client, payload) {
  const keys = keysOf(payload)

  const id = Date.now() * 1000
  const ts = Date.now()

  const recover = _ => {
    return merge(payload, { id, ts })
  }

  const io = client.pipeline()

  io.set(keys.id, id)
  io.set(keys.ts, ts)

  io.del(keys.bids, keys.asks)
    .zadd(keys.bids, membersFrom(payload.bids))
    .zadd(keys.asks, membersFrom(payload.asks))

  return io
    .exec()
    .then(recover)
}

async function updateOrderBook (client, payload) {
  const ts = Date.now()

  const recover = res => {
    const [ , id ] = res[0]
    return merge(payload, { id, ts })
  }

  const keys = keysOf(payload)

  const io = client.pipeline()

  io.incr(keys.id)

  io.set(keys.ts, ts)

  io.zadd(keys.bids, membersFrom(payload.bids))
    .zadd(keys.asks, membersFrom(payload.asks))

  return io
    .exec()
    .then(recover)
}

async function getOrderBook (client, target) {
  const fromResp = compose(
    sortBy(head),
    splitEvery(2),
    map(Number)
  )

  const fromRespRev = compose(
    reverse,
    fromResp,
  )

  const recover = res => {
    const [
      [ , id ],
      [ , ts ],
      [ , bids ],
      [ , asks ]
    ] = res

    return merge(target, {
      id,
      ts,
      bids: fromRespRev(bids),
      asks: fromResp(asks)
    })
  }

  const keys = keysOf(target)

  const io = client.pipeline()

  io.get(keys.id)
  io.get(keys.ts)

  io.zrangebyscore(keys.bids, '(0', '+inf', 'WITHSCORES')
  io.zrangebyscore(keys.asks, '(0', '+inf', 'WITHSCORES')

  return io
    .exec()
    .then(recover)
}

/**
 * Expose curried
 */

module.exports.getOrderBook = curry(getOrderBook)
module.exports.resetOrderBook = curry(resetOrderBook)
module.exports.updateOrderBook = curry(updateOrderBook)
