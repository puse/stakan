import Poll from '@stakan/orderbook-poll'

const CONFIG = {
  http: { baseURL: '/api' },
  mqtt: { url: 'ws://localhost:9001' }
}

function subscriptions () {
  const { topic } = this

  const snapshot$ = Poll(CONFIG, topic)
    .throttleTime(100)
    .retry(Infinity)

  return {
    snapshot$
  }
}

export default subscriptions
