const createSubscription = require('../lib/subscription')

createSubscription({}, 'tBTCUSD')
  .take(100)
  .subscribe(console.log)
