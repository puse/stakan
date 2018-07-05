const { Observable } = require('rxjs/Rx')

const Axios = require('axios')

function PollHttp (opts, target) {
  const {
    baseURL = '/api',
    interval = 1000
  } = opts || {}

  const request = Axios.create({ baseURL })

  const poll = _ =>
    request(`/${target}`)
      .then(x => x.data)

  return Observable
    .interval(interval)
    .flatMap(poll)
}

module.exports = PollHttp
