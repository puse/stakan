const Client = require('..')

const client = new Client()

client
  .obdepth('a')
  .then(console.log)
