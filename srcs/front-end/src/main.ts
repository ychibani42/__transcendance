import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import Axios  from "./services"
import router from "./router"
import VueAxios from "vue-axios";
import store from './store'
import VueCookies from 'vue-cookies'
import Vue3Toastify from 'vue3-toastify'


createApp(App)
.use(router)
.use(store)
.use(Vue3Toastify)
.use(VueAxios,Axios)
.use(VueCookies)
.mount("#app")
