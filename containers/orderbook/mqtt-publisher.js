const debug = require('debug')('stakan:l2:mqtt')

const mqtt = require('mqtt')

const { Observable } = require('rxjs/Rx')

const getenv = require('getenv')

const Redis = require('@stakan/redis')

const Source = require('./lib/observable-db')
const Sink   = require('./lib/subscriber-mqtt')

/**
 * Settings
 */

/**
 * MQTT server url
 */

const MQTT_URL = getenv('MQTT_URL', 'mqtt://localhost:1883')

const REDIS_URL = getenv('REDIS_URL', 'redis://localhost:6379')

const TARGETS = [
  {
    broker: 'cexio',
    symbol: 'btc-usd'
  }, {
    broker: 'cexio',
    symbol: 'eth-usd'
  }
]

/**
 *
 */

const db = new Redis(REDIS_URL)

const client = mqtt.connect(MQTT_URL)

Observable
  .from(TARGETS)
  .flatMap(target => Source(db, target))
  .subscribe(Sink(client))
