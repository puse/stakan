import {
  map,
  compose,
  prop,
  zipObj
} from 'ramda'

/**
 *
 */

const props = {
  broker: {
    type: String,
    default: 'cexio'
  },
  symbol: {
    type: String,
    default: 'btc-usd'
  }
}

const data = () => {
  const brokerOptions = [
    'cexio'
  ]

  const symbolOptions = [
    'btc-usd',
    'eth-usd'
  ]

  return {
    brokerOptions,
    symbolOptions
  }
}

const methods = {
  changeBroker (broker) {
    const { symbol } = this
    this.navigate({ broker, symbol })
  },
  changeSymbol (symbol) {
    const { broker } = this
    this.navigate({ broker, symbol })
  },
  navigate (params) {
    console.log(params)
    const name = 'orderbook'
    this.$router.push({ name, params })
  }
}

export default {
  name: 'target-select',
  props,
  data,
  methods
}
