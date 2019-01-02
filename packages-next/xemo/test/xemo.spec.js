import test from 'ava'

import Redis from 'ioredis'

import * as R from 'ramda'

import xemo from '..'

const records = [
  {
    header: { session: 1, offset: 1 },
    level: { price: 500, quantity: -2 }
  }, {
    header: { session: 1, offset: 2 },
    level: { price: 501, quantity: 2 }
  }, {
    header: { session: 1, offset: 3 },
    level: { price: 500, quantity: 0 }
  }, {
    header: { session: 1, offset: 4 },
    level: { price: 501, quantity: 1 }
  }
]

test.beforeEach(async t => {
  const db = new Redis()
  const topic = {
    broker: 'xxx',
    symbol: 'aaa'
  }

  await db.del('xxx/aaa')

  for (let i in records) {
    const { header, level } = records[i]

    const id = `${header.session}-${header.offset}`
    const args = R.unnest(R.toPairs(level))
    await db.xadd('xxx/aaa', id, args)
  }

  t.context = { db, topic }
})

test('xero', t => {
  const { db, topic } = t.context

  const assertResult = res => {
    t.deepEqual(res, records)
  }

  return xemo(db, topic)
    .take(4)
    .toArray()
    .map(assertResult)
})
