const Source = require('..')

Source('btc-usd')
  .observe()
  .take(100)
  .subscribe(console.log)
