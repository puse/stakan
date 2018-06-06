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
    ts   : `${prefix}:ts`,
    seq  : `${prefix}:seq`,
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
  const prefix = prefixFrom(payload)

  const bidsKey = `${prefix}:bids`
  const bids    = membersFrom(payload.bids)

  const asksKey = `${prefix}:asks`
  const asks    = membersFrom(payload.asks)

  const seqKey  = `${prefix}:seq`
  const seq     = Date.now() * 1000

  const tsKey   = `${prefix}:ts`
  const ts      = Date.now()

  const recover = _ => {
    return merge(payload, { seq, ts })
  }

  return client
    .pipeline()
      .set(seqKey, seq)
      .set(tsKey, ts)
      .del(bidsKey, asksKey)
      .zadd(bidsKey, bids)
      .zadd(asksKey, asks)
    .exec()
    .then(recover)
}

async function updateOrderBook (client, payload) {
  const ts = Date.now()

  const recover = res => {
    const [ seqErr, seq ] = res[0]
    return merge(payload, { seq, ts })
  }

  const keys = keysOf(payload)

  const io = client.pipeline()

  io.incr(keys.seq)

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
      [ , seq ],
      [ , ts ],
      [ , bids ],
      [ , asks ]
    ] = res

    return merge(target, {
      seq,
      ts,
      bids: fromRespRev(bids),
      asks: fromResp(asks)
    })
  }

  const keys = keysOf(target)

  const io = client.pipeline()

  io.get(keys.seq)
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
