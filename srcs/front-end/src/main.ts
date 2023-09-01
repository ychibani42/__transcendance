import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import Axios  from "./services"
import router from "./router"
import VueAxios from "vue-axios";
import { createStore } from "vuex";

const store = createStore({
	state: {
		count: 0,
	}
	/* state, actions, mutations */
  });

const app = createApp(App)

app.use(VueAxios, Axios).use(router).use(store).mount("#app")
