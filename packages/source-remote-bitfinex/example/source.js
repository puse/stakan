const Source = require('..')

const { Symbol } = require('@stakan/types')

const source = Source()

const symbol = Symbol('btc', 'usd')

source
  .observe(symbol)
  .take(100)
  .subscribe(console.log)
