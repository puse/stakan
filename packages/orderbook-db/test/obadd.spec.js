import test from 'ava'

import { Command } from 'ioredis'

import {
  compose,
  splitEvery,
  assoc,
  map,
  fromPairs
} from 'ramda'

import Redis from '..'

import { obadd } from '../lib/commands'

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

const rowOf = (side, price, amount = 1) =>
  ({ side, price, amount })

const BidRow = (...args) =>
  rowOf('bids', ...args)

const AskRow = (...args) =>
  rowOf('asks', ...args)

/**
 *
 */

const redis = new Redis(CONFIG)

/**
 * Commands
 */

async function fetchEntries (start = '-', end = '+') {
  const key = keyFor('log')

  const options = {
    replyEncoding: 'utf8'
  }

  const cmd = new Command('xrange', [ key , start, end], options)

  const parseMembers = compose(
    fromPairs,
    splitEvery(2)
  )

  const parseReply = (arr) => {
    const member = parseMembers(arr[1])
    return assoc('id', arr[0], member)
  }

  return redis
    .sendCommand(cmd)
    .then(map(parseReply))
}

const tearDown = _ => {
  const SUBS = [
    'log',
    'log:offset'
  ]

  const ps = SUBS
    .map(keyFor)
    .map(sub => redis.del(sub))

  return Promise.all(ps)
}

test.before(tearDown)
test.after.always(tearDown)

test.serial('add', async t => {
  const add = (...args) => obadd(redis, ...args)

  const ob1 = {
    broker: 'hopar',
    symbol: 'exo-nyx',
    session: 1
  }

  await add(ob1, [ BidRow(24.5), AskRow(25) ])
    .then(revs => {
      t.deepEqual(revs, [ '1-1', '1-2' ])
    })

  await add(ob1, [ AskRow(26) ])
    .then(revs => {
      t.deepEqual(revs, ['1-3'], 'good revs')
    })

  // await redis
  //   .obadd(TOPIC, 2, [ Entry(24) ])
  //   .then(revs => {
  //     t.deepEqual(revs, ['2-1'], 'reset offset')
  //   })

  await fetchEntries()
    .then(entries => {
      const expected = [
        { side: 'bids', price: '24.5', amount: '1', id: '1-1' },
        { side: 'asks', price: '25', amount: '1', id: '1-2' },
        { side: 'asks', price: '26', amount: '1', id: '1-3' },
        // { side: 'bids', price: '24', amount: '1', id: '2-1' }
      ]

      t.deepEqual(entries, expected)
    })
})
