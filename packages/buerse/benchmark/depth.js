const { Suite } = require('benchmark')

const R = require('ramda')

const Depth = require('../lib/depth')

const bids = R.zip(R.range(100, 130), R.range(10, 20))
const asks = R.zip(R.range(150, 180), R.range(10, 20))

const bidsNext = R.zip(R.range(120, 150), R.range(20, 30))
const asksNext = R.zip(R.range(170, 200), R.range(20, 30))

const bucket = []

//

Suite('Depth#concat')
  .add('depth', () => {
    const depth = new Depth(bids, asks)
    const depthNext = new Depth(bidsNext, asksNext)

    depth.concat(depthNext)
  })
  .add('raw', () => {
    const x = new Map([...bids, bidsNext]) // eslint-disable-line
    const y = new Map([...asks, asksNext]) // eslint-disable-line

    bucket.push(x, y)
  })
  // add listeners
  .on('complete', onComplete)
  // run async
  .run({ 'async': true })

Suite('Depth#valueOf')
  .add('depth', () => {
    const depth = new Depth(bids, asks)
    depth.valueOf()
  })
  .add('raw', () => {
    const comparator = (a, b) => a[0] - b[0]
    const x = bids.sort(comparator)
    const y = asks.sort(comparator)

    bucket.push(x, y)
  })
  .on('complete', onComplete)
  .run({ 'async': true })

function onComplete () {
  const header = this.name
  const body = this.map(r => `  ${r}`).join('\n')

  console.log(R.join('\n', [header, body]))
}
