const { Observable } = require('rxjs/Rx')

const {
  is,
  merge
} = require('ramda')

const { l2watch } = require('@stakan/db-methods')

/**
 * Helpers
 */

const isArray = is(Array)

const extendFrom = ({ broker, symbol }) =>
  merge({ scope: 'l2s', broker, symbol })


/**
 *
 */

function Source (db, target) {
  const { broker, symbol } = target

  const topic = `${broker}/${symbol}`

  const complete = extendFrom(target)

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

      return l2watch(db, topic, rev)
        .then(use)
        .then(read)
        .catch(report)
    }

    read()
  }

  return new Observable(init)
}

module.exports = Source
