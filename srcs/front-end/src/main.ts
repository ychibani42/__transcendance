import { createApp } from 'vue'
import "./style.css"
import App from './App.vue'
import Axios  from "./services"
import router from "./router"
import VueAxios from "vue-axios";
import { createStore } from "vuex";
import { io } from 'socket.io-client';

const store = createStore({
	state: {
		socket: null,
	},
	mutations: {
		setSocket(state: any, socket: any) {
			state.socket = socket;
		}
	},
	actions: {
		initializeSocket({commit}) {
			const socket = io('http://localhost:3000');
			commit('setSocket', socket);
		},
	},
	getters: {
		getSocket(state) {
			return state.socket;
		}
	}
	/* state, actions, mutations */
  });

const app = createApp(App)

app.use(VueAxios, Axios).use(router).use(store).mount("#app")
