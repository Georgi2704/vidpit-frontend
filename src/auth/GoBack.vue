<template>
<div>

</div>
</template>

<script>
export default {
  name: "GoBack",
  created() {
    this.$router.go(-2);
  }
}
</script>

<style scoped>

</style>