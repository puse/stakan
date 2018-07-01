
import test from 'ava'

import Redis from '..'

/**
 *
 */

const CONFIG = {
  // keyPrefix: 'test:',
  // db: 1
}

const TOPIC = 'hopar:exo-nyx'

/**
 * Helpers
 */

const keyFor = sub =>
  `${TOPIC}:ob:${sub}`

const Entry = (price, amount = 1) =>
  [ amount, price ]

/**
 *
 */

const redis = new Redis(CONFIG)

/**
 * Commands
 */

const tearDown = _ => {
  const SUBS = [
    'rev',
    'asks',
    'bids'
  ]

  const ps = SUBS
    .map(keyFor)
    .map(sub => redis.del(sub))

  return Promise.all(ps)
}

test.before(tearDown)

test.after.always(tearDown)

test.serial('obdepth', async t => {
  const bids = [
    1, 2400000000,
    1, 2450000000
  ]

  const asks = [
    1, 2500000000,
    1, 2600000000
  ]

  await redis.set(keyFor('rev'), '1-4')
  await redis.zadd(keyFor('bids'), ...bids)
  await redis.zadd(keyFor('asks'), ...asks)

  await redis
    .obdepth(TOPIC)
    .then(res => {
      const expeced = {
        rev: '1-4',
        asks: [ { price: 24, amount: 1  }, { price: 24.5, amount: 1  } ],
        bids: [ { price: 25, amount: 1  }, { price: 26, amount: 1  } ]
      }

      t.deepEqual(res, expeced)
    })
})
