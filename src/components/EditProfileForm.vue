<template>
  <b-modal id="bv-modal-EditProfile" hide-footer hide-header-close>
    <template #modal-title>
      Edit Your Details
    </template>
    <div v-if="editProfileSuccessful===true">
      <img class="greencheck" src="../assets/green-checkmark.png">
      <h2 class="sucHeader">Your details have been edited successfully!</h2>
    </div>
    <div v-if="editProfileSuccessful===false">
      <h5 class="mb-4"><b style="color: orange">Warning - </b> <span style="color:#ffc55b">changing your details will log you out.</span></h5>
      <form @submit.prevent="onSubmit">
        <div class="form-group mb-5">
          <label for="currentPassword">Enter current to password to make any changes</label>
          <input type="password" @input="removeConfirmPassErrorMessage"
                 v-bind:class="['form-control',{'is-invalid': errorObject.currentPasswordHasError}]"
                 id="currentPassword" placeholder="Enter current password" v-model="currentPassword">
          <div v-if="errorObject.currentPasswordHasError" class="invalid-feedback">
            You have entered a wrong password
          </div>
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Old email address: <b>{{this.$store.getters.getCurrentEmail}}</b></label>
          <input @change="checkEmail" @input="removeEmailErrorMessage" type="text"
                 v-bind:class="['form-control',{'is-invalid': errorObject.emailIsEmpty},
                 {'is-invalid': errorObject.emailIsIncorrect}, {'is-invalid': removeAlreadyExistingEmailError}]"
                 id="exampleInputEmail1" aria-describedby="emailHelp"
                 placeholder="Enter new email" name="email" v-model="newEmail">
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
          <div v-if="errorObject.emailIsEmpty" class="invalid-feedback">
            Email can't be empty
          </div>
          <div v-if="errorObject.emailIsIncorrect" class="invalid-feedback">
            Email address should be in valid format. ex."emailname@website.com"
          </div>
          <div v-if="this.removeAlreadyExistingEmailError" class="invalid-feedback">
            A user with this email address is already registered.
          </div>
        </div>
        <div class="form-group">
          <label for="exampleUsername1">Old username: <b>{{this.$store.getters.getCurrentUser}}</b></label>
          <input @input="checkUsername" type="text"
                 v-bind:class="['form-control',{'is-invalid': errorObject.usernameIsEmpty},
                 {'is-invalid': errorObject.usernameHasChars}, {'is-invalid': this.removeAlreadyExistingUserError}]"
                 id="exampleUsername1" placeholder="Enter new username" v-model="newUsername">
          <div v-if="errorObject.usernameIsEmpty" class="invalid-feedback">
            Username can't be empty.
          </div>
          <div v-if="errorObject.usernameHasChars" class="invalid-feedback">
            Username should contain only letters and numbers.
          </div>
          <div v-if="this.removeAlreadyExistingUserError" class="invalid-feedback">
            A user with this username is already registered.
          </div>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input @change="checkPassword" @input="removePassErrorMessage" type="password"
                 v-bind:class="['form-control',{'is-invalid': errorObject.passwordHasError}]"
                 id="exampleInputPassword1" placeholder="Enter new password" v-model="newPassword">
          <div v-if="errorObject.passwordHasError" class="invalid-feedback">
            Password should contain at least 8 characters.
          </div>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword2">Confirm Password</label>
          <input type="password" @input="removeConfirmPassErrorMessage"
                 v-bind:class="['form-control',{'is-invalid': errorObject.confpasswordHasError}]"
                 id="exampleInputPassword2" placeholder="Confirm new Password" v-model="confirmpass">
          <div v-if="errorObject.confpasswordHasError" class="invalid-feedback">
            Please enter matching passwords.
          </div>
        </div>
        <button
            type="submit" @click="setSignUpPressed()" class="btn btn-primary btn-lg align">Confirm changes
        </button>
      </form>
    </div>
    <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-EditProfile'); resetForm()">Close Me</b-button>
  </b-modal>
</template>

<script>
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

