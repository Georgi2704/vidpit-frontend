<template>
  <div v-if="username !== ''" class="background">
    <h1 class="welcome" v-if="this.$store.getters.IsSearchUserSameAsCurrent">Your profile</h1>
    <h1 class="welcome" v-else>Welcome to the profile of  ...</h1>
    <hr class="bg-white">
    <div class="Upload">
      <b-button @click="$bvModal.show('bv-modal-videoupload')" v-if="this.$store.getters.IsSearchUserSameAsCurrent" class="btn-block mt-2 mb-4 uploadButton" variant="danger">Upload a Video</b-button>
    </div>
    <div class="flex-container">
      <div class="col-pic">
<!--        <img class="profilepic" src="https://placekitten.com/640/640" alt="profile_picture">-->
        <img class="profilepic" :src="getProfilePic" alt="profile_picture">
        <b-button @click="$bvModal.show('bv-modal-imageupload')" v-if="this.$store.getters.IsSearchUserSameAsCurrent" class="btn-block mt-3" variant="info">Change profile picture</b-button>
      </div>
      <div class="col-info">
        <h1><b>{{this.$store.getters.getSearchedUser.username}}</b></h1>
        <div class="mini-flex spacebetweenrows">
          <div>
            <h4 class="info-descrption user_since">User since</h4>
          </div>
          <div>
            <h4 class="info-value">{{this.$store.getters.getSearchedUser.registered_at}}</h4>
          </div>
        </div>
        <div class="mini-flex spacebetweenrows">
          <div>
            <h4 class="info-descrption followers">Followers</h4>
          </div>
          <div>
            <h4 class="info-value">{{followersCount}}</h4>
          </div>
        </div>
        <div class="mini-flex spacebetweenrows followingdiv" @click="$bvModal.show('bv-modal-following')">
          <div>
            <h4 class="info-descrption following">Following</h4>
          </div>
          <div>
            <h4 class="info-value">{{followingSize}}</h4>
          </div>
        </div>
        <div class="mini-flex spacebetweenrows">
          <div>
            <h4 class="info-descrption">Total views</h4>
          </div>
          <div>
            <h4 class="info-value">0</h4>
          </div>
        </div>
        <b-button @click="$bvModal.show('bv-modal-EditProfile')" v-if="this.$store.getters.IsSearchUserSameAsCurrent" class="btn-block mt-5" variant="info">Edit personal info</b-button>
      </div>
      <div class="col-stats">
        <div @click="goToStats()" class="button-stats">
          <img class="statspic" src="../assets/stats_2_white.png" alt="profile_picture">
          <h5 class="statstext">View channel statistics</h5>
        </div>
      </div>
      <div>
        <EditProfileForm @details-submitted="addDetails" ></EditProfileForm>
      </div>
    </div>

    <!--  Favourite Videos List  -->
    <div class="profile-videos-container">
      <div class="col-uploaded">
        <h2>Uploaded Videos</h2>
        <hr class="bg-white">
        <div class="video">
            <div class="column-thumbnail">
              <h5 class="video_title">Video title here</h5>
              <img class="video_thumbnail" src="https://picsum.photos/320/180" alt="video1">
            </div>
            <div class="column-video-info">
              <h5 class="video_info">3 days ago</h5>
              <h5 class="video_info">512K views</h5>
            </div>
        </div>
        <div class="video">
          <div class="column-thumbnail">
            <h5 class="video_title">Video title here</h5>
            <img class="video_thumbnail" src="https://picsum.photos/320/180" alt="video1">
          </div>
          <div class="column-video-info">
            <h5 class="video_info">3 days ago</h5>
            <h5 class="video_info">512K views</h5>
          </div>
        </div>
      </div>
      <div class="col-favourite">
        <h2>Favourite Videos</h2>
        <hr class="bg-white">
        <div class="video">
          <div>
            <h5 class="video_title">Video title here</h5>
            <img class="video_thumbnail" src="https://picsum.photos/320/180" alt="video1">
          </div>
        </div>
      </div>
    </div>



<!--  MODAL FOR UPLOADING IMAGE-->

    <b-modal id="bv-modal-imageupload" hide-footer>
      <template #modal-title>
       Upload your profile picture
      </template>

      <div class="d-block text-center">
        <div>
          <div v-if="currentFile" class="progress">
            <div
                class="progress-bar progress-bar-info progress-bar-striped"
                role="progressbar"
                :aria-valuenow="progress"
                aria-valuemin="0"
                aria-valuemax="100"
                :style="{ width: progress + '%' }"
            >
              {{ progress }}%
            </div>
          </div>

          <div class="alert alert-light" role="alert">{{ message }}</div>
        </div>

        <label class="upload-file mb-4" id="video-upload-id" for="upload-video-file">Choose file</label>
        <input class="mb-4" id="upload-video-file" type="file" ref="file" @change="selectFile"/>
        <label class="selected-file" for="input-videoTitle">{{ selectedFile }}</label>

        <button class="btn btn-success" style="display: block; margin: auto; padding: 10px 40px" :disabled="!selectedFiles" @click="upload">
          Upload
        </button>
      </div>

      <div class="d-flex flex-row mt-5">
        <b-button style="width: 100%"
                  @click="$bvModal.hide('bv-modal-imageupload'); changeToDelete(-1)">Cancel
        </b-button>
      </div>
    </b-modal>

    <!--  MODAL FOR Following-->
    <UploadVideoForm></UploadVideoForm>

    <b-modal id="bv-modal-following" hide-footer>
      <template #modal-title>
        Following
      </template>
      <div class="list-following-followers">
        <div v-for="(user,index) in following" :index="index" :key="user.id" class="list-following-item">
          <div v-if="followingSize > 0" class="d-inline-flex list-following-item" @click="goToProfilePage(user.id); refresh()">
            <b-avatar :src="getProfilePicFol(user.profilePic)" size="lg" class="ml-5"></b-avatar>
            <h2 class="ml-5">{{ user.username }}</h2>
          </div>
        </div>
        <div v-if="followingSize === 0" class="d-inline-flex list-following-item">
          <h4 class="ml-5">This user doesn't follow anybody.</h4>
        </div>
      </div>
    </b-modal>

  </div>
