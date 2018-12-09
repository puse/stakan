import test from 'ava'

import concat from '../lib/helpers/concat'

test('concat', t => {
  const A = { side: 'bids', price: 499, amount: 2 }
  const B = { side: 'bids', price: 499, amount: 4 }
  const C = { side: 'asks', price: 501, amount: 2 }
  const D = { side: 'asks', price: 501, amount: 0 }

  // abstract

  t.deepEqual(
    concat([], [A]),
    concat([A], [])
  )

  t.deepEqual(
    concat([A, B], [C]),
    concat([A], [B, C]),
    'comutative ?'
  )

  t.notDeepEqual(
    concat([A, B], [C, D]),
    concat([A], [B, C]),
    'comutative ?'
  )

  // real

  t.deepEqual(
    concat([A, B], [C]),
    [B, C]
  )

  t.deepEqual(
    concat([A, B], [C, D]),
    [B, D]
  )
})

