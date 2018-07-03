import test from 'ava'

import { Command } from 'ioredis'

import Redis from '..'

import { obwatch } from '../lib/commands'

/**
 *
 */

const CONFIG = {
  // keyPrefix: 'test:',
  // db: 1
}

const TOPIC = 'hopar/exo-nyx'

/**
 * Helpers
 */

const keyFor = sub =>
  `${TOPIC}:ob:${sub}`

const rowOf = (side, price, amount = 1) => [
  'side', side,
  'price', price,
  'amount', amount
]

const BidRow = (...args) =>
  rowOf('bids', ...args)

const AskRow = (...args) =>
  rowOf('asks', ...args)

/**
 *
 */

const redis = new Redis(CONFIG)
const redis2 = new Redis(CONFIG)

/**
 * Commands
 */

async function addRows (ctx = {}, rows) {
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

  const ps = rows.map(add)

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
  const rows = [
    BidRow(24.5),    // 1-1
    BidRow(25),      // 1-2
    AskRow(25.5),    // 1-3
    AskRow(25.5, 2), // 1-4
    BidRow(25, 0),   // 1-5
    AskRow(25)       // 1-6
  ]

  const ids = await addRows({ seed: 1 }, [
    BidRow(24.5),
    AskRow(25)
  ])

  await obwatch(redis, TOPIC, '0')
    .then(res => t.is(res.length, 2))

  await obwatch(redis, TOPIC, '1-2')
    .then(res => t.falsy(res))

  const p3 = obwatch(redis, TOPIC, '1-2', 10000)

  await addRows({ seed: 2 }, [ BidRow(24) ])

  await p3.then(res => t.not(res, null))
})
