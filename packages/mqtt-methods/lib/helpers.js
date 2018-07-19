/**
 * Settings
 */

const PREFIX = 'l2s'

/**
 * Helpers
 */

const topicOf = ({ broker, symbol }) =>
  `${PREFIX}/${broker}/${symbol}`

const serialize = payload =>
  JSON.stringify(payload)

/**
 * Expose
 */

module.exports = {
  topicOf,
  serialize
}
