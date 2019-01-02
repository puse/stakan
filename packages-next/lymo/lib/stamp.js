const { map } = require('rxjs/operators')

function main () {
  const session = Date.now()

  const stamp = (level, offset) => {
    const header = { session, offset }
    return { header, level }
  }

  return map(stamp)
}

module.exports = main
