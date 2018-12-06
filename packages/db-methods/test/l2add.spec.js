import test from 'ava'

import {
  merge,
  times,
  compose,
  assoc,
  map,
  fromPairs
} from 'ramda'

import Redis from '@stakan/redis'

import { l2add } from '..'

/**
 * Helpers
 */

const TOPIC = {
  broker: 'hopar',
  symbol: 'exo-nyx'
}

const keyFor = sub =>
  `${TOPIC.broker}/${TOPIC.symbol}:${sub}`

const Snapshot = merge(TOPIC)

const rowOf = (side, price, amount = 1) =>
  ({ side, price, amount })

const BidRow = (...args) =>
  rowOf('bids', ...args)

const AskRow = (...args) =>
  rowOf('asks', ...args)

/**
 *
 */

const redis = new Redis()

/**
 * Commands
 */

const tearDown = _ => {
  const SUBS = [
    'journal',
    'journal:offset'
  ]

  const ps = SUBS
    .map(keyFor)
    .map(sub => redis.del(sub))

  return Promise.all(ps)
}

const add = (...args) => l2add(redis, ...args)

test.before(tearDown)
test.afterEach.always(tearDown)

test.serial('add', async t => {
  const patches = [
    Snapshot({
      session: 1,
      rows: [
        BidRow(24.5),
        AskRow(25)
      ]
    }), Snapshot({
      session: 1,
      rows: [
        AskRow(26),
      ]
    }), Snapshot({
      session: 2,
      rows: [
        BidRow(24),
      ]
    })
  ]

  await add(TOPIC, 1, [ BidRow(24.5), AskRow(25) ])
    .then(rev => t.is(rev, '1-2'))

  await add(TOPIC, 1, [ AskRow(26) ])
    .then(rev => t.is(rev, '1-3'))

  await add(TOPIC, 2, [ BidRow(24) ])
    .then(rev => t.is(rev, '2-1', 'reset'))

  const expected = [
    [ '1-1', [ 'side', 'bids', 'price', '24.5', 'amount', '1' ] ],
    [ '1-2', [ 'side', 'asks', 'price', '25', 'amount', '1' ] ],
    [ '1-3', [ 'side', 'asks', 'price', '26', 'amount', '1' ] ],
    [ '2-1', [ 'side', 'bids', 'price', '24', 'amount', '1' ] ]
  ]

  await redis
    .xrange(keyFor('journal'), '-', '+')
    .then(entries => t.deepEqual(entries, expected))
})

test.serial('capped', async t => {
  let offset = 10000
  const step = 20

  while (offset = offset - step) {
    const rows = times(BidRow, step)
    await l2add(redis, TOPIC, 2, rows)
  }

  await redis
    .xlen(keyFor('journal'))
    .then(size => t.true(size < 1200, 'near 1000'))
})
