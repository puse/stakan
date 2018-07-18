import test from 'ava'

import Redis from '..'

const db = new Redis()

// const topic = 'T'
// const rev = '1-1'

test.before(async _ => {
  await db.set('T:rev', '1-1')
  await db.zadd('T:bids', 1, 9900000000)
  await db.zadd('T:bids', 0, 9950000000)
  await db.zadd('T:asks', 1, 10000000000)
  await db.zadd('T:asks', 1, 10100000000)
})

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
