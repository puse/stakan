
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

const Entry = (price, amount = 1) => [
  amount,
  price
]

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
      console.log(res)
    })

  t.pass()
  // const assertRev = (expected, message) => rev =>
  //   t.is(rev, expected, message)
  //
  // const assertList = (expected, message) => list =>
  //   t.deepEqual(list, expected, message)
  //
  //
  // const ids = await addEntries({ seed: 1 }, entries)
  //
  // await redis
  //   .obcommit(TOPIC, '1-2')
  //   .then(assertRev(null, 'bad start'))
  //
  // await redis
  //   .obcommit(TOPIC, 0, ids[2])
  //   .then(assertRev('1-3'))
  //
  // await redis
  //   .obcommit(TOPIC, '1-4', '1-5')
  //   .then(rev => t.is(rev, '1-5', 'ok start end'))
  //
  // await redis
  //   .obcommit(TOPIC)
  //   .then(rev => t.is(rev, '1-6', 'internal rev as start, till end'))
  //
  // await redis
  //   .zrangebylex(keyFor('bids'), '-', '+')
  //   .then(assertList([ '2450000000' ]))
  //
  // await redis
  //   .zrangebylex(keyFor('asks'), '-', '+')
  //   .then(assertList([ '2500000000', '2550000000' ]))
})
