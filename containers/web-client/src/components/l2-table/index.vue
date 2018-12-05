<template lang="pug">
el-table(
  border
  height="485"
  :data="members")

  el-table-column(
    label="Price"
    prop="price")

  el-table-column(
    label="Amount"
    prop="amount")
</template>

<script src="./main.js"> </script>
