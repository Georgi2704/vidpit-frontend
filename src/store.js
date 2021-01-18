import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

axios.defaults.baseURL = 'http://localhost:8080';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        count: 0,
        currentUser: null,
        hasLoggedOut: false,
        searchedUser: null,
        foundUsers: [],
        newestVideos:[],
        currentVideo: null,
        currentStats:null,
        updateChart: false,
        stompClient: null,
        received_messages: [],
        connected: false
    },

    //====================================GETTERS=========================================================
    getters:{
        loggedIn(state){
            //console.log("Current token:" + state.token)
            if (state.currentUser !== null){
                return true;
            }
            console.log("no user");
            return false;
        },
        getCurrentEmail(state){
            let ObjectUser = JSON.parse(state.currentUser);
            return ObjectUser.email;
        },
        getCurrentUser(state){
            let ObjectUser = JSON.parse(state.currentUser);
            return ObjectUser.username;
        },
        getCurrentRoles(state){
            let ObjectUser = JSON.parse(state.currentUser);
            return ObjectUser.roles;
        },
        getCurrentAccessToken(state){
            let ObjectUser = JSON.parse(state.currentUser);
            return ObjectUser.accessToken;
        },
        getCurrentId(state){
            let ObjectUser = JSON.parse(state.currentUser);
            return ObjectUser.id;
        },
        getCurrentProfilePic(state){
            let ObjectUser = JSON.parse(state.currentUser);
            return ObjectUser.profilePic;
        }
        ,
        getHasLoggedOut(state){
            return state.hasLoggedOut;
        },
        getSearchedUser(state){
            return state.searchedUser;
        },
        IsSearchUserSameAsCurrent(state){
            let ObjectUser = JSON.parse(state.currentUser);
            if (state.searchedUser.id === ObjectUser.id){
                return true;
            }
            else{
                return false;
            }
        },
        getFoundUsers(state){
            return state.foundUsers;
        },
        getFoundUsersCount(state){
            return state.foundUsers.length;
        },
        getNewestVideos(state){
            return state.newestVideos;
        },
        getCurrentVideo(state){
            return state.currentVideo;
        },
        getCurrentStats(state){
            return state.currentStats;
        },
        getChartStatus(state){
            return state.updateChart;
        }
    },

    ///===========================================MUTATIONS================================================
    mutations: {
        retrieveCurrentUser(state, currentUser){
            state.currentUser = currentUser;
        },
        initializeCurrentUser(state, currentUser){
            state.currentUser = currentUser;
        },
        initializeNotifications(state, payload){
            state.received_messages = payload;
        },
        destroyCurrentUser(state){
            state.currentUser = null;
        },
        changeLogoutStatus(state, payload){
            state.hasLoggedOut = payload;
        },
        getSearchedUser(state, userObject){
            state.searchedUser = userObject;
        },
        destroySearchedUser(state){
            state.searchedUser = null;
        },
        searchUser(state, payload){
            state.foundUsers = payload;
        },
        getNewestVideos(state, payload){
            state.newestVideos = payload;
        },
        setCurrentVideo(state, payload){
            state.currentVideo = payload;
        },
        getStatisticsForUser(state, payload){
            state.currentStats = payload;
        },
        updateChart(state, payload){
            state.updateChart = payload;
        }
    },

    ///===========================================ACTIONS================================================
    actions: {
        destroyCurrentUser(context){
            //put if here (if current user is logged in !)
                localStorage.removeItem('currentUser');
                context.commit('destroyCurrentUser');
        },
        retrieveCurrentUser(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('/auth/signin', {
                    username: credentials.username,
                    password: credentials.password
                })
                    .then(response => {
                        const userData = JSON.stringify(response.data);
                        localStorage.setItem('currentUser', userData);
                        //console.log(userData);
                        context.commit('retrieveCurrentUser', userData);
                        resolve(response);
                    })
                        .catch(error => {
                        console.log(error);
                        reject(error);
                    })
            })
        },
        getSearchedUser(context, id){
            return new Promise((resolve, reject) => {
                axios.get(`/user/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.getters.getCurrentAccessToken
                    }
                })
                    .then(response => {
                        let userObject = {
                            username: '',
                            dateRegistered: '',
                        }
                        userObject.username = response.data.username;
                        userObject.registered_at = response.data.registered_at;
                        userObject.id=response.data.id;
                        userObject.profilePic=response.data.profilePic;

                        context.commit('getSearchedUser', userObject);
                        resolve(response);

                    })
                    .catch(error => {
                        router.push('/notfound');
                        console.log(error);
                        reject(error);
                    })
            })
        },
        searchUser(context, username){
            return new Promise((resolve, reject) => {
                axios.get('/auth/users', {params: {username: username}}
                )
                    .then(response => {
                        let users = response.data
                        context.commit('searchUser', users);
                        resolve(response);
                    })
                    .catch(error => {
                        console.log(error)
                        reject(error);
                    });
            })
        },
        getNewestVideos(context){
            return new Promise((resolve, reject)=> {
                axios.get('/vid/all')
                    .then(response =>{
                        let newestVideos = response.data;
                        context.commit('getNewestVideos', newestVideos);
                        resolve(response);
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error);
                    })
            })
        },

        getStatisticsForUser(context, payload){
            return new Promise((resolve, reject)=> {
                axios.get(`/follow/user/${payload.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.getters.getCurrentAccessToken
                    },
                    params: {
                        year: payload.year
                    }
                })
                    .then(response =>{
                        let statistics = response.data;
                        context.commit('getStatisticsForUser', statistics);
                        resolve(response);
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error);
                    })
            })
        },
        getUsernameByToken(context){
            return new Promise((resolve, reject) => {
                axios.get('/auth/getusername', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access_token')
                    }
                })
                    .then(response => {
                        const currentUsername = response.data;
                        //console.log("Debug username: " + currentUsername);

                        localStorage.setItem('currentUser', currentUsername);
                        context.commit('retrieveCurrentUser', currentUsername);

                        resolve(response);
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error);
                    })
            })
        },

        initializeConnection(){
            this.socket = new SockJS("http://localhost:8080/gs-guide-websocket");
            this.state.stompClient = Stomp.over(this.socket);
            this.state.stompClient.connect(
                {},
                // eslint-disable-next-line no-unused-vars
                frame => {
                    this.state.connected = true;
                    this.state.stompClient.subscribe("/topic/greetings", tick => {
                        // console.log(tick);
                        let tickMessage = JSON.parse(tick.body).content;
                        if (!(tickMessage.sender === this.getters.getCurrentUser)){
                            if (tickMessage.target === this.getters.getCurrentUser){
                                this.state.received_messages.push(tickMessage);
                                localStorage.setItem('notifications', JSON.stringify(this.state.received_messages));
                            }
                        }
                    });
                },
                error => {
                    console.log(error);
                    this.state.connected = false;
                }
            );
        },
        initializeNotifications(context){
            if(localStorage.getItem('notifications') !== null){
                let notifications = JSON.parse(localStorage.getItem('notifications'));
                context.commit('initializeNotifications', notifications);
            }
        },

        initializeCurrentUser(context){
        let currentUser = localStorage.getItem('currentUser');
        context.commit('initializeCurrentUser', currentUser);
        }
    }
})