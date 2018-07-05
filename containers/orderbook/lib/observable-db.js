const { Observable } = require('rxjs/Rx')

const {
  is,
  merge
} = require('ramda')

const {
  obwatch
} = require('@stakan/orderbook-db-methods')

/**
 * Helpers
 */

const isArray = is(Array)

function Source (db, target) {
  const { broker, symbol } = target

  const topic = `${broker}/${symbol}`

  const complete = merge({ broker, symbol })

  const init = observer => {
    let rev = void 0

    const push = row => {
      rev = row.id
      observer.next(complete(row))
    }

    const report = err =>
      observer.error(err)

    const read = () => {
      const use = rows => {
        if (!isArray(rows)) return void 0

        rows.forEach(push)
      }

      return obwatch(db, topic, rev)
        .then(use)
        .then(read)
        .catch(report)
    }

    read()
  }

  return new Observable(init)
}

module.exports = Source
