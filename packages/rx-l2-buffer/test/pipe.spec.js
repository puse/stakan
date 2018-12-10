import test from 'ava'

import { Observable } from 'rxjs/Rx'

import l2Buffer from '..'

const updates = require('./assets/updates')
const snapshot = require('./assets/snapshot')

test('observer', async t => {
  const { index } = t.context

  const update$ = Observable.from(updates)

  await update$
    .pipe(
      l2Buffer()
    )
    .toPromise()
    .then(res => t.deepEqual(res, snapshot))

  t.pass()
})
