<template lang="pug">
el-table(
  border
  height="485"
  :data="members")

  el-table-column(
    label="Price"
    prop="price"
    :sortable="true")

  el-table-column(
    label="Quantity"
    prop="quantity")

</template>

<script>

import {
  map,
  compose,
  prop,
  zipObj,
  reverse,
  applySpec
} from 'ramda'

const computed = {
  members () {
    const zipped = zipObj(['price', 'quantity'])

    const op = compose(
      map(zipped),
      prop('dataset')
    )

    return op(this)
  }
}

const props = {
  dataset: Array
}

export default {
  name: 'orderbook-table',
  props,
  computed
}
</script>
