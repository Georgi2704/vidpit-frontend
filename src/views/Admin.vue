<template>
  <div>
    <h1>vidPit Users</h1>

    <div class="mb-5">
      <h5>Search by username:</h5>
      <b-form inline>
        <label class="sr-only" for="inline-form-input-name">Name</label>
        <b-input v-model="searchInput"
            id="inline-form-input-name"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Enter Username"
        ></b-input>
      </b-form>
    </div>

    <b-alert
        :show="dismissCountDown"
        dismissible
        fade
        variant="warning"
        @dismiss-count-down="countDownChanged"
    >
      <p v-if="lastAction==='delete'">User <b>{{ getLastDeleted }}</b> has been deleted successfully</p>
      <p v-if="lastAction==='update'">User <b>{{ getLastDeleted }}</b> has been edited successfully</p>
    </b-alert>


    <div class="flex-container blue">
      <div class="id">ID</div>
      <div>Username</div>
      <div>Email</div>
      <div>Registered At</div>
    </div>
    <div v-for="(user, index) in users" :index="index" :key="user.id">
      <div v-show="isMatch(getSearchInput, user.username)">
        <div class="flex-container" :class="[index%2===1 ? 'blue' : '']">
          <div class="id tablediv">{{ user.id }}</div>
          <div class="tablediv">{{ user.username }}</div>
          <div class="tablediv">{{ user.email }}</div>
          <div class="tablediv">{{ user.registered_at | formatDate }}</div>
          <b-button @click="[$bvModal.show('bv-modal-edit'), changeToEdit(user)]"
                    variant="warning editbutton">Edit
          </b-button>
          <b-button @click="[changeToDelete(user.id, user.username), $bvModal.show('bv-modal-delete')]"
                    variant="danger deletebutton">Delete
          </b-button>
        </div>
      </div>
    </div>

    <!-- DELETE USER MODAL   -->
    <b-modal id="bv-modal-delete" hide-footer>
      <template #modal-title>
        Warning
      </template>
      <div class="d-block text-center">
        <h3>Are you sure you want to delete <b>{{getLastDeleted}}</b> ? </h3>
      </div>
      <div class="d-flex flex-row mt-5">
        <b-button class="mr-1" style="width: 50%"
            @click="deleteUser(getToDelete); $bvModal.hide('bv-modal-delete'); lastActionDelete() ;showAlert()"
            variant="danger">Confirm Delete
        </b-button>
        <b-button style="width: 50%"
            @click="$bvModal.hide('bv-modal-delete'); changeToDelete(-1)">Cancel
        </b-button>
      </div>
    </b-modal>


    <!--  EDIT USER MODAL  -->
    <b-modal id="bv-modal-edit" hide-footer>
      <template #modal-title>
        Edit user
      </template>
      <div class="d-block text-center">
        <h3>Set new username and email</h3>
      </div>
      <label class="mt-3" for="input-newUsername"> Old username: <b>{{getToEditObject.username}}</b></label>
      <b-input v-model="newUsername"
               id="input-newUsername"
               class="mb-4 mr-sm-2"
               placeholder="Enter New Username"
      ></b-input>
      <label for="input-newEmail"> Old email: <b>{{getToEditObject.email}}</b></label>
      <b-input v-model="newEmail"
               id="input-newEmail"
               class="mr-sm-2"
               placeholder="Enter New Email"
      ></b-input>
      <div class="d-flex flex-row mt-5">
        <b-button class="mr-1" style="width: 50%"
                  @click="updateUser(); $bvModal.hide('bv-modal-edit'); lastActionUpdate();showAlert()"
                  variant="warning">Confirm Edit
        </b-button>
        <b-button style="width: 50%"
                  @click="$bvModal.hide('bv-modal-edit'); clearForm()">Cancel
        </b-button>
      </div>
    </b-modal>
<!--    End-->
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8080';

export default {
  data() {
    return {
      users: [],
      toDelete: -1,
      toEditObject: Object,
      lastDeletedUser: "",
      searchInput: "",
      newUsername: "",
      newEmail: "",
      lastAction: "",

      dismissSecs: 4,
      dismissCountDown: 0,
      showDismissibleAlert: false
    }
  },
  created() {
    axios.get('/users', {
      headers: {
        Authorization: 'Bearer ' + this.$store.getters.getCurrentAccessToken
      }
    })
        .then(response => {
          this.users = response.data
          //console.log(response.data)
        });
    //console.log(this.users);
  },
  methods: {
    deleteUser(id){
      axios.delete(`/user/${id}`, {
        headers: {
          Authorization: 'Bearer ' + this.$store.getters.getCurrentAccessToken
        }})
          .then(() => {
            this.users = this.users.filter(u => u.id !== id);
          })
          .catch(err => console.error(err));
      this.toDelete = -1;
    },
    changeToDelete(id, username){
      this.toDelete = id;
      this.lastDeletedUser = username;
      console.log(this.toDelete);
    },
    changeToEdit(user){
      this.toEditObject = user;
      this.lastDeletedUser = user.username;
    },
    updateUser(){
        for (let i = 0; i < this.users.length; i++){
          if (this.toEditObject.id === this.users[i].id){
            let editedUser = this.users[i];
            if (this.newUsername !== ""){
              editedUser.username = this.newUsername;
            }
            if (this.newEmail !== ""){
              editedUser.email = this.newEmail;
            }
            this.users[i] = editedUser;
              //console.log(editedUser);
            axios.put(`/user/${editedUser.id}`, editedUser, {
              headers: {
                Authorization: 'Bearer ' + this.$store.getters.getCurrentAccessToken
              }});
            this.clearForm();
            return;
          }
        }
        console.log("false");
    },
    clearForm(){
      this.newEmail = "";
      this.newUsername = "";
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    isMatch(searchInput, username){
      if(username.includes(this.searchInput)){
        return true;
      }
      return false;
    },
    lastActionDelete(){
      this.lastAction = "delete";
    },
    lastActionUpdate(){
      this.lastAction = "update";
    }
  },
  computed: {
    getToDelete(){
      return this.toDelete;
    },
    getLastDeleted(){
      return this.lastDeletedUser;
    },
    getSearchInput(){
      return this.searchInput;
    },
    getToEditObject(){
      return this.toEditObject;
    },
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

.blue {
  background-color: #f1f1f1;
}

.flex-container > div {
  /*background-color: #f1f1f1;*/
  width: 25%;
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
  font-weight: normal;
}

</style>