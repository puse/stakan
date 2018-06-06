const Redis = require('ioredis')

const {
  flatten,
  reverse,
  map,
  compose
} = require('ramda')

const prefixFrom = payload => {
  const { broker, symbol } = payload
  return `${broker}:${symbol}:orderbook`
}

const membersFrom = compose(
  flatten,
  map(reverse)
)

async function snapshot (client, payload) {
  const keyPrefix = prefixFrom(payload)

  const bidsKey   = `${keyPrefix}:bids`
  const bidsValue = membersFrom(payload.bids)

  const asksKey   = `${keyPrefix}:asks`
  const asksValue = membersFrom(payload.asks)

  const seqKey    = `${keyPrefix}:seq`
  const seqValue  = Date.now() * 1000

  return client
    .pipeline()
      .del(bidsKey, asksKey)
      .zadd(bidsKey, bidsValue)
      .zadd(asksKey, asksValue)
      .set(seqKey, seqValue)
    .exec()
}

async function update (client, payload) {
  const keyPrefix = prefixFrom(payload)

  const bidsKey   = `${keyPrefix}:bids`
  const bidsValue = membersFrom(payload.bids)

  const asksKey   = `${keyPrefix}:asks`
  const asksValue = membersFrom(payload.asks)

  const seqKey    = `${keyPrefix}:seq`

  return client
    .pipeline()
      .zadd(bidsKey, bidsValue)
      .zremrangebyscore(bidsKey, '-inf', 0)
      .zadd(asksKey, asksValue)
      .zremrangebyscore(asksKey, '-inf', 0)
      .incr(seqKey)
    .exec()
}


async function run () {
  const client = new Redis('redis://localhost:6379')

  const broker = 'cexio'
  const symbol = 'btc-usd'

  const bids = [
    [
      7480,
      1.357864,
    ],
    [
      7477,
      0.00333557,
    ]
  ]

  const asks = [
    [
      7482,
      0.357864,
    ],
    [
      7499,
      0.2
    ]
  ]

  const t = Date.now()

  await snapshot(client, { broker, symbol, bids, asks })
    .then(console.log)

  console.log(Date.now() - t)
}

run()
