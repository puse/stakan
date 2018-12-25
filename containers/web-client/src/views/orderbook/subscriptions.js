import Poll from '@stakan/l2-poll'

import { Subject } from 'rxjs/Rx'

const { origin, hostname } = location

const CONFIG = {
  http: { baseURL: `${origin}/api` },
  mqtt: { url: `ws://${hostname}:9001` }
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
