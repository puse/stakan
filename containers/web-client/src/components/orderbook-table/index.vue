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

<script src="./main.js"> </script>
