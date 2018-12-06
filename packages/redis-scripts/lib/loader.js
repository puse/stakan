const {
  readFileSync
} = require('fs')

const {
  join,
  dirname,
  extname
} = require('path')

const {
  curry
} = require('ramda')

const read = filepath => readFileSync(filepath, 'utf8')

const re = /require [\"\']{1}(.+)[\"\']{1}/g;

function load (cwd, filename) {
  let filepath = join(cwd, filename)

  if (!extname(filepath))
    filepath += '.lua'

  const loadNested = target => {
    const cwd = dirname(filepath)
    const src = load(cwd, target)
    return `(function () ${src} end)()`
  }

  return readFileSync(filepath, 'utf8')
    .replace(re, (_, target) => loadNested(target))
}

module.exports = curry(load)
