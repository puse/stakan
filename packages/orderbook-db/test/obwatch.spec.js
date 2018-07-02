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
const redis2 = new Redis(CONFIG)

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

    return redis2
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

  const ids = await addEntries({ seed: 1 }, [
    BidEntry(24.5),
    AskEntry(25)
  ])

  await redis
    .obwatch(TOPIC, '0')
    .then(res => t.is(res.length, 2))

  await redis
    .obwatch(TOPIC, '1-2')
    .then(res => t.falsy(res))

  const p3 = redis
    .obwatch(TOPIC, '1-2', 10000)

  await addEntries({ seed: 2 }, [ BidEntry(24) ])

  await p3.then(res => t.not(res, null))
})