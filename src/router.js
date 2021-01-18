import Vue from 'vue';
import Router from 'vue-router';

import SignUp from './views/Admin.vue';
import Home from './views/Home.vue';
import ProfilePage from "@/views/ProfilePage";
import login from "@/auth/login";
import Logout from "@/auth/Logout";
import GoBack from "@/auth/GoBack";
import NotAdmin from "@/auth/NotAdmin";
import NotFound from "@/auth/NotFound";
import SearchPage from "@/views/SearchPage";
import UploadFiles from "@/components/UploadFiles";
import VideoPage from "@/views/VideoPage";
import UploadVideoForm from "@/components/UploadVideoForm";
import Statistics from "@/views/Statistics";

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {path: '/', component: Home},
        {path: '/admin', component: SignUp,
            meta: {
                requiresAdmin: true,
            }},
        {path: '/profilepage/:id', component: ProfilePage, props: true,
            meta: {
                requiresAuth: true,
            }},
        {path: '/login', component: login,
            meta: {
                requiresVisitor: true,
            }},
        {path: '/logout', component: Logout},
        {path: '/goback', component: GoBack},
        {path: '/notadmin', component: NotAdmin},
        {path: '/notfound',component: NotFound},
        {path: '/users/:username', component: SearchPage, name: 'searchUser', props: true},
        {path: '/uploadpage',component: UploadFiles},
        {path: '/vid/:id',component: VideoPage, props: true},
        {path: '/testform',component: UploadVideoForm},
        {path: '/stats/:id',component: Statistics, props: true},
    ]
})