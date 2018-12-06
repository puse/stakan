import test from 'ava'

import Redis from 'ioredis'

import { l2depth } from '..'

const db = new Redis()

test.before(async _ => {
  const { lua, numberOfKeys = 1 } = l2depth
  db.defineCommand('l2depth', { lua, numberOfKeys })

  await db.set('T:data:rev', '1-1')
  await db.zadd('T:data:bids', 1, 9900000000)
  await db.zadd('T:data:bids', 0, 9950000000)
  await db.zadd('T:data:asks', 1, 10000000000)
  await db.zadd('T:data:asks', 1, 10100000000)
})

test.after.always(_ => db.flushdb())

test('x', async t => {
  await db
    .l2depth('T')
    .then(res => {
      const [ rev, bids, asks ] = res

      t.is(rev, '1-1')
      t.deepEqual(bids, ['99', '1'], 'skip void')
      t.deepEqual(asks, ['100', '1', '101', '1'])
    })

  t.pass()
})
