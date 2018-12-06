const loader = require('./loader')

/**
 * Lua scripts directory
 */

const PATH = `${__dirname}/scripts`

const read = loader(PATH)

/**
 *
 */

const l2add = {
  numberOfKeys: 1,
  lua: read('l2add')
}

const l2commit = {
  numberOfKeys: 1,
  lua: read('l2commit')
}

const l2depth = {
  numberOfKeys: 1,
  lua: read('l2depth')
}

module.exports = {
  l2add,
  l2commit,
  l2depth
}
