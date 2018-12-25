const getenv = require('getenv')

const { Observable } = require('rxjs/Rx')

const Redis = require('@stakan/redis')

const {
  l2add,
  l2commit
} = require('@stakan/db-methods')

const Source = require('./lib')

/**
 * Settings
 */

const SYMBOL = getenv('SYMBOL')

/**
 * Init
 */

const db = new Redis()

const consume = patch => {
  const { session, rows } = patch

  const add = _ => {
    return l2add(db, patch, session, rows)
  }

  const commit = _ => {
    return l2commit(db, patch)
  }

  return add().then(commit)
}
/**
 *
 */

Source(SYMBOL)
  .retry(Infinity)
  .subscribe(consume)
