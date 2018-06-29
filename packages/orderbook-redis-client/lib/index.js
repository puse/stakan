const { readFileSync } = require('fs')

const Redis = require('ioredis')

/**
 *
 */

const SCRIPTS_DIR = `${__dirname}/scripts`

const COMMANDS = [
  'oblog',
  'obimport',
  'obdepth',
  'obtop'
]

/**
 * Utils
 */

const completeCommand = name => {
  const filename = `${SCRIPTS_DIR}/${name}.lua`
  const lua = readFileSync(filename, 'utf8')

  return {
    name,
    lua,
    numberOfKeys: 1
  }
}

/**
 *
 */

function Client (opts) {
  const client = new Redis(opts)

  const install = body =>
    client
      .defineCommand(body.name, body)

  COMMANDS
    .map(completeCommand)
    .forEach(install)

  return client
}

module.exports = Client
