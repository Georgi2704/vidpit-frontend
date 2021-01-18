<template>
<div v-if="currentVideo">
  <h4 class="videoPageTitle">{{this.currentVideo.title}}</h4>
<!--  <div class="image-container"><img :src="getVideo(video)" alt="video"></div>-->
  <video id="video" width="720" controls="true" crossorigin="anonymous" autoplay>
    <source :src="getVideo(currentVideo.videoContent)"><!-- FireFox 3.5 -->
    Your browser does not support HTML5 video tag. Please download FireFox 3.5 or higher.
  </video>
  <h6 class="uploadedAt"><span style="font-weight: lighter">Uploaded on</span> {{this.currentVideo.uploaded_at | formatDate}}</h6>
    <div class="uploaderDetails">
      <b-avatar class="profilepicture ml-0 mt-0" rounded="sm"
                :src="getProfilePic(this.currentVideo.uploaded_by.profilePic)"
                alt="profilePicture" size="7rem">
      </b-avatar>
      <div>
        <h5 class="uploaderName">{{ this.currentVideo.uploaded_by.username }}</h5>

        <button @click="followOrUnfollow()" v-if="isFollowing" @mouseover="chngFlwText('Unfollow?')" @mouseleave="chngFlwText('Following')" class="button-following">{{ followText }}</button>
        <button @click="followOrUnfollow()" v-if="!isFollowing" class="button-follow">{{ followText }}</button>
      </div>
      <div class="views">
        <h3 class="views">1434322 <span style="font-weight: lighter">views</span></h3>
        <div>
          <b-form-rating v-model="value" readonly show-value precision="2"></b-form-rating>
        </div>
      </div>
    </div>
  <div class="video-rating">
    <h3 class="mt-3" style="width: 35%"><b>Rate this video: </b></h3>
    <b-form-rating v-model="submittedValue" variant="primary" class="mt-3" style="width: 35%"></b-form-rating>
    <b-button class="button-favourites" variant="danger"><i class="icon-fav fas fa-heart"></i> Favourite</b-button>
  </div>
</div>
</template>



<script>
import http from "@/http-common";
export default {
  name: "VideoPage",
  props: {
  id: String
  },
  data(){
    return{
      currentVideo: null,
      value: 3.555,
      submittedValue: 0,
      isFollowing: false,
      followText: 'default',
      followUser: '',
    }
  }
  ,
  methods:{
    chngFlwText(text){
      this.followText = text;
    },
    getVideo(videoName){
      let url = "http://localhost:8080/vid/videos/";
      let combined = url + videoName;
      return combined;
    },
    getProfilePic(picture){
      let url = "http://localhost:8080/file/profilepic/"
      return url + picture;
    },
    getVideoJSON(){
      return  http.get('vid/videos/video/' + this.id)
        .then(response=>{
          this.currentVideo = response.data;
          console.log(response.data)
          this.getFollowStatus();
        })
        .catch(error=>{
          console.log("foll error:" + error);
        })
    },
    getFollowStatus(){
      return http.get('http://localhost:8080/follow/user/status/' + this.currentVideo.uploaded_by.id,{
        headers: {
          Authorization: 'Bearer ' + this.$store.getters.getCurrentAccessToken
        }
      })  .then(response=>{
        console.log(response)
        if (response.data.message === "Following"){
          this.isFollowing = true;
          this.followText = 'Following'
        }
        else{
          this.followText = 'Follow'
          this.isFollowing = false;
        }
      })
          .catch(error=>{console.log(error)});
    },
    send() {
      console.log("Send message:" + this.currentVideo.uploaded_by.username);
      if (this.$store.state.stompClient && this.$store.state.stompClient.connected) {
        // const msg = { name: this.send_message };
        const msg = {
          sender: this.$store.getters.getCurrentUser,
          target: this.currentVideo.uploaded_by.username
        };
        console.log(JSON.stringify(msg));
        this.$store.state.stompClient.send("/app/hello", JSON.stringify(msg))
      }
    },
    followOrUnfollow(){
      return http.post('http://localhost:8080/follow/user/' + this.currentVideo.uploaded_by.id,null,{
        headers: {
          Authorization: 'Bearer ' + this.$store.getters.getCurrentAccessToken
        }
      }).then(response=>{
        this.getFollowStatus();
        if(!this.isFollowing){
          this.send();
        }
        console.log(response);
      }) .catch(error=>{
        console.log(error);
      })
    }
  },
  created() {
    //this.currentVideo = this.$store.getters.getCurrentVideo;
    this.getVideoJSON();
    window.scrollTo(0,0);
  },
  filters: {
    formatDate(date) {
      date = new Date(date);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hour = date   .getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      return `${day}-${month}-${year} ${hour}:${minutes}:${seconds}`;
    }
  }
}
</script>

<style scoped>
.profilepicture{
  border-radius: 10px;
  margin-left: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.uploaderDetails{
  display: flex;
  flex-wrap: nowrap;
  background-color: #ffffff;
  margin-bottom: 0px;
  width: 720px;
}
.uploaderName{
  margin-top: 10px;
  margin-left: 20px;
  font-weight: bold;
}
.uploadedAt{
  margin-top: 10px;
}

.videoPageTitle{
  margin-top: 20px;
}

.video-footer{
  display: flex;
  flex-wrap: nowrap;
  background-color: #ffffff;
  margin-bottom: 0px;
}
.views{
  margin-left: auto;
  text-align: right;
}

.video-rating{
  width: 720px;
  display: flex;
  flex-wrap: nowrap;
}
.button-favourites{
  margin-left: 30px;
  margin-right: auto;
  width: 35%;
}
.button-following{
  padding: 5px 20px;
  margin-left: 20px;
  margin-top: 10px;
  border-radius: 5px;
  background-color: #ffffff;
  border-color: #0275d8;
  border-style: solid;
  color: #0275d8;
}

.button-following:hover{
  transition: 0.2s;
  background-color: #d9534f;
  border-color: #d9534f;
  border-style: solid;
  color: white;
}

.button-follow{
  padding: 5px 20px;
  margin-left: 20px;
  margin-top: 10px;
  border-radius: 5px;
  background-color: #0275d8;
  border-color: #0275d8;
  border-style: solid;
  color: white;
}

.button-follow:hover{
  transition: 0.2s;
  background-color: #003a72;
  border-color: #003a72;
  border-style: solid;
  color: white;
}

</style>