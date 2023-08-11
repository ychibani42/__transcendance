import { createApp } from "vue"
import "./style.css"
import { createRouter, createWebHistory } from "vue-router"
import App from './views/App.vue'


const router = createRouter ({
	history: createWebHistory(),
	routes: []
})


const app = createApp(App);

app.use(router);
app.mount('#app');
