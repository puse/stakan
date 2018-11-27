<template lang="pug">
el-breadcrumb

  el-breadcrumb-item
    span.small
      el-select(
        size="small"
        :value="broker"
        @change="changeBroker")

        el-option(v-for="broker in brokerOptions"
          :key="broker"
          :value="broker")

  el-breadcrumb-item
    span.small
      el-select(
        size="small"
        :value="symbol"
        @change="changeSymbol")

        el-option(v-for="symbol in symbolOptions"
          :key="symbol"
          :value="symbol")
</template>

<script src="./main.js"> </script>

<style scoped>
.small {
  display: inline-block;
  max-width: 120px;
}
</style>
