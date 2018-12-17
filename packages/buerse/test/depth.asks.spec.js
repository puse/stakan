import test from 'ava'

import Side from '../lib/internal/depth.side'
import Asks from '../lib/depth.asks'

const xs = [
  [ 50, 1 ],
  [ 70, 1 ],
  [ 60, 1 ]
]

test('Asks', t => {
  const asks = new Asks(xs)

  t.true(asks instanceof Asks, 'type')
  t.true(asks instanceof Side, 'type')
})

test('sort', t => {
  const asks = new Asks(xs)

  t.deepEqual(
    asks.valueOf(),
    [ [ 50, 1 ],
      [ 60, 1 ],
      [ 70, 1 ] ],
    'sorted descending'
  )
})
