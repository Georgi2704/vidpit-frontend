<template>
  <b-modal id="bv-modal-videoupload" hide-footer hide-header-close>
    <template #modal-title>
      Upload your video
    </template>
    <div v-if="!successfulUpload && !successfulThumbnailUpload" class="step1">
      <div class="d-block text-center">
        <div>
          <h3><b>Step 1: </b><span
              style="font-weight: lighter"> Upload video file, <br>specify title and category</span></h3>
          <br>
          <div v-if="currentVideo" class="progress">
            <div
                class="progress-bar progress-bar-info progress-bar-striped"
                role="progressbar"
                :aria-valuenow="progressVideo"
                aria-valuemin="0"
                aria-valuemax="100"
                :style="{ width: progressVideo + '%' }"
            >
              {{ progressVideo }}%
            </div>
          </div>

          <div class="alert alert-light" role="alert">{{ messageVideo }}</div>
        </div>
      </div>

      <label style="display: block" for="video-upload-id"> Upload your video file.</label>
      <label class="upload-file mb-4" id="video-upload-id" for="upload-video-file">Choose file</label>
      <input class="mb-4" id="upload-video-file" type="file" ref="file" @change="selectVideo"/>
      <label class="selected-file" for="input-videoTitle">{{ selectedVideo }}</label>

      <label style="display: block" for="input-videoTitle"> Enter title for your video.</label>
      <b-input id="input-videoTitle"
               class="mb-4 mr-sm-2"
               placeholder="Enter Title"
               v-model="videoTitle"
      ></b-input>

      <label for="select-category">Select category for your video.</label>
      <div class=video-category id="select-category">
        <b-dropdown text="Select video category" class="mr-2" variant="primary">
          <div class="category-dropdown">
            <b-dropdown-item @click="selectedCategory = category.name"
                             v-for="(category, index) in categories" :index="index" :key="category.id">{{
                category.name
              }}
            </b-dropdown-item>
          </div>
        </b-dropdown>
        <b-input id="video-category-text"
                 class=""
                 placeholder="No category specified"
                 readonly
                 :value=this.selectedCategory
        ></b-input>
      </div>

      <label for="textarea" class="mt-4">Enter description for your video <span style="color: #707070">(optional)</span></label>
      <b-form-textarea
          id="textarea"
          v-model="videoDescription"
          placeholder="Enter something..."
          rows="3"
          max-rows="6"
      ></b-form-textarea>

      <button class="btn btn-success mt-2" style="width: 100%;" :disabled="continueToThumbnail" @click="uploadV">
        Upload and continue
      </button>

      <div class="d-flex flex-row mt-4">
        <b-button style="width: 100%"
                  @click="$bvModal.hide('bv-modal-videoupload')">Cancel
        </b-button>
      </div>
    </div>


    <!--      Get thumbnail     -->
    <div v-if="successfulUpload" class="step2">
      <div class="d-block text-center">
        <h3><b>Step 2: </b><span style="font-weight: lighter"> Choose thumbnail</span></h3>
        <br>
      </div>
      <div style="border: solid 1px #ccc; padding: 10px; text-align: center;">
        <video id="video" width="420" controls="true" crossorigin="anonymous">
          <source :src="getCurrentUploadedVideo(this.messageVideo)"><!-- FireFox 3.5 -->
          Your browser does not support HTML5 video tag. Please download FireFox 3.5 or higher.
        </video>
        <br/>
        <b-button variant="primary" class="py-2 px-4 mb-3" @click="shoot()">Capture</b-button>
        <br/>

        <h4>Chosen thumbnail:</h4>
        <div id="output"
             style="display: inline-block; top: 4px; position: relative ;border: dotted 1px #ccc; padding: 2px;"></div>
      </div>

      <b-button size="lg" variant="success" class="mt-1 btn-block" @click="changeSuccessfulUpload(false); uploadT();">
        Done
      </b-button>
    </div>
    <div v-if="successfulThumbnailUpload===true" class="step3">
      <h1 style="text-align: center">Your video is now uploaded to vidPit !</h1>
      <img class="vidPit-icon" src="../assets/blue-png-removebg-preview.png" alt="">
      <b-button size="lg" variant="secondary" class="mt-5 btn-block" @click="resetForm(); $bvModal.hide('bv-modal-videoupload')">
        Close
      </b-button>
    </div>
  </b-modal>
</template>

<script>
import http from "@/http-common";

