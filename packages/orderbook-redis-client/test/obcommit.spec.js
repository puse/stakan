import test from 'ava'

import { Command } from 'ioredis'

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

const Entry = (side, price, amount = 1) => [
  'side', side,
  'price', price,
  'amount', amount
]

const BidEntry = (...args) =>
  Entry('bids', ...args)

const AskEntry = (...args) =>
  Entry('asks', ...args)

/**
 *
 */

const redis = new Redis(CONFIG)

/**
 * Commands
 */

async function addEntries (ctx = {}, entries) {
  const { seed = Date.now() } = ctx

  let { offset = 0 } = ctx

  //

  const add = members =>  {
    const key = keyFor('log')
    const id = `${seed}-${++offset}`

    const replyEncoding = 'utf8'

    const cmd = new Command('xadd', [ key, id, ...members ], { replyEncoding })

    return redis
      .sendCommand(cmd)
  }

  const ps = entries.map(add)

  return Promise.all(ps)
}

const tearDown = _ => {
  const SUBS = [
    'log',
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

test.serial('import', async t => {
  const entries = [
    BidEntry(24.5),    // 1-1
    BidEntry(25),      // 1-2
    AskEntry(25.5),    // 1-3
    AskEntry(25.5, 2), // 1-4
    BidEntry(25, 0),   // 1-5
    AskEntry(25)       // 1-6
  ]

  const assertRev = (expected, message) => rev =>
    t.is(rev, expected, message)

  const assertList = (expected, message) => list =>
    t.deepEqual(list, expected, message)


  const ids = await addEntries({ seed: 1 }, entries)

  await redis
    .obcommit(TOPIC, '1-2')
    .then(assertRev(null, 'bad start'))

  await redis
    .obcommit(TOPIC, 0, ids[2])
    .then(assertRev('1-3'))

  await redis
    .obcommit(TOPIC, '1-4', '1-5')
    .then(rev => t.is(rev, '1-5', 'ok start end'))

  await redis
    .obcommit(TOPIC)
    .then(rev => t.is(rev, '1-6', 'internal rev as start, till end'))

  await redis
    .zrangebylex(keyFor('bids'), '-', '+')
    .then(assertList([ '2450000000' ]))

  await redis
    .zrangebylex(keyFor('asks'), '-', '+')
    .then(assertList([ '2500000000', '2550000000' ]))
})

test.serial('next seed', async t => {
  const entries = [
    BidEntry(35),
    AskEntry(35.5)
  ]

  const assertList = (expected, message) => list =>
    t.deepEqual(list, expected, message)


  const ids = await addEntries({ seed: 2 }, entries)

  await redis
    .obcommit(TOPIC )

  await redis
    .zrangebylex(keyFor('bids'), '-', '+')
    .then(assertList(['3500000000'], 'reset on new seed'))

  await redis
    .zrangebylex(keyFor('asks'), '-', '+')
    .then(assertList(['3550000000'], 'reset on new seed'))
})
