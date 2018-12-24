const { Suite } = require('benchmark')

const R = require('ramda')

const Batch = require('../lib/batch')
const { Bid, Ask } = require('../lib/level')

// Helpers

const createAssert = Type => (pr, qr) => {
  const entype = R.apply(Type)
  const create = R.compose(R.map(entype), R.zip)
  return create(R.range(...pr), R.range(...qr))
}

// Asserts

const xs = [
  ...createAssert(Bid)([100, 130], [10, 20]),
  ...createAssert(Ask)([150, 180], [10, 20])
]

const xsNext = [
  ...createAssert(Bid)([120, 150], [20, 30]),
  ...createAssert(Ask)([170, 200], [20, 30])
]

// Benchmarks

Suite('Batch#concat')
  .add('depth', () => {
    Batch(xs).concat(Batch(xsNext))
  })
  .add('ramda', () => {
    R.concat(xs, xsNext)
  })
  .on('complete', onComplete)
  .run({ 'async': true })

Suite('Batch#toArray')
  .add('batch', () => {
    const batch = Batch([xs, ...xsNext])
    batch.toArray()
  })
  .add('ramda', () => {
    // not exactly
    R.uniqBy(R.prop('price'), [...xs, ...xsNext])
  })
  .on('complete', onComplete)
  .run({ 'async': true })

// Reporter

function onComplete () {
  const header = this.name
  const body = this.map(r => `  ${r}`).join('\n')

  console.log(R.join('\n', [header, body]))
}
