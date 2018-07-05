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
  name: 'orderbook-table',
  props
}

