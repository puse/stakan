import {
  map,
  compose,
  prop,
  zipObj
} from 'ramda'

const props = {
  members: {
    type: Array,
    default: []
  }
}

export default {
  name: 'l2-table',
  props
}

