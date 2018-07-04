const { Observable } = require('rxjs/Rx')

const Axios = require('axios')

function Poller (opts, target) {
  const {
    baseURL = '/api',
    interval = 1000
  } = opts || {}

  const request = Axios.create({ baseURL })

  const poll = _ =>
    request(`/orderbooks/${target}`)
      .then(x => x.data)

  return Observable
    .interval(interval)
    .flatMap(poll)
}

module.exports = Poller

// Poller({ baseURL: 'http://localhost:8080' }, 'cexio/btc-usd')
//   .first()
//   .subscribe(console.log)
