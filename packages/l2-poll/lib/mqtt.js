const mqtt = require('mqtt')

const { Observable } = require('rxjs/Rx')

const MQTT_URL = 'mqtt://localhost:1883'

function PollMqtt (opts, topic) {
  const { url = MQTT_URL } = opts || {}

  const poll = subscriber => {
    const client = mqtt.connect(url)

    client.on('connect', _ => {
      client.subscribe(topic)
    })

    client.on('message', (topic, buf) => {
      const str = buf.toString()
      const obj = JSON.parse(str)

      subscriber.next(obj)
    })

    client.on('close', _ => {
      subscriber.complete()
    })

    return () => client.end()
  }

  return Observable.create(poll)
}

module.exports = PollMqtt
