import test from 'ava'

import {
  concat
} from '../lib/helpers'

test('concat', t => {
  const A = [
    [ 100, 1 ],
    [ 200, 2 ],
    [ 300, 3 ],
  ]

  const B = [
    [ 100, 2 ],
    [ 150, 2 ],
    [ 300, 0 ]
  ]

  const C = concat(A, B)

  t.deepEqual(
    concat(A, B),
    [
      [ 100, 2 ],
      [ 150, 2 ],
      [ 200, 2 ],
      [ 300, 0 ]
    ]
  )
})
