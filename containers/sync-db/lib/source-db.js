const { Observable } = require('rxjs/Rx')

const {
  last,
  identity
} = require('ramda')

const OrderbookDB = require('@stakan/orderbook-db')

const db = new OrderbookDB()

function Source (target) {
  const { broker, symbol } = target

  const topic = `${broker}/${symbol}`

  const init = observer => {
    let rev = void 0

    const push = row => {
      rev = row.id
      Object.assign(row, { broker, symbol })
      observer.next(row)
    }

    const read = () => {
      const use = rows => {
        if (!rows) return void 0

        rows.forEach(push)
      }

      return db
        .obwatch(topic, rev)
        .then(use)
        .then(read)
    }

    read()
  }

  return new Observable(init)
}

module.exports = Source
