const debug = require('debug')('stakan:publisher')

const mqtt = require('mqtt')

const { ReplaySubject } = require('rxjs')

const getenv = require('getenv')

const { publish } = require('./actions')

/**
 * Config
 */

/**
 * MQTT server url
 */

const MQTT_URL = getenv('MQTT_URL', 'mqtt://localhost:1883')

/**
 * Publisher
 */

class Publisher {
  constructor (url = MQTT_URL, opts = {}) {
    const client = mqtt.connect(url)

    const replay = new ReplaySubject()

    client.on('connect', _ => {
      debug('Publisher connected')
      replay.subscribe(payload => publish(client, payload))
    })

    this.client = client
    this.replay = replay
  }

  publish (payload) {
    this.replay.next(payload)
  }
}

module.exports = Publisher
