import test from 'ava'

import Symbol from '../lib/symbol'

// Tests

test('constructor', t => {
  // Behavior
  t.true(Symbol.is(Symbol('btc', 'usd')), 'type')

  // Sanity
  t.throws(() => Symbol('btc'), TypeError, 'arguments')

  // Behavior
  const level = Symbol('btc', 'usd')

  t.is(level.base, 'btc', 'value')
  t.is(level.quote, 'usd', 'value')
})

test('conversions:spec', t => {
  t.deepEqual(
    Symbol.from({ base: 'btc', quote: 'usd' }),
    Symbol('btc', 'usd'),
    'from'
  )
})

test('conversions:pair', t => {
  const symbol = Symbol('btc', 'usd')
  const pair = ['btc', 'usd']

  t.deepEqual(
    Symbol.fromPair(pair),
    symbol,
    'Symbol.fromPair'
  )

  t.deepEqual(
    symbol.toPair(),
    pair,
    'symbol.toPair'
  )

  t.deepEqual(
    Symbol.toPair(symbol),
    pair,
    'symbol.toPair'
  )

  t.deepEqual(
    symbol.toArray(),
    pair,
    'symbol.toArray'
  )
})

test('conversions:string', t => {
  const symbol = Symbol('btc', 'usd')
  const string = 'btc-usd'

  t.deepEqual(
    Symbol.fromString(string),
    symbol,
    'Symbol.fromString'
  )

  t.deepEqual(
    Symbol.toString(symbol),
    string,
    'symbol.toString'
  )

  t.deepEqual(
    symbol.toString(),
    string,
    'symbol.toString'
  )

  t.deepEqual(
    String(symbol),
    string,
    'String(symbol)'
  )
})
