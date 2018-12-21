/* eslint-disable */

import test from 'ava'

// import * as R from 'ramda'
import { Bid, Ask, Nil } from '../lib/level'

// const bid40 = [40, 2]
// const ask45 = [45, 2.5]

// const isLevel = that => that instanceof Level

test('constructor', t => {
  // Behavior

  // t.deepEqual(
  //   Bid(40, 2),
  //   { price: 40, quantity: 2 }
  // )

  // Sanity
  t.throws(() => Bid(40), TypeError, 'arguments')
  t.throws(() => Ask(40), TypeError, 'arguments')
  t.throws(() => Nil(40, 2), TypeError, 'arguments')
})

test.todo('of')
test.todo('from')

// fl specs



// Setoid
test('equals', t => {
  // Laws

  const a = Bid(40, 2)
  const b = Bid(40, 2)
  const c = Bid(40, 2)

  t.true(a.equals(a), 'reflexivity')
  t.is(a.equals(b), b.equals(a), 'symmetry')
  t.is(a.equals(b) && b.equals(c), a.equals(c), 'transitivity')

  // Behavior

  t.true(
    Bid(40, 2).equals(Bid(40, 2)),
    'Bid(40, 2) == Bid(40, 2)'
  )

  t.true(
    Bid(40, 2).equals(Bid(40, 3)),
    'Bid(40, 2) == Bid(40, 3)'
  )

  t.true(
    Bid(40, 2).equals(Ask(40, 2)),
    'Bid(40, 2) == Ask(42, 2)'
  )

  t.false(
    Bid(40, 2).equals(Bid(42, 2)),
    'Bid(40, 2) != Bid(42, 2)'
  )
})

// Ord
test('lte,gt', t => {
  // Laws

  const a = Bid(40, 2)
  const b = Bid(42, 2)
  const c = Bid(42, 2)

  t.true(a.lte(b) || b.lte(a), 'totality')
  t.is(a.lte(b) && b.lte(a), a.equals(b), 'antisymmetry')
  t.is(b.lte(c) && c.lte(b), b.equals(c), 'antisymmetry')
  t.is(a.lte(b) && b.lte(c), a.lte(c), 'transitivity')

  // Behavior
  t.true(a.lte(a), 'Bid(40, 2) <= Bid(40, 2)')
  t.true(a.lte(b), 'Bid(40, 2) <= Bid(42, 2)')
  t.false(b.lte(a), 'Bid(42, 2) <= Bid(40, 2)')
  t.false(a.gt(a), 'Bid(40, 2) > Bid(40, 2)')
  t.false(a.gt(b), 'Bid(40, 2) > Bid(42, 2)')
  t.true(b.gt(a), 'Bid(42, 2) > Bid(40, 2)')
})

// // Semigroup
// test('concat', t => {
//   const side = Side.from(40, 2)
//   const sideNext = Side.from(xsNext)
//   const sideExt = Side.of([ 80, 4 ])
//
//   t.true(side.concat(sideNext) instanceof Side, 'type')
//
//   t.true(
//     R.equals(
//       side.concat(sideNext),
//       Side.from(
//         [ [50, 0],
//           [70, 2],
//           [60, 1],
//           [75, 3] ]
//       )
//     ),
//     'value'
//   )
//
//   t.true(
//     R.equals(
//       side.concat(sideNext).concat(sideExt),
//       side.concat(sideNext.concat(sideExt))
//     ),
//     'associativity'
//   )
// })
//
// // Monoid
// test('empty', t => {
//   const side = Side.from(xs)
//   const empty = Side.empty()
//
//   t.true(empty instanceof Side, 'type')
//
//   t.true(R.equals(empty, Side.from([])), 'value')
//
//   t.true(
//     R.equals(
//       side.concat(empty),
//       side
//     ),
//     'right identity'
//   )
//
//   t.true(
//     R.equals(
//       empty.concat(side),
//       side
//     ),
//     'left identity'
//   )
// })
//
// // Functor
// test('map', t => {
//   const side = Side.from(xs)
//
//   const f = ([p, q]) => [p + 1, q]
//   const g = ([p, q]) => [p, q * 2]
//
//   t.true(
//     R.equals(
//       side.map(R.identity),
//       side
//     ),
//     'identity'
//   )
//
//   t.true(
//     R.equals(
//       side.map(f).map(g),
//       side.map(R.compose(f, g))
//     ),
//     'composition'
//   )
// })
//
// // Filterable
// test('filter', t => {
//   const side = Side.from(xs)
//
//   const p = R.propSatisfies(R.lt(50), 0)
//   const q = R.propSatisfies(R.gt(70), 0)
//
//   t.true(side.filter(p) instanceof Side, 'type')
//
//   t.true(
//     R.equals(
//       side.filter(R.both(p, q)),
//       side.filter(p).filter(q)
//     ),
//     'distributivity'
//   )
//
//   t.true(
//     R.equals(
//       side.filter(R.T),
//       side
//     ),
//     'identity'
//   )
//
//   t.true(
//     R.equals(
//       side.filter(R.F),
//       Side.from(xsNext).filter(R.F)
//     ),
//     'annihilation'
//   )
//
//   //
//
//   t.true(
//     R.equals(
//       side.filter(p),
//       Side.from(
//         [ [70, 1],
//           [60, 1] ]
//       )
//     ),
//     'value'
//   )
// })
//
// // Foldable
// test('reduce', t => {
//   const side = Side.from(xs)
//
//   const concater = (y, x) => y.concat(Side.of(x))
//
//   t.true(
//     R.equals(
//       side.reduce(concater, Side.empty()),
//       side
//     ),
//     'identity'
//   )
//
//   //
//
//   t.is(
//     side.reduce((y, x) => y + x[1], 0),
//     3,
//     'value'
//   )
// })
//
// test('Asks', t => {
//   const asks = new Asks(xs)
//
//   t.true(asks instanceof Asks, 'type')
//   t.true(asks instanceof Side, 'type')
//
//   t.true(Asks.from(xs) instanceof Asks, 'type')
//   t.true(Asks.of(xs[0]) instanceof Asks, 'type')
//   t.true(Asks.empty() instanceof Asks, 'type')
//
//   t.is(Asks.from(asks), asks, 'self')
//
//   t.deepEqual(
//     asks.valueOf(),
//     [ [ 50, 1 ],
//       [ 60, 1 ],
//       [ 70, 1 ] ],
//     'sorted ascending'
//   )
// })
//
// test('Bids', t => {
//   const bids = new Bids(xs)
//
//   t.true(bids instanceof Bids, 'type')
//   t.true(bids instanceof Side, 'type')
//
//   t.true(Bids.from(xs) instanceof Bids, 'type')
//   t.true(Bids.of(xs[0]) instanceof Bids, 'type')
//   t.true(Bids.empty() instanceof Bids, 'type')
//
//   t.is(Bids.from(bids), bids, 'self')
//
//   t.deepEqual(
//     bids.valueOf(),
//     [ [ 70, 1 ],
//       [ 60, 1 ],
//       [ 50, 1 ] ],
//     'sorted descending'
//   )
// })
