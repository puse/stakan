<template lang="pug">
  div
    el-time(
      prefix="Updated"
      :display-relative="true"
      :value="updateTime$")

    el-row(v-if="snapshot$"
      :gutter="20")

      el-col(:span="12")
        h3 Sell orders

        l2-table(side="bids"
          :members="orders.bids")

      el-col(:span="12")
        h3 Buy orders

        l2-table(side="asks"
          :members="orders.asks")
</template>

<script src="./main.js"></script>

<style scoped>
h3 {
  font-weight: normal;
  color: #666;
}
</style>
