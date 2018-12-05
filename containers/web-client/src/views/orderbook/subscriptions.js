import Poll from '@stakan/l2-poll'

import { Subject } from 'rxjs/Rx'

const CONFIG = {
  http: { baseURL: '/api' },
  mqtt: { url: 'ws://localhost:9001' }
}

function subscriptions () {
  const { topic } = this

  const snapshot$ = new Subject()

  const updateTime$ = snapshot$
    .map(_ => new Date())

  Poll(CONFIG, topic)
    .throttleTime(100)
    .retry(Infinity)
    .subscribe(snapshot$)

  return {
    snapshot$,
    updateTime$
  }
}

export default subscriptions
