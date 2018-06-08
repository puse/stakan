import {
  Observable,
  ReplaySubject
} from 'rxjs/Rx'

import Axios from 'axios'

import mqtt from 'mqtt'

import {
  prop,
  merge,
  fromPairs,
  toPairs,
  filter
} from 'ramda'

const request = Axios.create({
  baseURL: '/api'
})

const client = mqtt.connect('ws://localhost:9001')

function streamState () {
  client.subscribe('orderbook/cexio/btc-usd')

  const selector = (_, message) => {
    return JSON.parse(message)
  }

  const resetP = request('/orderbooks/cexio/btc-usd')
  const reset$ = Observable
    .fromPromise(resetP)

  reset$
    .subscribe(console.log)

  const update$ = new ReplaySubject()

  Observable
    .fromEvent(client, 'message', selector)
    .subscribe(update$)

  const bids$ = update$
    .map(prop('bids'))
    .map(fromPairs)
    .scan(merge)
    .map(toPairs)
    .map(filter(x => x[1] > 0))

  return {
    bids: bids$
  }
}

export default streamState
