const Source = require('..')

const source = Source()

source
  .observe('btc-usd')
  .take(100)
  .subscribe(console.log)
