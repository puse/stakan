<template lang="pug">
el-table(
  border
  :data="dataset")

  el-table-column(label="Price")
    template(slot-scope="scope")
      | {{ scope.row[0] }}

  el-table-column(label="Quantity")
    template(slot-scope="scope")
      | {{ scope.row[1] }}

  el-table-column(label="Total")
    template(slot-scope="scope")
      | {{ scope.row[0] * scope.row[1] }}
</template>

<script>
const props = {
  dataset: Array
}

export default {
  name: 'orderbook-table',
  props
}
</script>
