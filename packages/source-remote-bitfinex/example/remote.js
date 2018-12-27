const Remote = require('../lib/remote')

const remote = Remote()

remote
  .observe('tBTCUSD')
  .take(100)
  .subscribe(console.log)
