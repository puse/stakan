import test from 'ava'

import Redis from '..'

const db = new Redis()

test.after.always(_ => db.flushdb())

test.serial('single', async t => {
  await db
    .l2add('T', 1, 'bids', 500, 1)
    .then(ids => {
      t.is(ids.length, 1)

      t.is(ids[0], '1-1')
    })
})

test.serial('multi', async t => {
  await db
    .l2add('T', 1, 'bids', 500, 0, 499, 1, 'asks', 500, 1)
    .then(ids => {
      t.is(ids.length, 3)

      t.is(ids[0], '1-2')
      t.is(ids[1], '1-3')
      t.is(ids[2], '1-4')
    })
})