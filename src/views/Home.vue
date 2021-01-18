<template>
  <div>
    <b-modal v-model="$store.getters.getHasLoggedOut" title="Message" hide-footer>
      <div class="d-block text-center">
        <h3 class="logoutMessage">Logout successful.</h3>
      </div>
      <b-button class="mt-3" variant="secondary" block @click="closeModal">Close Me</b-button>
    </b-modal>
    <div class="newest">
      <h2>Newest Videos</h2>
      <hr class="bg-white">
    </div>

    <div class="grid">
      <div @click="goToVideoPage(video.id); setCurrentVideo(video)" v-for="(video, index) in newestVideos" :index="index" :key="video.id" class="grid-element">
        <div class="grid-header">
          <h5>{{video.title}}</h5>
        </div>
        <div class="image-container">
          <img :src="getVideoPic(video.thumbnail)" alt="video">
<!--          <img src="../assets/no_thumbnail.jpg" alt="video">-->
        </div>
        <div class="grid-footer">
          <h5><span style="font-weight: lighter; color: #a4a4a4">Uploaded by</span> {{video.uploaded_by.username}}</h5>
          <h5>{{video.views}} <span style="font-weight: lighter; color: #a4a4a4">views</span> · <span style="font-weight: lighter">{{video.uploaded_at | moment("from", "now")}}</span></h5>
        </div>
      </div>
    </div>


  </div>
</template>

<script>


export default {
  name: 'Home',
  components:{},
  data(){
    return{
      userdetailslist: [],
      modalShow: true,
      newestVideos: [],
      lenghts: 10,
    }
  },
  created() {
    console.log("Created home page")
    this.$store.dispatch('getNewestVideos')
        // eslint-disable-next-line no-unused-vars
        .then(response => {
          this.newestVideos = this.$store.getters.getNewestVideos
        })
        .catch(error => {console.log("Error getting newest: " + error)})
  },
  computed:{

  },
  methods:{
    addDetailsTest(userdetails){
      this.userdetailslist.push(userdetails);
    },
    closeModal(){
      this.$store.commit('changeLogoutStatus', false);
    },
    getVideoPic(thumbnail){
      if (thumbnail===""){
        return "../assets/no_thumbnail.bmp"
      }
      let url = "http://localhost:8080/vid/thumbnail/";
      let combined = url + thumbnail;
      return combined;
    },
    goToVideoPage(videoID){
      this.$router.push('/vid/'+ videoID);
    },
    setCurrentVideo(video){
      this.$store.commit('setCurrentVideo', video);
    }

  }
}
</script>

<style scoped>
@import "../styles/homePageStyle.css";
.logoutMessage{
  margin: 50px 20px;
}


</style>