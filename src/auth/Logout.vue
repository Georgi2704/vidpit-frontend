<template>
  <div>

  </div>
</template>

<script>
export default {
name: "Logout",
  data(){
    return{
      modalShow: true
    }
  },
  created() {
    this.$store.dispatch('destroyCurrentUser');
    this.$store.commit('changeLogoutStatus', true);
    this.$router.push('/');
  },
}
</script>

<style scoped>

</style>