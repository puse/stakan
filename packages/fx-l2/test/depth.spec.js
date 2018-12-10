import test from 'ava'

import R from 'ramda'

import Depth from '../lib/depth'

const A = { side: 'bids', price: 499, amount: 2 }
const B = { side: 'bids', price: 499, amount: 0 }
const C = { side: 'asks', price: 501, amount: 2 }
const D = { side: 'asks', price: 501, amount: 0 }

test('of', t => {
  t.deepEqual(
    Depth.of(A),
    new Depth([ [ -499, 2 ] ])
  )

  t.deepEqual(
    Depth.of(C),
    new Depth([ [ 501, 2 ] ])
  )
})

test('empty', t => {
  t.deepEqual(
    Depth.empty(),
    new Depth([])
  )
})

test('from', t => {
  t.deepEqual(
    Depth.from([ A, B, C ]),
    new Depth([ [ -499, 0 ],
                [  501, 2 ] ])
  )
})

test('concat', t => {
  const depthA = Depth.of(A)
  const depthB = Depth.of(B)
  const depthC = Depth.of(C)
  const depthE = Depth.empty()

  t.deepEqual(
    depthA.concat(depthB).concat(depthC),
    depthA.concat(depthB.concat(depthC)),
    'associativity'
  )

  t.deepEqual(
    depthA.concat(depthE),
    depthA
  )

  t.deepEqual(
    depthE.concat(depthA),
    depthA
  )

  t.deepEqual(
    depthA.concat(depthB).concat(depthC),
    new Depth([ [ -499, 0 ],
                [  501, 2 ] ])
  )
})

test('map', t => {
  const depth = Depth.from([ A, C ])

  const higherPrices = R.evolve({ price: R.add(1) })

  t.deepEqual(
    depth.map(higherPrices),
    new Depth([ [ -500, 2 ],
                [ 502, 2 ] ])
  )
})

test('reduce', t => {
  const depth = Depth.from([ A, C ])

  const maxPrice = (max, { price }) => Math.max(max, price)

  t.is(depth.reduce(maxPrice, 0), 501)
})

test('filter', t => {
  const bidsOnly = R.whereEq({ side: 'bids' })

  t.deepEqual(
    Depth.from([ A, D ]).filter(bidsOnly),
    Depth.of(A)
  )
})
