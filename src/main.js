import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import router from './router';
import store from './store';

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(require('vue-moment'));

Vue.config.productionTip = false

store.dispatch('initializeCurrentUser').then(r => console.log( "REFRESH PAGE:" + r));
store.dispatch('initializeConnection').then(r=>{console.log("socketz: " + r)});
store.dispatch('initializeNotifications').then(r => {console.log("notifs: " + r)});


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.loggedIn) {
      next({
        path: '/login',
        //query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
  else if (to.matched.some(record => record.meta.requiresVisitor)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (store.getters.loggedIn) {
      next({
        path: '/goback',
        //query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
  else if (to.matched.some(record => record.meta.requiresAdmin)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.loggedIn) {
      next({
        path: '/login',
        //query: { redirect: to.fullPath }
      })
    }
    else if (!store.getters.getCurrentRoles.includes('ROLE_MODERATOR')){
      next({
        path: '/notadmin',
        //query: { redirect: to.fullPath }
      })
    }
    else {
      next()
    }
  }
  else {
    next() // make sure to always call next()!
  }
})

new Vue({
  router,store,
  beforeCreate() {
    // store.dispatch('initializeToken').then(r => console.log( "Initialize token:" + r));
    // store.dispatch('initializeCurrentUser').then(r => console.log( "Initialize user:" + r));
  },
  created() {
    console.log(this.$store.getters.getCurrentId);
    store.dispatch('initializeCurrentUser').then(r => console.log( "REFRESH PAGE:" + r));
  },
  render: h => h(App),
}).$mount('#app')

