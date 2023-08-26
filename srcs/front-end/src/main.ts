import { createApp } from "vue"
import "./style.css"
import App from './App.vue'
import Axios  from "./services"
import router from "./router"
import VueAxios from "vue-axios";


createApp(App)
.use(VueAxios,Axios)
.use(router)
.mount("#app")
