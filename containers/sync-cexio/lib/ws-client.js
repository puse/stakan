const { EventEmitter } = require('events')

const createPool = require('./ws-pool')

/**
 *
 */

// class Client extends EventEmitter {
//   constructor () {
//     super()
//   }
//
//   connect (url = WS_URL) {
//     const ws = new WebSocket(url)
//
//     const connected = (resolve, reject) => {
//       try {
//         ws.on('open', resolve)
//       } catch (err) {
//         reject(err)
//       }
//     }
//
//     this._ws = ws
//
//     return new Promise(connected)
//       .then(_ => this.delegate())
//   }
//
//   send (payload) {
//     const ws = this._ws
//
//     const msg = JSON.stringify(payload)
//
//     ws.send(msg)
//   }
//
//   pong () {
//     const ws = this._ws
//
//     const e = 'pong'
//
//     this.send({ e })
//   }
//
//   delegate () {
//     const ws = this._ws
//
//     ws.on('message', msg => {
//       const { e, data, oid } = JSON.parse(msg)
//
//       if (e === 'ping') {
//         this.emit('ping')
//         this.pong()
//       }
//
//       console.log(e)
//
//       this.emit(e, data)
//     })
//   }
//
//   authenticate (creds = CREDS) {
//     const ws = this._ws
//
//     const msg = createAuthMsgFrom(creds)
//
//     const auth = (resolve, reject) => {
//       ws.send(msg)
//
//       const handler = msg => {
//         const { e, ok } = JSON.parse(msg)
//
//         // skip irrelevent messages
//         if (e !== 'auth') return void 0
//
//         ws.removeListener('message', handler)
//
//         return ok === 'ok'
//           ? resolve()
//           : reject()
//       }
//
//       ws.on('message', handler)
//     }
//
//     return new Promise(auth)
//   }
//
//   subscribe (symbol, depth = 0) {
//     const pair = symbol
//       .toUpperCase()
//       .split('-')
//
//     const data = {
//       pair,
//       depth,
//       subscribe: true
//     }
//
//     this.send({
//       e: 'order-book-subscribe',
//       data
//     })
//   }
// }

async function run () {
  const pool = createPool()

  const ws1 = await pool.acquire()

  console.log('First ok')

  const ws2 = await pool.acquire()

  console.log('Second ok')

  await pool.release(ws1)

  await new Promise(r => setTimeout(r, 1e3))

  const ws3 = await pool.acquire()

  console.log('Third ok')
}

run()
