const Poller = require('../lib')

const opts = {
  mqtt: { url: 'mqtt://localhost:1883' },
  http: { baseURL: 'http://localhost:8080' }
}

Poller(opts, 'cexio/eth-usd')
  .subscribe(console.log, console.error)