export default {
  name: "UploadVideoForm",
  methods: {
    selectVideo() {
      this.selectedVideos = this.$refs.file.files;
    },
    uploadV() {
      this.progressVideo = 0;

      this.currentVideo = this.selectedVideos.item(0);
      this.uploadVideo(this.currentVideo, event => {
        this.progressVideo = Math.round((100 * event.loaded) / event.total);
      })
          .then(response => {
            console.log(response.data.message)
            this.messageVideo = response.data.message;
            //return UploadService.getFiles();
          })
          .then(files => {
            this.videoInfos = files;
            console.log(files);
            this.progressVideo = 0;
            this.currentVideo = undefined;
            this.successfulUpload = true;
          })
          .catch(error => {
            if (error.response.data.message === "Your file is too large.") {
              this.messageVideo = "Maximum file size is 10MB."
            } else {
              this.messageVideo = "Could not upload the file!";
            }
            this.progressVideo = 0;
            this.currentVideo = undefined;
          });

      this.selectedVideos = undefined;
    },
    uploadVideo(file, onUploadProgress) {

      let videoObject = {
        title: this.videoTitle,
        description: this.videoDescription,
        category: {
          name: this.selectedCategory
        }
      };

      let formData = new FormData();
      let details = JSON.stringify(videoObject);

      formData.append("file", file);
      formData.append("video", details)

      return http.post('vid/upload', formData, {
        headers: {
          "Authorization": 'Bearer ' + this.$store.getters.getCurrentAccessToken,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress
      });
    },
    getCurrentUploadedVideo(videoName) {
      let url = "http://localhost:8080/vid/videos/";
      let combined = url + videoName;
      return combined;
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    changeSuccessfulUpload(bool) {
      this.successfulUpload = bool;
    },
    ///Thumbnail methods////////////////////////////////////////////////////////////////////////////////////////////
    capture(video, scaleFactor) {
      if (scaleFactor == null) {
        scaleFactor = 0.5;
      }
      var w = video.videoWidth * scaleFactor;
      var h = video.videoHeight * scaleFactor;
      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, w, h);
      console.log("captur");
      return canvas;
    },

    shoot() {
      console.log("first");
      var video = document.getElementById(this.videoId);
      var output = document.getElementById('output');
      var canvas = this.capture(video, this.scaleFactor);

      let bg = new Image();
      bg.crossOrigin = "anonymous";
      bg = canvas.toDataURL("image/png");

      this.changeCurrentThumbnail(bg);

      this.snapshots.unshift(canvas);
      output.innerHTML = '';
      for (var i = 0; i < 1; i++) {
        output.appendChild(this.snapshots[i]);
      }
    },

    changeCurrentThumbnail(img) {
      const base64 = img
      fetch(base64)
          .then(res => res.blob())
          .then(blob => {
            const fd = new FormData();
            const file = new File([blob], "filename.jpeg");
            fd.append('image', file)
            this.currentThumb = file;
          })
      console.log("AfterT")
    },

    uploadT() {
      this.progress = 0;

      //this.currentThumbnail = this.currentThumb;
      this.uploadThumbnail(this.currentThumb, event => {
        this.progressThumbnail = Math.round((100 * event.loaded) / event.total);
      })
          .then(response => {
            console.log(response.data.message)
            this.message = response.data.message;
          })
          .then(files => {
            console.log(files);
            this.progressThumbnail = 0;
            this.successfulThumbnailUpload = true;
          })
          .catch(error => {
            if (error.response.data.message === "Your file is too large.") {
              this.message = "Maximum file size is 10MB."
            } else {
              this.message = "Could not upload the file!";
            }
            this.progressThumbnail = 0;
          });
    },
    uploadThumbnail(file, onUploadProgress) {
      let formData = new FormData();

      formData.append("file", file);
      formData.append("video", this.messageVideo)

      return http.post('vid/thumbnail', formData, {
        headers: {
          "Authorization": 'Bearer ' + this.$store.getters.getCurrentAccessToken,
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress
      })
    },
    resetForm(){
      this.progressThumbnail = 0;
      this.messageThumbnail= "";
      this.currentThumb= null;
      this.successfulThumbnailUpload= false
      this.successfulUpload= false
      this.selectedVideos= undefined;
      this.currentVideo= undefined;
      this.progressVideo= 0;
      this.messageVideo="";
      this.videoInfos= [];
      this.snapshots=[];
      this.selectedCategory= ""
      this.videoTitle= "";
      this.videoDescription= "";
    }
  },
  computed: {
    continueToThumbnail() {

      let boolContinue = false;

      if (this.selectedCategory === "") {
        boolContinue = true;
      }
      if (this.videoTitle === "") {
        boolContinue = true;
      }
      if (!this.selectedVideos) {
        boolContinue = true;
      }

      return boolContinue;
    },
    selectedVideo() {
      if (!this.selectedVideos) {
        return "No file chosen."
      }
      return this.selectedVideos.item(0).name;
    }
  },
  created() {
    http.get('/category/all')
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.log(error);
        })
  },
  data() {
    return {
      progressThumbnail: 0,
      messageThumbnail: "",
      currentThumb: null,

      successfulThumbnailUpload: false,
      successfulUpload: false,
      selectedVideos: undefined,
      currentVideo: undefined,
      progressVideo: 0,
      messageVideo: "",
      videoInfos: [],

      videoId: 'video',
      scaleFactor: 0.5,
      snapshots: [],

      selectedCategory: "",
      videoTitle: "",
      videoDescription: "",
      categories: [],
    }
  }
}
</script>

<style scoped>

</style>