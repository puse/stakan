import test from 'ava'

import Redis from 'ioredis'

import { l2commit } from '..'

const db = new Redis()

test.before(async _ => {
  const { lua, numberOfKeys = 1 } = l2commit
  db.defineCommand('l2commit', { lua, numberOfKeys })

  const key = `T:journal`

  let offset = 1
  const nextOffset = () => offset++

  const xaddTo = row => {
    const rev = `1-${nextOffset()}`
    return db.xadd(key, rev, ...row)
  }

  const xadd = (side, price, amount) =>
    xaddTo([
      'side', side,
      'price', price,
      'amount', amount
    ])

  const ps = [
    xadd('bids', 500, 1),
    xadd('bids', 500, 0),
    xadd('bids', 499, 1),
    xadd('asks', 500, 1)
  ]

  return Promise
    .all(ps)
})

test.after.always(_ => db.flushdb())

test.serial('import one', async t => {
  await db
    .l2commit('T', 0, '1-1')
    .then(rev => {
      t.is(rev, '1-1')
    })
})

test.serial('import rest', async t => {
  await db
    .l2commit('T')
    .then(rev => {
      t.is(rev, '1-4')
    })
})

test.serial('results', async t => {
  const scaleAll = xs =>
    xs.map(x => x / 100000000)

  // res
  await db
    .get('T:data:rev')
    .then(rev => t.is(rev, '1-4'))

  await db
    .zrangebylex('T:data:bids', '-', '+')
    .then(scaleAll)
    .then(bids => {
      t.deepEqual(bids, [ 499 ])
    })

  await db
    .zrangebylex('T:data:asks', '-', '+')
    .then(scaleAll)
    .then(asks => {
      t.deepEqual(asks, [ 500 ])
    })
})
