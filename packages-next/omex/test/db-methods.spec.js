import test from 'ava'

import Redis from 'ioredis'

import * as R from 'ramda'

const Chance = require('chance')

import DB from '../lib/db-methods'

/**
 * Data Asserts
 */

const levelRecords = require('./assets/level-records')

/**
 * Instances
 */

const redis = new Redis()

const chance = new Chance('test')

/**
 * Hooks
 */

/**
 * setup
 *
 * @param t
 * @returns {undefined}
 */

const setup = t => {
  const base = chance.word({ length: 3 })
  const quote = chance.word({ length: 3 })
  const broker = chance.word({ length: 5 })

  t.context.topic = `${broker}/${base}-${quote}`
}

/**
 * tearDown
 *
 * @param t
 * @returns {Promise}
 */

const tearDown = t => {
  const { topic } = t.context

  const subs = [
    'queue',
    'depth:levels',
    'depth:rev'
  ]

  const ps = subs
    .map(sub => `${sub}:${topic}`)
    .map(key => redis.del(key))

  return Promise.all(ps)
}

test.beforeEach(setup)

test.afterEach.always(tearDown)

/**
 * Tests
 */

test('addLevel - ok', async t => {
  const { topic } = t.context

  const pqFromArr = R.compose(
    R.map(Number),
    R.fromPairs,
    R.splitEvery(2)
  )

  const pqFromObj = R.pick(['price', 'quantity'])

  await DB
    .addLevel(redis, topic, levelRecords[0])

  await redis
    .xrange(`queue:${topic}`, '-', '+')
    .then(res => {
      const [ [ id, propsArr] ] = res

      t.is(id, '1-1')

      t.deepEqual(
        pqFromArr(propsArr),
        pqFromObj(levelRecords[0])
      )
    })

})

test.todo('addDepth')
test.todo('commitLevels')
