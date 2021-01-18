<template>
  <b-modal id="bv-modal-example" hide-footer hide-header-close>
    <template #modal-title>
      Welcome to vidPit !
    </template>
    <div v-if="signUpSuccessful===true">
      <img class="greencheck" src="../assets/green-checkmark.png">
      <h2 class="sucHeader">You signed up successfully!</h2>
    </div>
    <div v-if="signUpSuccessful===false">
      <h1 class="mb-4">Sign up, it's free</h1>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input @change="checkEmail" @input="removeEmailErrorMessage" type="text"
                 v-bind:class="['form-control',{'is-invalid': errorObject.emailIsEmpty},
                 {'is-invalid': errorObject.emailIsIncorrect}, {'is-invalid': removeAlreadyExistingEmailError}]"
                 id="exampleInputEmail1" aria-describedby="emailHelp"
                 placeholder="Enter email" name="email" v-model="email">
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
          <label for="exampleUsername1">Username</label>
          <input @input="checkUsername" type="text"
                 v-bind:class="['form-control',{'is-invalid': errorObject.usernameIsEmpty},
                 {'is-invalid': errorObject.usernameHasChars}, {'is-invalid': this.removeAlreadyExistingUserError}]"
                 id="exampleUsername1" placeholder="Username" v-model="username">
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
                 id="exampleInputPassword1" placeholder="Password" v-model="pass">
          <div v-if="errorObject.passwordHasError" class="invalid-feedback">
            Password should contain at least 8 characters.
          </div>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword2">Confirm Password</label>
          <input type="password" @input="removeConfirmPassErrorMessage"
                 v-bind:class="['form-control',{'is-invalid': errorObject.confpasswordHasError}]"
                 id="exampleInputPassword2" placeholder="Confirm Password" v-model="confirmpass">
          <div v-if="errorObject.confpasswordHasError" class="invalid-feedback">
            Please enter matching passwords.
          </div>
        </div>
        <div class="form-group form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Remember me</label>
        </div>
        <button
            type="submit" @click="setSignUpPressed()" class="btn btn-primary btn-lg align">Sign Up
        </button>
      </form>
    </div>
    <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example'); resetForm()">Close Me</b-button>
  </b-modal>
</template>

<script>
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';

export default {
  name: "SignUpForm",
  data() {
    return {
      usernameOfExistingUser: "",
      emailOfExistingUser: "",
      email: "",
      username: "",
      pass: "",
      confirmpass: "",
      passwordtried: false,
      emailtried: false,
      signUpPressed: false,
      modalShow: false,
      signUpSuccessful: false,

      errorObject: {
        emailAlreadyExists: false,
        usernameAlreadyExists: false,
        usernameHasChars: false,
        usernameIsEmpty: false,
        emailIsEmpty: false,
        emailIsIncorrect: false,
        passwordHasError: false,
        confpasswordHasError: false
      }
    }
  },
  computed:{
    removeAlreadyExistingUserError(){
      if (this.username === this.usernameOfExistingUser && this.signUpPressed === true) {
        return true;
      }
      return false;
    },
    removeAlreadyExistingEmailError(){
      if (this.email === this.emailOfExistingUser && this.signUpPressed === true) {
        return true;
      }
      return false;
    },
  },
  methods: {
    resetForm() {
      this.usernameOfExistingUser = '';
      this.emailOfExistingUser = '';
      this.username = '';
      this.email = '';
      this.pass = '';
      this.signUpSuccessful = false;
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
      if (this.email === null || this.email === '') {
        this.errorObject.emailIsEmpty = true;
      } else if (reGex.test(this.email) === false) {
        this.errorObject.emailIsIncorrect = true;
        this.emailtried = true;
      }

    },
    checkUsername() {
      this.errorObject.usernameHasChars = false;
      this.errorObject.usernameIsEmpty = false;
      let reGex = new RegExp("^(([a-z]||[A-Z])||[0-9])*([a-z]||[0-9])$");
      if (this.username === null || this.username === '') {
        this.errorObject.usernameIsEmpty = true;
      } else if (reGex.test(this.username) === false) {
        this.errorObject.usernameHasChars = true;
      }
    },
    removePassErrorMessage() {
      if (this.passwordtried === true && this.pass.length >= 8) {
        this.errorObject.passwordHasError = false;
      } else if (this.passwordtried === true && this.pass.length < 8) {
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
      if (reGex.test(this.pass) === false) {
        this.errorObject.passwordHasError = true;
        this.passwordtried = true;
      }
    },
    checkConfirmPassword() {
      this.errorObject.confpasswordHasError = false;
      if (this.confirmpass !== this.pass) {
        this.errorObject.confpasswordHasError = true;
      }
    },
    clearAlreadyExistsErrors(){
      this.errorObject.usernameAlreadyExists = false;
      this.errorObject.emailAlreadyExists = false;
    },
    checkAlreadyExists(userdetails) {
      console.log("cleared")

      return new Promise((resolve, reject) => {
        axios.post('/auth/signup', userdetails)
            .then(response => {
              console.log(response.data);
              resolve(response)
            })
            .catch(error => {
              console.log(error.response.data.emailAlreadyExists);
              console.log(error.response.data.userAlreadyExists);
              if(error.response.data.emailAlreadyExists === true){
                this.errorObject.emailAlreadyExists = true;
                this.emailOfExistingUser = this.email;
              }
              if(error.response.data.userAlreadyExists === true){
                this.errorObject.usernameAlreadyExists = true;
                this.usernameOfExistingUser = this.username;
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
        username: this.username,
        email: this.email,
        password: this.pass,
      }

      this.checkAlreadyExists(userdetails)
          // eslint-disable-next-line no-unused-vars
          .then(response=>{
            this.signUpSuccessful = true;
            this.username = '';
            this.email = '';
            this.pass = '';
            this.confirmpass = '';
            this.signUpPressed = false;
            this.passwordtried = false;
            this.emailtried = false;
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