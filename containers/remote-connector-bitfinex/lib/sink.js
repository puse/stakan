const seqGen = (session = Date.now()) => {
  let i = 1
  return () => `${session}-${i++}`
}

const errorHandler = err => {
  throw err
}

function Sink (db, topic) {
  const key = String(topic)
  const seq = seqGen()

  const next = (level) => {
    const id = seq()
    const pairs = level.toPairs()

    db.xadd(key, id, pairs)
      .catch(errorHandler)
  }

  return { next }
}

module.exports = Sink
