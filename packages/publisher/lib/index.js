const debug = require('debug')('stakan:mqtt:publisher')

const mqtt = require('mqtt')

const { ReplaySubject } = require('rxjs/Rx')

const getenv = require('getenv')

const { publish } = require('./actions')

/**
 * Config
 */

const REPLAY_BUFFER_SIZE = 1000
const REPLAY_WINDOW_TIME = 1000

/**
 * MQTT server url
 */

const MQTT_URL = getenv('MQTT_URL', 'mqtt://localhost:1883')

/**
 * Helpers
 */

function createReplay () {
  const bufferSize = REPLAY_BUFFER_SIZE
  const windowTime = REPLAY_WINDOW_TIME

  return new ReplaySubject(bufferSize, windowTime)
}

/**
 * Publisher
 */

class Publisher {
  constructor (url = MQTT_URL, opts = {}) {
    debug('Connecting to %s', url)

    this.client = mqtt.connect(url)
    this.replay = createReplay()

    this._setup()
  }

  _setup () {
    const { client, replay } = this

    client.on('error', err => {
      debug('Error: %s', err.message)
    })

    client.on('connect', _ => {
      debug('Connected')

      //
      replay.subscribe(publish(client))
    })

    client.on('close', _ => {
      debug('Connection closed')
    })

    replay
      .bufferTime(1000)
      .subscribe(
        arr => debug('Published %d messages', arr.length)
      )

    return this
  }

  publish (payload) {
    this.replay.next(payload)
  }
}

module.exports = Publisher
