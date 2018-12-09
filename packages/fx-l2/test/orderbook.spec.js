import test from 'ava'

import Orderbook from '../lib/orderbook'

const A = { side: 'bids', price: 499, amount: 2 }
const B = { side: 'bids', price: 499, amount: 4 }
const C = { side: 'asks', price: 501, amount: 2 }
const D = { side: 'asks', price: 501, amount: 0 }

test('of', t => {
  const book = Orderbook.of(A)
  t.deepEqual(book.orders, [A])
})

test('from', t => {
  const book = Orderbook.from([ A, B ])
  t.deepEqual(book.orders, [A, B])
})

test('concat', t => {
  const bookA = Orderbook.of(A)
  const bookB = Orderbook.of(B)
  const bookC = Orderbook.of(C)
  const bookE = Orderbook.empty()

  t.deepEqual(
    bookA.concat(bookB).concat(bookC),
    bookA.concat(bookB.concat(bookC)),
    'associativity'
  )

  t.deepEqual(
    bookA.concat(bookE),
    bookA
  )
})

test('filter', t => {
  const validAmountsOnly = ({ amount }) => amount > 0

  t.deepEqual(
    Orderbook.from([ B, D ]).filter(validAmountsOnly),
    Orderbook.of(B)
  )
})
