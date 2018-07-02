const Publisher = require('@stakan/publisher')

const Source = require('./lib/source-db')

const target = {
  broker: 'cexio',
  symbol: 'btc-usd'
}

const publisher = new Publisher()

Source(target)
  .subscribe(row => {
    publisher.publish(row)
  })

