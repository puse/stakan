const { Observable } = require('rxjs/Rx')

const {
  map,
  filter,
  bufferTime
} = require('rxjs/operators')

const { length } = require('ramda')

const { mergeUpdates } = require('./helpers')

/**
 *
 */

function buffer (timeout = 40) {
  return source =>
    source
      .pipe(
        bufferTime(timeout),
        filter(length),
        map(mergeUpdates)
      )
}

module.exports = buffer
