<template>
  <div>
    <b-navbar toggleable type="dark" variant="dark" class="fixed-top">
      <b-navbar-brand
          href="#" class="ml-xl-5 py-0 my-sm-0 mr-0 font-weight-bold" style="font-size: 30px">
        <router-link id="logo" to="/">vidPit</router-link>
      </b-navbar-brand>

      <b-nav-form>
        <b-form-input v-model="search" class="mr-xl-2 py-0 my-0" style="padding-right: 150px;" placeholder="Search"></b-form-input>
        <b-button @click="searchForUser();" variant="outline-primary" class="my-2 my-sm-0">Search</b-button>
      </b-nav-form>

      <div v-if="loggedIn" class="loggedIn">
        <div class="dropdownX">
          <b-avatar v-if="this.$store.state.received_messages.length > 0" @click="notifClick()" class="mr-3 notif" button :badge="getNotificationCount" variant="primary" icon="bell-fill" badge-variant="danger"></b-avatar>
          <b-avatar v-else @click="notifClick()" class="mr-3"  variant="primary" icon="bell-fill" button></b-avatar>
          <div v-show="notifClicked" class="dropdownX-content">
              <h4 class="px-5 mb-3">Notifications</h4>
              <div v-for="(item, index) in this.$store.state.received_messages" :index="index" :key="index">
                <h6 class="notif-line"><b>{{ item.sender }}</b> has just followed you !</h6>
              </div>
              <div v-if="this.$store.state.received_messages.length === 0">
                <h6> No new notifications.</h6>
              </div>
          </div>
        </div>


        <button @click="profilePageClick" class="dropbtn mr-xl-3"><b>{{getCurrentUser}}</b> - Your Profile</button>
        <router-link to="/admin">
          <button v-if="this.$store.getters.getCurrentRoles.includes('ROLE_MODERATOR')"  class="adminBtn mr-xl-3"> Admin Page</button>
        </router-link>
        <router-link to="/logout">
          <button class="logoutbtn mr-xl-3"> Log Out</button>
        </router-link>
      </div>
      <div v-if="!loggedIn" class="notLoggedIn">
        <div class="dropdown" style="float:right;">
          <button @click="loginClick()" id="loginButtonNavbar" class="dropbtn mr-xl-5">Log In</button>
          <div v-show="loginClicked" id="loginDropdownContent" class="dropdown-content">
            <b-form @submit.prevent="login">
              <b-form-group label="Username" label-for="dropdown-form-email" @submit.stop.prevent>
                <b-form-input
                    name="username"
                    id="dropdown-form-email"
                    size="sm"
                    placeholder="Username"
                    v-model="username"
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Password" label-for="dropdown-form-password">
                <b-form-input
                    name="password"
                    id="dropdown-form-password"
                    type="password"
                    size="sm"
                    placeholder="Password"
                    v-model="password"
                ></b-form-input>
              </b-form-group>

              <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
                Invalid username or password.
              </b-alert>
<!--              <b-form-checkbox class="mb-3">Remember me</b-form-checkbox>-->
              <b-button variant="primary" size="sm" type="submit">Sign In</b-button>
            </b-form>
            <hr class="solid">
            <button @click="$bvModal.show('bv-modal-example')" type="button" class="btn btn-info mb-2 w-100">
              New around here? - Sign up
            </button>
            <button type="button" class="btn btn-secondary w-100">Forgot Password?</button>
          </div>
        </div>
      </div>
    </b-navbar>
    <div>
      <SignUpForm @details-submitted="addDetails" ></SignUpForm>
    </div>
  </div>

</template>

<script>
import SignUpForm from "@/components/SignUpForm";
export default {
  data(){
    return{
      search: '',
      username: '',
      password: '',
      showDismissibleAlert: false,
      loginClicked: false,
      notifClicked: false
    }
  },
  components: {
    SignUpForm
  },
  methods: {
    addDetails(userdetails){
      this.$emit('udetails-submitted', userdetails)
    },
    login() {
      this.$store.dispatch('retrieveCurrentUser',
          {
            username: this.username,
            password: this.password
          })
          // eslint-disable-next-line no-unused-vars
          .then(response => {
            this.loginClick();
            this.$router.push('/profilepage/'+ this.$store.getters.getCurrentId)
            this.showDismissibleAlert = false;
          })
          // eslint-disable-next-line no-unused-vars
          .catch(error => {
            this.showDismissibleAlert = true;
          });
    },
    profilePageClick(){
      console.log(this.$store.getters.getCurrentId);
      let myID = this.$store.getters.getCurrentId;
      //if (this.$store.getters.getSearchedUser.id !== myID){
        this.$store.dispatch('getSearchedUser', myID)
      //}
      this.$router.push('/profilepage/'+ this.$store.getters.getCurrentId);
    },
    loginClick(){
      if (this.loginClicked === false){
        this.loginClicked = true
      }
      else{
        this.loginClicked = false;
      }
    },
    notifClick(){
      if (this.notifClicked === false){
        this.notifClicked = true
      }
      else{
        this.$store.state.received_messages = [];
        localStorage.removeItem('notifications');
        this.notifClicked = false;
      }
    },
    searchForUser(){
      console.log("search pressed");
      if (this.search === ""){
        return;
      }
      this.$store.dispatch('searchUser', this.search);
      this.$router.push(`/users/${this.search}`).catch();
    },
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    getCurrentUser(){
      return this.$store.getters.getCurrentUser;
    },
    getNotificationCount(){
      let lgt = ''
      return lgt + this.$store.state.received_messages.length
    },
  }
}
</script>

<style scoped>
@import "../styles/login_dropdown.css";
body { overflow: auto; }

.dropdownX {
  position: relative;
  display: inline-block;
}

.dropdownX-content {
  display: block;
  width: auto;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  padding: 10px 10px;
  z-index: 1;
  white-space: nowrap;
  overflow: hidden;
}
</style>