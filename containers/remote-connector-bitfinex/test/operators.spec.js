import test from 'ava'

import { Observable } from 'rxjs/Rx'

import * as R from 'ramda'

import Ops from '../lib/operators'

const GOLDEN = {
  raw: [
    [ 3880, 1, +0.3 ],
    [ 3881, 2, +0.4 ],
    [ 3883, 2, -0.2 ],
    [ 3880, 0, +1 ],
    [ 3881, 1, +0.1 ]
  ],
  levels: [
    { price: 3880, quantity: 0.3 },
    { price: 3881, quantity: 0.4 },
    { price: 3883, quantity: -0.2 },
    { price: 3880, quantity: 0 },
    { price: 3881, quantity: 0.1 }
  ],
  packets: [
    {
      correlation: { session: 1, offset: 0 },
      level: { price: 3880, quantity: 0.3 }
    }, {
      correlation: { session: 1, offset: 1 },
      level: { price: 3881, quantity: 0.4 }
    }, {
      correlation: { session: 1, offset: 2 },
      level: { price: 3883, quantity: -0.2 }
    }, {
      correlation: { session: 1, offset: 3 },
      level: { price: 3880, quantity: 0 }
    }, {
      correlation: { session: 1, offset: 4 },
      level: { price: 3881, quantity: 0.1 }
    }
  ]
}

test('recoverLevels', t => {
  const assert = result => {
    t.deepEqual(result, GOLDEN.levels)
  }

  return Observable
    .from(GOLDEN.raw)
    .pipe(
      Ops.recoverLevels()
    )
    .toArray()
    .map(assert)
})

test('stampCorrelation', t => {
  const assert = result => {
    t.deepEqual(result, GOLDEN.packets)
  }

  return Observable
    .from(GOLDEN.levels)
    .pipe(
      Ops.stampCorrelation(1)
    )
    .toArray()
    .map(assert)
})

test('toBuffer', t => {
  const assert = result => {
    const type = typeof result
    t.true(type === 'string' || type === 'buffer')
  }

  return Observable
    .from(GOLDEN.packets)
    .pipe(
      Ops.toBuffer()
    )
    .map(assert)
})
