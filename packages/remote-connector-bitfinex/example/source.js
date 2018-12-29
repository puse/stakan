const Remote = require('..')

Remote()
  .observeOrderBookLevels('btc-usd')
  .take(100)
  .subscribe(console.log)
