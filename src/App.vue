<template>
  <div class="everything">
    <Navbar @udetails-submitted="addDetailsTest"></Navbar>
    <div class="container" style="margin-bottom: 500px">
      <router-view/>
    </div>
  </div>
</template>

<script>

import Navbar from "@/components/Navbar";
export default {
  name: 'App',
  // eslint-disable-next-line vue/no-unused-components
  components: {Navbar},
  data(){
    return{
      userdetailslist: [],
    }
  },
  methods:{
    addDetailsTest(userdetails){
      this.userdetailslist.push(userdetails);
    }
  }
}

</script>

<style>
/*.everything{*/
/*  background-color: #303030;*/
/*  color: white;*/
/*}*/
.container{
  padding-top: 60px;
}
.everything{
  position: relative;
}
.notification{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
</style>
