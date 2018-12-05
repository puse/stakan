import {
  map,
  compose,
  prop,
  zipObj
} from 'ramda'

import {
  format
} from 'date-fns'

/**
 * Config
 */

const NEVER = 'never'

const FORMAT_REAL = '[at] HH:mm:ss.SSS'
const FORMAT_RELATIVE = 'ss [seconds] SSS [milliseconds] [ago]'

/**
 *
 */

const props = {
  prefix: {
    type: String,
    default: ''
  },
  displayRelative: {
    type: Boolean,
    default: false
  },
  value: {
    type: Date
  }
}

const computed = {
  displayValue () {
    const { displayRelative, value } = this

    if (!value) return NEVER

    if (displayRelative) {
      const delta = Date.now() - new Date(value)
      return format(delta, FORMAT_RELATIVE)
    } else {
      return format(value, FORMAT_REAL)
    }
  }
}

export default {
  name: 'el-time',
  props,
  computed
}
