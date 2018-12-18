import test from 'ava'

import Depth from '../lib/depth'
import { Bids, Asks } from '../lib/depth.side'

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

  t.true(depth.bids instanceof Bids)
  t.true(depth.asks instanceof Asks)
})

test('valueOf', t => {
  const depth = new Depth(bids, asks)

  t.deepEqual(
    depth.valueOf(),
    {
      bids: [
        [ 100, 1 ],
        [ 99, 1 ]
      ],
      asks: [
        [ 101, 1 ],
        [ 102, 1 ]
      ]
    }
  )
})

test.todo('concat')
