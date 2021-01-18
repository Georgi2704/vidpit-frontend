<template>
  <div>
    <div class="mb-5">
      <h1 class="results"><b>{{this.$store.getters.getFoundUsersCount}}</b> users matching your criteria. </h1>
      <hr>
      <h5>Filter by:</h5>
      <b-form inline>
        <label class="sr-only" for="inline-form-input-name">Name</label>
        <b-input v-model="searchInput"
                 id="inline-form-input-name"
                 class="mb-2 mr-sm-2 mb-sm-0"
                 placeholder="Enter Username"
        ></b-input>
      </b-form>
    </div>
    <div class="columnNames_all">
      <div class="blue">
        <div class="columnNames_0"></div>
        <div class="columnNames_1">Username</div>
        <div class="columnNames_2">Registered At</div>
      </div>
    </div>
    <div v-for="(user, index) in this.$store.getters.getFoundUsers" :index="index" :key="user.id">
      <div v-show="isMatch(getSearchInput, user.username)">
        <div @click="goToUserPage(user.id)" class="flex-container" :class="[index%2===1 ? 'blue' : '']">
          <b-avatar class="profilepicture" :src="getCurrentPic(user.profilePic)" alt="profilePicture" size="7rem"></b-avatar>
<!--          <div class="id tablediv">{{ user.id }}</div>-->
          <div class="tablediv"><b>{{ user.username }}</b></div>
<!--          <div class="tablediv">{{ user.email }}</div>-->
          <div class="tablediv">{{ user.registered_at | formatDate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8080';

export default {
  name: "SearchPage",
  props:
      {
        username: String
      },
  data(){
    return{
      users: [],
      searchInput: "",
    }
  },
  methods: {
    isMatch(searchInput, username){
      if(username.includes(this.searchInput)){
        return true;
      }
      return false;
    },
    goToUserPage(id){
      this.$router.push(`/profilepage/${id}`)
    },
    getCurrentPic(profile_pic){
      console.log(profile_pic);
      let url = "http://localhost:8080/file/profilepic/"
      let combined = url + profile_pic
      return combined;
    }
  },
  created() {
    // axios.get('/auth/users',{ params: { username: this.username } }
    // )
    //     .then(response => {
    //       this.users = response.data
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    // ;
    // console.log(this.users);
  },
  computed: {
    getSearchInput() {
      return this.searchInput;
    }
  },
  filters: {
    formatDate(date) {
      date = new Date(date);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      return `${day}-${month}-${year} ${hour}:${minutes}:${seconds}`;
    }
  }
}
</script>

<style scoped>
.emptyDiv{
  padding: 1px;
}

.columnNames_all{
  font-size: 140%;
  font-weight: lighter;
}
.columnNames_0{
  width: 20%;
}
.columnNames_1{
  padding-left: 100px;
  width: 40%;
}
.columnNames_2{
  padding-left: 65px;
  width: 45%;
}

.profilepicture{
  border-radius: 10px;
  margin-left: 50px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.results{
  text-align: left;
}

h1 {
  text-align: center;
  padding: 20px;
}

.flex-container {
  display: flex;
  flex-wrap: nowrap;
  background-color: #ffffff;
  margin-bottom: 0px;
}

.flex-container:hover{
  background: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25));
}

.blue {
  background-color: #f1f1f1;
  display: flex;
}

.flex-container > div {
  /*background-color: #f1f1f1;*/
  width: 35%;
  margin: 1px;
  text-align: center;
  font-weight: bold;
  line-height: 50px;
  font-size: 15px;
}

.flex-container .id {
  width: 10%;
}

.flex-container .editbutton {
  width: 7%;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 5px;
}

.flex-container .deletebutton {
  width: 7%;
  margin-top: 5px;
  margin-bottom: 5px;
}

.flex-container .tablediv {
  /*background-color: blue;*/
  margin-top: 12px;
  font-size: 30px;
  font-weight: normal;
  cursor: pointer;
}

.flex-container .tablediv {
  /*background-color: blue;*/
  margin-top: 12px;
  font-size: 30px;
  font-weight: normal;
  cursor: pointer;
}
</style>