import test from 'ava'

import { Observable } from 'rxjs/Rx'

import { map, tap, retryWhen, delayWhen } from 'rxjs/operators'

test.cb('restart', t => {
  const tick = new Observable(observer => {
    let i = 0

    const emit = _ => {
      console.log('Emitted:', i)
      observer.next(i++)
    }

    const t = setInterval(emit, 1000)

    return () => clearInterval(t)
  })


  const reTick = tick
    .map(i => {
      if (i > 3) throw 'overflow'
      return i
    })
    .retryWhen(errors => {
      return errors
        .map(console.log)
    })

  const report = err => {
    console.log('Error: ', err)
    t.end()
  }

  reTick
    .subscribe(console.log, report, _ => t.end())
})
