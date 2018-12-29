const Source = require('..')

const topic = {
  broker: 'bitfinex',
  symbol: 'btc-usd'
}

Source({}, topic)
  .take(100)
  .subscribe(console.log)
