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

const compile = (name, numberOfKeys = 1) => redis => {
  const lua = read(name)

  redis.defineCommand(name, { lua, numberOfKeys })

  return redis
}

module.exports = compose(
  compile('obadd'),
  compile('obcommit'),
  compile('obdepth')
)
