const { readFileSync } = require('fs')

const { compose } = require('ramda')

/**
 * Lua scripts directory
 */

const PATH = `${__dirname}/scripts`

const read = name => {
  const filename = `${PATH}/${name}.lua`
  return readFileSync(filename, 'utf8')
}

function obimport (redis) {
  redis.defineCommand('obimport', {
    numberOfKeys: 1,
    lua: read('obimport')
  })

  return redis
}

module.exports = compose(obimport)
