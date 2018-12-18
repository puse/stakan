import test from 'ava'

import Depth from '../lib/depth'

const bids = [
  [ 99, 1 ],
  [ 100, 1 ]
]

const asks = [
  [ 101, 1 ],
  [ 102, 1 ]
]

test('constructor', t => {
  t.is(typeof Depth, 'function')

  const depth = new Depth(bids, asks)

  t.not(depth.bids, undefined)
  t.not(depth.asks, undefined)
})

test('valueOf', t => {
  const depth = new Depth(bids, asks)

  const value = depth.valueOf()

  t.deepEqual(value, { bids, asks })
})

test.todo('concat')
