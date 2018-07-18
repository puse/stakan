import test from 'ava'

import Redis from '..'

const db = new Redis()

const target = 'cexio:eth-usd'
const seed = Date.now()

test.after.always(_ => db.flushdb())

test.serial('single', async t => {
  await db
    .l2add(target, seed, 'bids', 500, 1)
    .then(ids => {
      t.is(ids.length, 1)

      t.is(ids[0], `${seed}-1`)
    })
})

test.serial('multi', async t => {
  await db
    .l2add(target, seed, 'bids', 500, 0, 499, 1, 'asks', 500, 1)
    .then(ids => {
      t.is(ids.length, 3)

      t.is(ids[0], `${seed}-2`)
      t.is(ids[1], `${seed}-3`)
      t.is(ids[2], `${seed}-4`)
    })
})
