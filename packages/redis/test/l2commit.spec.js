import test from 'ava'

import Redis from '..'

const db = new Redis()

const topic = 'cexio:eth-usd'

const seed = Date.now()

test.before(async _ => {
  let offset = 1

  const xadd = (side, price, amount) => {
    const key = `${topic}:log`
    const id = `${seed}-${offset++}`

    const row = [
      'side', side,
      'price', price,
      'amount', amount
    ]

    db.xadd(key, id, ...row)
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
  const end = `${seed}-1`

  await db
    .l2commit(topic, 0, end)
    .then(rev => {
      t.is(rev, `${seed}-1`)
    })

})

test.serial('import rest', async t => {
  await db
    .l2commit(topic)
    .then(rev => {
      t.is(rev, `${seed}-4`)
    })
})

test.serial('results', async t => {
  const scaleAll = xs =>
    xs.map(x => x / 100000000)

  // res
  await db
    .get(`${topic}:rev`)
    .then(rev => t.is(rev, `${seed}-4`))

  await db
    .zrangebylex(`${topic}:bids`, '-', '+')
    .then(scaleAll)
    .then(bids => {
      t.deepEqual(bids, [ 499 ])
    })

  await db
    .zrangebylex(`${topic}:asks`, '-', '+')
    .then(scaleAll)
    .then(asks => {
      t.deepEqual(asks, [ 500 ])
    })
})
