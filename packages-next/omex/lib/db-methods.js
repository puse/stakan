const R = require('ramda')

/**
 * Settings
 */

const MAXLEN = 1000

/**
 * Getters
 */

const idFromHeader = R.compose(
  R.join('-'),
  R.props(['session', 'offset'])
)

const arrFromLevel = R.compose(
  R.flatten,
  R.toPairs,
  R.pick(['price', 'quantity'])
)

/**
 * add
 *
 * @param db
 * @param record
 * @returns {undefined}
 */


function addLevel (db, topic, record) {
  const key = `queue:${topic}`
  const id = idFromHeader(record)
  const props = arrFromLevel(record)

  const params = [
    key,
    'MAXLEN', '~', MAXLEN,
    id,
    ...props
  ]

  return db.xadd(...params)
}

// Expose curried

module.exports.addLevel = R.curry(addLevel)
