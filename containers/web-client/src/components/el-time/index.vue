<template lang="pug">
div
  span.prefix {{ prefix }}

  el-tag(type="info")
    time(:datetime="value")
      | {{ displayValue }}
</template>

<script src="./main.js"> </script>

<style scoped>
.prefix {
  color: #666;
  padding-right: 10px;
  font-size: 14px;
}
</style>
