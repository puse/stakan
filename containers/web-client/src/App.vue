<template lang="pug">
  el-container
    el-header
      | &nbsp;
    el-main.wrapper
      router-view
</template>

<script>
export default {
  name: 'App'
}
</script>

<style src="./style.css"> </style>
