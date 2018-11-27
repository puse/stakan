<template lang="pug">
div
  span.prefix {{ prefix }}

  time(:datetime="value")
    | {{ displayValue }}
</template>

<script src="./main.js"> </script>

<style scoped>
div {
  color: #666;
  font-size: 12px;
  font-family: monospace;
}

.prefix {
  padding-right: 10px;
}
</style>
