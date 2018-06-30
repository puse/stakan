const { readFileSync } = require('fs')

const { compose, toUpper } = require('ramda')

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

  redis.defineCommand(toUpper(name), { lua, numberOfKeys })

  return redis
}

module.exports = compose(
  compile('obimport'),
  compile('obadd')
)
