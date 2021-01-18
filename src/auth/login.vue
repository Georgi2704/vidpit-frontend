<template>
  <div class="main">
    <h2 class="loginmessage">To see this page, please log in</h2>
    <div class="loginform">
      <form action="#" @submit.prevent="login">
        <b-form-group label="Username" label-for="dropdown-form-email-big">
          <b-form-input
              name="username"
              id="dropdown-form-email-big"
              size="md"
              placeholder="Username"
              v-model="username"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Password" label-for="dropdown-form-password-big">
          <b-form-input
              name="password"
              id="dropdown-form-password-big"
              type="password"
              size="md"
              placeholder="Password"
              v-model="password"
          ></b-form-input>
        </b-form-group>
        <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
          Invalid username or password.
        </b-alert>

<!--        <b-form-checkbox class="mb-3">Remember me</b-form-checkbox>-->
        <b-button variant="primary" size="md" type="submit">Sign In</b-button>
      </form>
      <hr class="solid">
      <button @click="$bvModal.show('bv-modal-example')" type="button" class="btn btn-info mb-2 w-100">
        New around here? - Sign up
      </button>
      <button type="button" class="btn btn-secondary w-100">Forgot Password?</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      showDismissibleAlert: false
    }
  },
  created() {
    window.scrollTo(0,0);
  }
  ,
  methods: {
    login() {
      this.$store.dispatch('retrieveCurrentUser',
          {
            username: this.username,
            password: this.password
          })
          // eslint-disable-next-line no-unused-vars
          .then(response => {
              this.$router.go(-1);
          })

          // eslint-disable-next-line no-unused-vars
          .catch(error => {
            this.showDismissibleAlert = true;
          });

    }
  }
}
</script>

<style scoped>
.main{
  -webkit-animation: fadein 2s;
}

.loginmessage {
  width: 50%;
  margin: auto;
  padding-bottom: 40px;
}

.loginform {
  width: 50%;
  margin: auto;
}

.main {
  width: 100%;
  padding-top: 100px;
  padding-bottom: 100px;
  margin: auto;
  background-color: #f1f1f1;
}
</style>