export default {
  name: "EditProfileForm",
  data() {
    return {
      usernameOfExistingUser: "",
      emailOfExistingUser: "",
      newEmail: "",
      newUsername: "",
      currentPassword: "",
      newPassword: "",
      confirmpass: "",
      passwordtried: false,
      emailtried: false,
      signUpPressed: false,
      modalShow: false,
      editProfileSuccessful: false,

      errorObject: {
        emailAlreadyExists: false,
        usernameAlreadyExists: false,
        usernameHasChars: false,
        usernameIsEmpty: false,
        emailIsEmpty: false,
        emailIsIncorrect: false,
        passwordHasError: false,
        confpasswordHasError: false,
        currentPasswordHasError: false
      }
    }
  },
  computed:{
    removeAlreadyExistingUserError(){
      if (this.newUsername === "" && this.signUpPressed === true){
        return false;
      }
      else if (this.newUsername === this.usernameOfExistingUser && this.signUpPressed === true) {
        return true;
      }
      return false;
    },
    removeAlreadyExistingEmailError(){
      if (this.newEmail === "" && this.signUpPressed === true){
        return false;
      }
      else if (this.newEmail === this.emailOfExistingUser && this.signUpPressed === true) {
        return true;
      }
      return false;
    },
  },
  methods: {
    resetForm() {
      this.usernameOfExistingUser = '';
      this.emailOfExistingUser = '';
      this.newUsername = '';
      this.newEmail = '';
      this.newPassword = '';
      this.editProfileSuccessful = false;
      this.passwordtried = false;
      this.emailtried = false;
      this.confirmpass = '';
      this.signUpPressed = false;
      Object.keys(this.errorObject).forEach(key => {
        (key, this.errorObject[key] = false)
      });
    },
    removeEmailErrorMessage() {
      if (this.emailtried === true) {
        this.checkEmail();
      }
    },
    checkEmail() {
      this.errorObject.emailIsIncorrect = false;
      this.errorObject.emailIsEmpty = false;
      let reGex = new RegExp("^([A-Z|a-z|0-9](\\.|_){0,1})+[A-Z|a-z|0-9]\\@([A-Z|a-z|0-9])+((\\.){0,1}[A-Z|a-z|0-9]){2}\\.[a-z]{2,3}$");
      if (this.newEmail === null || this.newEmail === '') {
        this.errorObject.emailIsEmpty = false;
      } else if (reGex.test(this.newEmail) === false) {
        this.errorObject.emailIsIncorrect = true;
        this.emailtried = true;
      }

    },
    checkUsername() {
      this.errorObject.usernameHasChars = false;
      this.errorObject.usernameIsEmpty = false;
      let reGex = new RegExp("^(([a-z]||[A-Z])||[0-9])*([a-z]||[0-9])$");
      if (this.newUsername === null || this.newUsername === '') {
        this.errorObject.usernameIsEmpty = false;
      } else if (reGex.test(this.newUsername) === false) {
        this.errorObject.usernameHasChars = true;
      }
    },
    removePassErrorMessage() {
      if (this.passwordtried === true && this.newPassword.length >= 8) {
        this.errorObject.passwordHasError = false;
      } else if (this.passwordtried === true && this.newPassword.length < 8) {
        this.errorObject.passwordHasError = true;
      }
    },
    removeConfirmPassErrorMessage() {
      if (this.signUpPressed === true) {
        this.checkConfirmPassword();
      }
    },
    checkPassword() {
      this.errorObject.passwordHasError = false;
      let reGex = new RegExp(".{8,}");
      if (this.newPassword === null || this.newPassword === ''){
        this.errorObject.passwordHasError = false;
      }
      else if (reGex.test(this.newPassword) === false) {
        this.errorObject.passwordHasError = true;
        this.passwordtried = true;
      }
    },
    checkConfirmPassword() {
      this.errorObject.confpasswordHasError = false;
      if (this.confirmpass !== this.newPassword) {
        this.errorObject.confpasswordHasError = true;
      }
    },
    clearAlreadyExistsErrors(){
      this.errorObject.usernameAlreadyExists = false;
      this.errorObject.emailAlreadyExists = false;
      this.errorObject.currentPasswordHasError = false;
    },
    checkAlreadyExists(userdetails) {
      console.log("cleared");
      console.log(userdetails);
      return new Promise((resolve, reject) => {
        axios.put(`/user/test/${this.$store.getters.getCurrentId}`, {
          currentPassword: userdetails.currentPassword,
          newPassword: userdetails.newPassword,
          newEmail: userdetails.newEmail,
          newUsername: userdetails.newUsername,
        }, {
          headers: {
            Authorization: 'Bearer ' + this.$store.getters.getCurrentAccessToken
          }})
            .then(response => {
              console.log("vliza v .then");
              //  console.log(response.body);
              resolve(response)
            })
            .catch(error => {
              console.log("vliza v catch");
              console.log(error.response.data.emailAlreadyExists);
              console.log(error.response.data.userAlreadyExists);
              console.log("body: " + error.response.data.message);
              if(error.response.data.emailAlreadyExists === true){
                this.errorObject.emailAlreadyExists = true;
                this.emailOfExistingUser = this.newEmail;
              }
              if(error.response.data.userAlreadyExists === true){
                this.errorObject.usernameAlreadyExists = true;
                this.usernameOfExistingUser = this.newUsername;
              }
              if (error.response.data.message === "You have entered wrong current password!"){
                this.errorObject.currentPasswordHasError = true;
              }
              console.log(this.errorObject);
              reject(error)
            });
      })
    },
    setSignUpPressed() {
      this.signUpPressed = true;
    }
    ,
    onSubmit() {
      //this.signUpPressed = true;
      this.checkUsername();
      this.checkPassword();
      this.checkConfirmPassword();
      this.checkEmail();
      this.clearAlreadyExistsErrors();
      let values = Object.values(this.errorObject)
      if (values.includes(true)) {
        //debugging
        console.log("There are errors in error object")
        return;
      }

      let userdetails = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        newEmail: this.newEmail,
        newUsername: this.newUsername,
      }

      this.checkAlreadyExists(userdetails)
          // eslint-disable-next-line no-unused-vars
          .then(response=>{
            this.editProfileSuccessful = true;
            this.newUsername = '';
            this.newEmail = '';
            this.newPassword = '';
            this.currentPassword = '';
            this.confirmpass = '';
            this.signUpPressed = false;
            this.passwordtried = false;
            this.emailtried = false;
            this.$router.push('/logout');
          })
          // eslint-disable-next-line no-unused-vars
          .catch(response=>{
            console.log("catched");
            let values = Object.values(this.errorObject)
            if (values.includes(true)) {
              //debugging
              console.log("There are errors in exists")
              return;
            }
          })

      //this.$emit('details-submitted', userdetails)
      //axios was here
    }
  }
}
</script>

<style scoped>
.greencheck {
  max-width: 33%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  height: auto;
}

.sucHeader {
  text-align: center;
  font-size: 2.5vw;
  font-weight: bold;
  margin-top: 4vw;
  margin-bottom: 4vw;
}
</style>