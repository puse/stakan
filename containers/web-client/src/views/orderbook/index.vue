<template lang="pug">
  div
    header.status-bar.clearfix
      el-row(
        :gutter="20")

      el-breadcrumb.float-left
        el-breadcrumb-item {{ broker }}
        el-breadcrumb-item {{ symbol }}

      el-time.float-right(
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

.status-bar {
  padding: 15px;
  border-bottom: 1px solid #ddd;
}
</style>
