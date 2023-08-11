import { createApp } from "vue"
import "./style.css"
import App from './views/App.vue'
import router from './router'


const Home = { template: '<div class = "chat-container" v-else>' }


const router = VueRouter.createRouter({
	history: VueRouter.createWebHistory(),
	routes
})

const app = createApp(App).use(router).mount('#app');

