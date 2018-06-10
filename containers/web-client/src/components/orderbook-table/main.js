import {
  map,
  compose,
  prop,
  zipObj
} from 'ramda'

const computed = {
  members () {
    const zipped = zipObj(['price', 'quantity'])
    return map(zipped, this.dataset)
  }
}

const props = {
  dataset: {
    type: Array,
    default: []
  }
}

export default {
  name: 'orderbook-table',
  props,
  computed
}

