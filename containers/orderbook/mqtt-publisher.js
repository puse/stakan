const { Observable } = require('rxjs/Rx')

const Redis = require('@stakan/redis')

const Publisher = require('@stakan/publisher')

const Source = require('./lib/observable-db')

const TARGETS = [
  {
    broker: 'cexio',
    symbol: 'btc-usd'
  }, {
    broker: 'cexio',
    symbol: 'eth-usd'
  }
]

const db = new Redis()

const publisher = new Publisher()

Observable
  .from(TARGETS)
  .flatMap(target => Source(db, target))
  .subscribe(row => {
    publisher.publish(row)
  })

