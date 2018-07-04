const { Observable } = require('rxjs/Rx')

const {
  last,
  identity
} = require('ramda')

const Redis = require('@stakan/redis')

const { obwatch } = require('@stakan/orderbook-db-methods')

const db = new Redis()

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
        if (!Array.isArray(rows)) return void 0

        rows.forEach(push)
      }

      return obwatch(db, topic, rev)
        .then(use)
        .then(read)
        .catch(read)
    }

    read()
  }

  return new Observable(init)
}

module.exports = Source