</template>


<script>
import axios from 'axios';
import EditProfileForm from "@/components/EditProfileForm";
import UploadVideoForm from "@/components/UploadVideoForm";
import http from "@/http-common";
axios.defaults.baseURL = 'http://localhost:8080';

window.onpopstate = function () {
  location.reload()
};

export default {
  name: "ProfilePage",
  props:
      {
        id: String
      },
  components: {
    EditProfileForm, UploadVideoForm
  },
  methods: {
    goToProfilePage(id){
      this.$router.push(`/profilepage/${id}`)
    },
    addDetails(userdetails) {
      this.$emit('udetails-submitted', userdetails)
    },

    selectFile() {
      this.selectedFiles = this.$refs.file.files;
    },
    upload() {
      this.progress = 0;

      this.currentFile = this.selectedFiles.item(0);
      this.uploadFile(this.currentFile, event => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
          .then(response => {
            console.log(response.data.message)
            this.message = response.data.message;
            //return UploadService.getFiles();
          })
          .then(files => {
            this.fileInfos = files;
            console.log(files);
            this.progress = 0;
            this.currentFile = undefined;
            this.$store.dispatch('getSearchedUser', this.$store.getters.getCurrentId);
          })
          .catch(error => {
            if (error.response.data.message === "Your file is too large.") {
              this.message = "Maximum file size is 10MB."
            } else {
              this.message = "Could not upload the file!";
            }
            this.progress = 0;
            this.currentFile = undefined;
          });

      this.selectedFiles = undefined;
    },
    uploadFile(file, onUploadProgress) {
      let formData = new FormData();

      formData.append("file", file);

      return http.post('file/upload/profilepic/user/' + this.$store.getters.getCurrentId, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress
      });
    },
    getFollowersCount(id){
      return http.get('follow/user/followers/' + id, {
        headers:{
          "Authorization": 'Bearer ' + this.$store.getters.getCurrentAccessToken,
        },
      }).then(response=>{
            this.followersCount = response.data;
      }
      ).catch(error=>{
        console.log("foll error:" + error);
      })
    }
    ,
    reloadProfile(){
      this.$store.dispatch('getSearchedUser', this.id)
          // eslint-disable-next-line no-unused-vars
          .then(response =>{
            this.username = this.$store.getters.getSearchedUser.username;
            this.dateRegistered = this.$store.getters.getSearchedUser.dateRegistered;
            this.getFollowersCount(this.$store.getters.getSearchedUser.id);
            this.loadFollowing();
          })
          .catch(error =>{
            console.log(error)
          })
    },
    refresh(){
      window.location.reload();
    },
    goToStats(){
      let id = this.$store.getters.getSearchedUser.id;
      this.$router.push('/stats/'+id);
    },
    loadFollowing(){
      return http.get('follow/user/following/' + this.$store.getters.getSearchedUser.id, {
        headers:{
          "Authorization": 'Bearer ' + this.$store.getters.getCurrentAccessToken,
        },
      }).then(response=>{
            this.following = response.data;
            console.log(response.data);
          }
      ).catch(error=>{
        console.log("foll error:" + error);
      })
    },
    getProfilePicFol(pp){
      let url = "http://localhost:8080/file/profilepic/"
      // let profilePic = this.$store.getters.getSearchedUser.profilePic;
      let combined = url + pp
      return combined;
    },
  },
  computed:{
    getProfilePic(){
      let url = "http://localhost:8080/file/profilepic/"
      let profilePic = this.$store.getters.getSearchedUser.profilePic;
      let combined = url + profilePic
      return combined;
    },
    selectedFile() {
      if (!this.selectedFiles) {
        return "No file chosen."
      }
      return this.selectedFiles.item(0).name;
    },
    followingSize(){
      return this.following.length;
    }
  },
  created() {
    console.log("created!");
    this.$store.dispatch('getSearchedUser', this.id)
        // eslint-disable-next-line no-unused-vars
        .then(response =>{
          this.username = this.$store.getters.getSearchedUser.username;
          this.dateRegistered = this.$store.getters.getSearchedUser.dateRegistered;
          this.getFollowersCount(this.$store.getters.getSearchedUser.id);
          this.loadFollowing();
        })
        .catch(error =>{
          console.log(error)
        })
  },
  data() {
    return {

      currentId: "",
      currentPassword: "",
      newPassword: "",
      newEmail: "",
      newUsername: "",
      username: '',
      dateRegistered: '',

      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
      fileInfos: [],

      followersCount: 0,
      following: [],

    }
  },
  mounted() {
    document.addEventListener("backbutton", this.reloadProfile, false);
  },
  beforeDestroy () {
    document.removeEventListener("backbutton", this.reloadProfile);
  }
}


</script>

<style scoped>
@import "../styles/profileStyle.css";
</style>