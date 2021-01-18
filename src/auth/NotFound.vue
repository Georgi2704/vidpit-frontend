<template>
  <div>
    <img class="unauthorizedImg" src="../assets/unlock_sad_nobg.png" alt="sad_padlock_image">
    <h2>Not found!</h2>
    <b-button class="gobackButton btn-lg px-5" @click="GoBack" variant="primary"> Go Back </b-button>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    GoBack(){
      this.$router.go(-2);
    }
  }
}
</script>

<style scoped>
h2{
  margin-top: 50px;
  margin-bottom: 50px;
  text-align: center;
  display: block;
}
.unauthorizedImg{
  margin-top: 75px;
  max-width: 12%;
  size: 0.5vw;
  margin-left: auto;
  margin-right: auto;
  display: block;
  height: auto;
}
.gobackButton{
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>