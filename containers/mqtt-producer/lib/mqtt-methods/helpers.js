/**
 * Helpers
 */

const topicOf = ({ broker, symbol }) =>
  `${broker}/${symbol}`

const serialize = payload => {
  return JSON.stringify(payload)
}

/**
 * Expose
 */

module.exports = {
  topicOf,
  serialize
}
