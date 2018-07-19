import test from 'ava'

import Redis from '..'

const db = new Redis()

test.before(async _ => {
  let offset = 1

  const xadd = (side, price, amount) => {
    const key = `T:log`
    const id = `1-${offset++}`

    const row = [
      'side', side,
      'price', price,
      'amount', amount
    ]

    db.xadd('T:log', id, ...row)
  }

  const ps = [
    xadd('bids', 500, 1),
    xadd('bids', 500, 0),
    xadd('bids', 499, 1),
    xadd('asks', 500, 1)
  ]

  return Promise.all(ps)
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
    .get('T:rev')
    .then(rev => t.is(rev, '1-4'))

  await db
    .zrangebylex('T:bids', '-', '+')
    .then(scaleAll)
    .then(bids => {
      t.deepEqual(bids, [ 499 ])
    })

  await db
    .zrangebylex('T:asks', '-', '+')
    .then(scaleAll)
    .then(asks => {
      t.deepEqual(asks, [ 500 ])
    })
})
