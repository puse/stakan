const { map } = require('rxjs/operators')

const C = require('./conversions')

const recoverLevels = () => map(C.recoverLevel)

const stampCorrelation = (session = Date.now()) => {
  const stamp = (level, offset) => {
    const correlation = { session, offset }
    return { level, correlation }
  }

  return map(stamp)
}

const toBuffer = () => {
  return map(JSON.stringify)
}

module.exports = {
  recoverLevels,
  stampCorrelation,
  toBuffer
}
