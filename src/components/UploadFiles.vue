<template>
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

    <label class="btn btn-default">
      <input type="file" ref="file" @change="selectFile" />
    </label>

    <button class="btn btn-success" :disabled="!selectedFiles" @click="upload">
      Upload
    </button>

    <div class="alert alert-light" role="alert">{{ message }}</div>

    <div class="card">
      <div class="card-header">List of Files</div>
      <ul class="list-group list-group-flush">
        <li
            class="list-group-item"
            v-for="(file, index) in fileInfos"
            :key="index"
        >
          <a :href="file.url">{{ file.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
//import UploadService from "../services/UploadFilesService";
import http from "@/http-common";

export default {
  name: "upload-files",
  data() {
    return {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",

      fileInfos: []
    };
  },
  methods: {
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
          })
          .catch(error => {
            if (error.response.data.message === "Your file is too large."){
              this.message = "Maximum file size is 10MB."
            }
            else{
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
    }
  },
  mounted() {
    // UploadService.getFiles().then(response => {
    //   this.fileInfos = response.data;
    // });
  }
};
</script>